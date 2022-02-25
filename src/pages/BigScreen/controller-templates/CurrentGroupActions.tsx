import React from 'react'
import { Socket } from 'socket.io-client'
import { FloatingActionButton } from '../../../components/partials/Fab'
import { useTest } from '../../../contexts/test.context'
import { ScreenGroup } from '../../../models/screengroup.model'

type CurrentGroupActionsProps = {
    screenGroup: ScreenGroup;
    socket?: Socket;
    previewGroup?: number;
}

export const CurrentGroupActions: React.FC<CurrentGroupActionsProps> = ({ socket, previewGroup, screenGroup }) => {
    const [test] = useTest();

    const showGroup = () => {
        socket?.emit('Group.Show', screenGroup.id, test?.id, previewGroup)
    }

    return (
        <>
            <FloatingActionButton label="Show Group" icon="list-ol" onClick={showGroup} />
        </>
    )
}