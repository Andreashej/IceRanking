import React, { AnimationEventHandler, CSSProperties } from 'react'
import { Header } from './Header';

type LowerThirdProps = {
    onHidden?: () => void;
    color?: string;
    header: JSX.Element;
    footer?: JSX.Element;
    show?: boolean;
    className?: string;
    gridTemplateColumns?: CSSProperties['gridTemplateColumns']
}

export const LowerThird: React.FC<LowerThirdProps> = ({ children, onHidden, show, header, color = 'default', className, gridTemplateColumns = "1fr", footer }) => {
    const hide: AnimationEventHandler<HTMLDivElement> = (event) => {
        if (event.animationName === 'scaleOut') {
            onHidden?.();
        }
    }

    return (
        <div className={`lower-third ${show ? 'show' : 'hide'} ${className}`} onAnimationEnd={hide}>
            <Header headerContent={header} style={{ borderColor: `var(--${color})` }} />
            <div className="extra" style={{ gridTemplateColumns: gridTemplateColumns }}>
                {children}
            </div>
            {footer && <div className="footer">
                {footer}
            </div>}
        </div>
    )
}