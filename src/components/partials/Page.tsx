import React, {useEffect, useMemo, useState} from 'react';

import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';

import Header from './Header';
import { MenuItem } from 'primereact/menuitem';
import { useHistory } from 'react-router-dom';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useFullscreen } from '../../App';

type PageProps = {
    title: string | null;
    subtitle?: string | null;
    pretitle?: string;
    icon?: IconProp;
    menuItems?: MenuItem[];
    adminMenuItems?: MenuItem[];
}

const Page: React.FC<PageProps> = ({title, subtitle, pretitle, icon, menuItems = [], adminMenuItems = [], children}) => {
    const [sidebarVisibility, setSidebarVisibility] = useState(false);
    const [fullscreen] = useFullscreen();
    const history = useHistory();

    const mobileMenuBtn = <Button icon={`pi pi-bars`} className="fab p-button-primary p-button-raised" onClick={()=>setSidebarVisibility(!sidebarVisibility)} />;

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

    if (fullscreen) {
        return <>{children}</>;
    }

    return (
        <>
            <Header title={title} subtitle={subtitle} pretitle={pretitle} icon={icon} />
            <div className="page-content container">
                {(menuItems.length > 0) && <div className="fab-container d-flex d-lg-none left">{mobileMenuBtn}</div>}
                <Menu model={allMenuItems} style={{width: '100%'}} className="submenu" />
                <div className="main-content">
                    {children}
                </div>
            </div>
            {menuItems && <Sidebar visible={sidebarVisibility} closeOnEscape={true} onHide={() => setSidebarVisibility(false)} className="mobile-sidebar">
                <div className="header">
                    <h2>{title}</h2>
                </div>
                <Menu model={allMenuItems} className="mobile-menu" />
            </Sidebar>}
        </>
    )
};

export default Page;