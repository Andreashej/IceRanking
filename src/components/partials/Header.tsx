import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Skeleton } from './Skeleton';

type HeaderProps = {
    title: string | null;
    subtitle?: string | null;
    pretitle?: string | null;
    icon?: IconProp;
    content?: JSX.Element
}

const Header: React.FC<HeaderProps> = ({title, subtitle, pretitle, icon, content = null}) => {
    const i = icon ? <FontAwesomeIcon className="mr-2" icon={icon} size="2x" /> : null; 
    
    const pretitleRender = useMemo(() => {
        if (pretitle === null) return <Skeleton style={{ height: "2rem", width: "25%" }} />;
        if (!pretitle) return null;
        
        return pretitle

    }, [pretitle])

    const titleRender = useMemo(() => {
        if (title === null) 
        return <Skeleton style={{ height: "3.5rem", width: "35%", marginBottom: "0.5rem" }} />;

        return <h1 className="display-4">{title}</h1>;
    }, [title]);

    const subtitleRender = useMemo(() => {
        if (subtitle === null) return <Skeleton style={{ height: "1.5rem", width: "20%", marginBottom: "1rem" }} />;
        if (!subtitle) return null;

        return <p className="lead subtitle">{subtitle}</p>
    }, [subtitle])

    if (!content) {
        content = (
            <>
                {<h2 className="pretitle muted">{i}{pretitleRender}</h2>}
                {titleRender}
                <hr className="stylish-line" />
                {subtitleRender}
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