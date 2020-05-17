import React from 'react';

import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';

import Header from '../partials/Header';

let mobileMenu = null;

const Page = ({title, subtitle, pretitle, icon, menuItems = [], children}) => {

    return (
        <>
            <Header title={title} subtitle={subtitle} pretitle={pretitle} icon={icon} />
            <div className="container">
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