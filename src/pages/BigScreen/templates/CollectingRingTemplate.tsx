import React from 'react'
import { useScreenContext } from '../BigScreen'

export const CollectingRingTemplate: React.FC = () => {
    const { screen, screenGroup } = useScreenContext();

    return (
        <>
            <h2>Collecting Ring</h2>
            <div>Screen ID: {screen?.id}</div>
            <div>ScreenGroup ID: {screenGroup?.id}</div>
            <div>Template: {screenGroup?.template}</div>
        </>
    )
}