import React from 'react';

const Alert = ({type, children, className}) => {
    return (
        <div className={`alert alert-${type} ${className}`}>
            {children}
        </div>

    );
}

export default Alert;