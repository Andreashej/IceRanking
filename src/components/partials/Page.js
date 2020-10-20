import React, {useState} from 'react';

import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';

import Header from '../partials/Header';

let mobileMenu = null;
let adminMenuRef = null;
let adminMenuContainer = null;

const Page = ({title, subtitle, pretitle, icon, menuItems = [], adminMenuItems = [], children}) => {
    const [menuIcon, setMenuIcon] = useState('cog');

    const adminMenuBtn = <Button icon={`pi pi-${menuIcon}`} className="admin-button p-button-success p-button-raised" tooltip="Ranking settings" tooltipOptions={{position: "bottom"}} onClick={event => adminMenuRef.toggle(event)} />;
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
                {adminMenuItems.length > 0 ? <div className="admin-menu-container" ref={el => adminMenuContainer = el}>{adminMenu}{adminMenuBtn}</div> : null}
                <div className="row">
                    <div className="d-flex d-lg-none submenu mobile w-100">
                        <Menu model={menuItems} popup={true} ref={el => mobileMenu=el} style={{width: "100%"}} />
                        <Button label="Menu" icon="pi pi-bars" className="mobile-menu-button" onClick={(event)=>mobileMenu.toggle(event)} style={{width: "100%", borderRadius: 0}} />
                    </div>
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
        </>
    )
};

export default Page;