import React, {useState} from 'react';

import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';

import Header from '../partials/Header';

let mobileMenuButton = null;
let adminMenuRef = null;
let adminMenuContainer = null;

const Page = ({title, subtitle, pretitle, icon, menuItems = [], adminMenuItems = [], children}) => {
    const [menuIcon, setMenuIcon] = useState('cog');
    const [sidebarVisibility, setSidebarVisibility] = useState(false);

    const mobileMenuBtn = <Button icon={`pi pi-bars`} className="fab p-button-primary p-button-raised" onClick={(event)=>setSidebarVisibility(!sidebarVisibility)} />;
    const adminMenuBtn = <Button icon={`pi pi-${menuIcon}`} className="fab p-button-success p-button-raised" tooltip="Ranking settings" tooltipOptions={{position: "bottom"}} onClick={event => adminMenuRef.toggle(event)} />;
    const adminMenu = <Menu 
        model={adminMenuItems} 
        ref={el => adminMenuRef=el} 
        popup={true} 
        appendTo={adminMenuContainer} 
        onHide={() => setMenuIcon('cog')}
        onShow={() => setMenuIcon('times')}
    />;

    return (
        <>
            <Header title={title} subtitle={subtitle} pretitle={pretitle} icon={icon} />
            <div className="page-content container">
                <div className="fab-container d-flex d-lg-none left" ref={el => mobileMenuButton = el}>{mobileMenuBtn}</div>
                {adminMenuItems.length > 0 ? <div className="fab-container right d-none d-lg-flex" ref={el => adminMenuContainer = el}>{adminMenu}{adminMenuBtn}</div> : null}
                <div className="row">
                    {/* <div className="d-flex d-lg-none submenu mobile">
                        <Button icon="pi pi-bars" className="mobile-menu-button" onClick={(event)=>setSidebarVisibility(!sidebarVisibility)} />
                    </div> */}
                    <div className="d-none d-lg-flex submenu">
                        <Menu model={menuItems} />
                    </div>
                    <div className="col-12 col-lg page-container">
                        <div className="container-fluid">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            {menuItems && <Sidebar visible={sidebarVisibility} closeOnEscape={true} onHide={() => setSidebarVisibility(false)} className="mobile-sidebar">
                <div className="header">
                    <h2>{title}</h2>
                </div>
                <Menu model={menuItems.concat({
                    label: "Administration",
                    items: adminMenuItems
                })} className="mobile-menu" />
            </Sidebar>}
        </>
    )
};

export default Page;