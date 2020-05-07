import React from 'react';

import SubmenuItem from './SubmenuItem';

const Submenu = ({ items }) => {
    const submenuItems = items.map(({ text, link, state, id }) => {
        return <SubmenuItem key={id} id={id} text={text} link={link} state={state} />
    });

    return (
        <div className="container-fluid submenu">
            <ul className="nav container">
                {submenuItems}
            </ul>
        </div>
    );
}

export default Submenu;