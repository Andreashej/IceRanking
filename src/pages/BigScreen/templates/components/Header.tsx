import React, { AnimationEventHandler, CSSProperties } from 'react'

type HeaderProps = {
    headerContent: JSX.Element;
    subHeaderContent?: JSX.Element | string;
    style?: CSSProperties;
    onHidden?: () => void;
    imgSrc?: string;
}

export const Header: React.FC<HeaderProps> = ({ headerContent, subHeaderContent, style, onHidden, imgSrc }) => {

    const hide: AnimationEventHandler<HTMLDivElement> = (event) => {
        if (event.animationName === 'scaleOut') {
            onHidden?.();
        }
    }

    return (
        <div className="header" style={style} onAnimationEnd={hide}>
            <div className="header-text">
                {headerContent}
            </div>
            {subHeaderContent && <div className="header-subtitle">
                {subHeaderContent}
            </div>}
            {imgSrc && <div className="header-logo"><img src={imgSrc} alt="logo" /></div>}
        </div>
    )
}