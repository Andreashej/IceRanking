import React, {useEffect, useMemo, useState} from 'react';

import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';

import Header from './Header';
import { MenuItem } from 'primereact/menuitem';
import { useHistory } from 'react-router-dom';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type PageProps = {
    title: string | null;
    subtitle?: string | null;
    pretitle?: string;
    icon?: IconProp;
    menuItems?: MenuItem[];
    adminMenuItems?: MenuItem[];
}

const Page: React.FC<PageProps> = ({title, subtitle, pretitle, icon, menuItems = [], adminMenuItems = [], children}) => {
    // const [menuIcon, setMenuIcon] = useState('cog');
    const [sidebarVisibility, setSidebarVisibility] = useState(false);
    const history = useHistory();
    // const adminMenuRef = useRef<Menu>(null);
    // const adminMenuContainer = useRef(null);


    const mobileMenuBtn = <Button icon={`pi pi-bars`} className="fab p-button-primary p-button-raised" onClick={()=>setSidebarVisibility(!sidebarVisibility)} />;
    // const adminMenuBtn = <Button icon={`pi pi-${menuIcon}`} className="fab p-button-success p-button-raised" tooltip="Settings" tooltipOptions={{position: "bottom"}} onClick={event => {
    //     if (adminMenuRef && adminMenuRef.current) 
    //         adminMenuRef.current.toggle(event)
    // }} />;
    // const adminMenu = <Menu 
    //     model={adminMenuItems} 
    //     ref={adminMenuRef} 
    //     popup={true} 
    //     appendTo={adminMenuContainer.current}
    //     onHide={() => setMenuIcon('cog')}
    //     onShow={() => setMenuIcon('times')}
    // />;

    // let mobileMenuItems: MenuItem[] = menuItems;
    
    // if (adminMenuItems.length > 0) {
    //     mobileMenuItems = mobileMenuItems.concat({
    //         label: "Administration",
    //         items: adminMenuItems
    //     })
    // }
    const allMenuItems = useMemo(() => {
        if (adminMenuItems.length === 0) return menuItems;

        return menuItems.concat({
                    label: "Administration",
                    items: adminMenuItems
                });
    }, [menuItems, adminMenuItems])

    useEffect(() => {
        const unlisten = history.listen(() => {
            setSidebarVisibility(false);
        });

        return unlisten;
    });

    return (
        <>
            <Header title={title} subtitle={subtitle} pretitle={pretitle} icon={icon} />
            <div className="page-content container">
                {(menuItems.length > 0) && <div className="fab-container d-flex d-lg-none left">{mobileMenuBtn}</div>}
                {/* {(adminMenuItems.length > 0) && <div className="fab-container right d-none d-lg-flex" ref={adminMenuContainer}>{adminMenu}{adminMenuBtn}</div>} */}
                <Menu model={allMenuItems} style={{width: '100%'}} className="submenu" />
                {/* <div className="row">
                    {menuItems.length > 0 && <div className="d-none d-lg-flex submenu">
                    </div>}
                    <div className="col-12 col-lg page-container">
                        <div className="container-fluid">
                        </div>
                        </div>
                    </div> */}
                <div className="main-content">
                    {children}
                </div>
            </div>
            {menuItems && <Sidebar visible={sidebarVisibility} closeOnEscape={true} onHide={() => setSidebarVisibility(false)} className="mobile-sidebar">
                <div className="header">
                    <h2>{title}</h2>
                </div>
                <Menu model={menuItems} className="mobile-menu" />
            </Sidebar>}
        </>
    )
};

export default Page;