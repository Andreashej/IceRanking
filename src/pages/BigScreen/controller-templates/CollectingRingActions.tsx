import React from 'react'
import { Socket } from 'socket.io-client'
import { FloatingActionButton } from '../../../components/partials/Fab'
import { useTest } from '../../../contexts/test.context'
import { ScreenGroup } from '../../../models/screengroup.model'

type CollectingRingActionsProps = {
    screenGroup: ScreenGroup;
    socket?: Socket;
    previewGroup?: number;
}

export const CollectingRingActions: React.FC<CollectingRingActionsProps> = ({ socket, previewGroup, screenGroup }) => {
    const [test] = useTest();

    const callGroup = () => {
        socket?.emit('CollectingRing.Call', screenGroup.id, test?.id, previewGroup)
    }

    return (
        <>
            <FloatingActionButton label="Call to Collecting Ring" icon="bullhorn" onClick={callGroup} />
        </>
    )
}