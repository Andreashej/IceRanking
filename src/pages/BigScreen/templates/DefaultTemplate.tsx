import React, { useEffect } from 'react'
import { useScreenContext } from '../BigScreen'

export const DefaultTemplate: React.FC = () => {
    const { show, onTemplateHidden } = useScreenContext();

    useEffect(() => {
        if (!show) {
            onTemplateHidden?.();
        }
    }, [show, onTemplateHidden])

    return (
        <>
            <div></div>
            {/* {show && <div>I am default!</div>} */}
        </>
    )
}