import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'primereact/tooltip';
import React from 'react';

type FABProps = {
    label: string;
    icon?: FontAwesomeIconProps['icon'];
    textIcon?: string;
    onClick?: () => void;
}

export const FloatingActionButton: React.FC<FABProps> = ({label, icon, onClick, textIcon}) => {

    const id = label.replaceAll(' ', '-')

    return (
        <>
            <Tooltip className="fab-tooltip" target={`#${id}`} />
            <button 
                id={id} 
                data-pr-tooltip={label} 
                className="fab p-button p-button-primary p-button-rounded p-button-raised"
                onClick={() => onClick?.()}
            >
                    {(icon && <FontAwesomeIcon icon={icon} />) 
                    || 
                    (textIcon && <span>{textIcon}</span>)}
            </button>
        </>
    )
}