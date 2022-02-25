import React, { AnimationEventHandler, useEffect, useState } from 'react';
import { FlatListItem } from '../../../components/partials/FlatList';
import { Result } from '../../../models/result.model';
import { StartListEntry } from '../../../models/startlist.model';
import { Test } from '../../../models/test.model';
import { useScreenContext } from '../BigScreen';
import { AnimatedFlatList } from './components/AnimatedFlatList';


const GroupInfo: React.FC<FlatListItem<StartListEntry, Test>> = ({ item, onHidden, show }) => {

    const hide: AnimationEventHandler<HTMLDivElement> = (event) => {
        if (event.animationName === 'scaleOut') {
            onHidden?.();
        }
    }

    return (
        <div className={`flatlist-item ${show ? 'show' : 'hide'}`} onAnimationEnd={hide}>
                <div className="row-content" style={{ gridTemplateColumns: "1fr" }}>
                    <div className="row-marker" style={{ backgroundColor: `var(--${item.color})` }}></div>
                    <div>{item.rider?.fullname}</div>
                </div>
        </div>
    )
}

type CurrentGroupProps = {
    currentGroup: StartListEntry[] | Result[];
}

export const CurrentGroup: React.FC<CurrentGroupProps> = ({ currentGroup }) => {
    return (
        <>
            <AnimatedFlatList items={currentGroup} RenderComponent={GroupInfo} itemsPerPage={6} usePlaceholder={false} />
        </>
    )
}