import React from 'react';
import { Link } from 'react-router-dom';

const SubmenuItem = ({ text, link, state }) => {
    return (
        <li className="nav-item">
            <Link className={`nav-link ${state ? state : ''}`} to={link}>{text}</Link>
        </li>
    );
}

export default SubmenuItem;