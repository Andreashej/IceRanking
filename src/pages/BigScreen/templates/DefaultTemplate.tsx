import React from 'react'
import { useScreenContext } from '../BigScreen'

export const DefaultTemplate: React.FC = () => {
    const { screen, screenGroup } = useScreenContext();

    return (
        <>
            <div>Screen ID: {screen?.id}</div>
            <div>Client ID: {screen?.clientId}</div>
            <div>ScreenGroup ID: {screenGroup?.id}</div>
            <div>Template: {screenGroup?.template}</div>
        </>
    )
}