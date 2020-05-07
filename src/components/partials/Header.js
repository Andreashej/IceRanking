import React from 'react';

const Header = ({title, subtitle}) => {
    return (
        <div className="jumbotron jumbotron-fluid mb-0">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1 className="display-4">{title}</h1>
                        {subtitle ? <p className="lead">{subtitle}</p> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;