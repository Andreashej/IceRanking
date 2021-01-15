import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = ({title, subtitle, pretitle, icon, content = null}) => {
    const i = icon ? <FontAwesomeIcon className="mr-2" icon={icon} size="2x" /> : null;

    if (!content) {
        content = (
            <>
                {pretitle ? <h2 className="pretitle muted">{i}{pretitle}</h2> : i ? <h2 className="pretitle muted">{i}</h2> : null}
                <h1 className="display-4">{title}</h1>
                <hr className="stylish-line" />
                {subtitle ? <p className="lead subtitle">{subtitle}</p> : null}
            </>
        );
    }

    return (
        <div className="page-header jumbotron jumbotron-fluid mb-0">
            <div className="container">
                <div className="row">
                    <div className="col">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;