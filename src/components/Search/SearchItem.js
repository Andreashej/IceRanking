import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SearchItem = (item) => {
    let icon;

    switch (item.type) {
        case "ranking":
            icon = <FontAwesomeIcon icon="list-ol" size="2x" />;
            break;
        case "rider":
            icon = <FontAwesomeIcon icon="user" size="2x" />;
            break;
        case "horse":
            icon = <FontAwesomeIcon icon="horse-head" size="2x" />;
            break;
        case "competition":
            icon = <FontAwesomeIcon icon="calendar-alt" size="2x" />;
            break;
        default:
            icon = <FontAwesomeIcon icon="question" size="2x" />
            break;
    }

    return (
        <div className="row px-0 mx-0" style={{maxWidth: "100%"}}>
            <div className="col-1 d-flex justify-content-center align-items-center">
               {icon}
            </div>
            <div className="col">
                <span className="item-name">{item.listName}</span><br />
                <small className="text-muted">{item.secondaryText}</small>
            </div>
        </div>
    );
}

export default SearchItem;