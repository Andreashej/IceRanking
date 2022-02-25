import React, { AnimationEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, FlatListItem } from '../../../components/partials/FlatList';
import { useTest } from '../../../contexts/test.context';
import { StartListEntry } from '../../../models/startlist.model';
import { Test } from '../../../models/test.model';
import { useScreenContext } from '../BigScreen';
import { AnimatedFlatList } from './components/AnimatedFlatList';

const StartListItem: React.FC<FlatListItem<StartListEntry, Test>> = ({ item, show, onHidden, onShown }) => {
    const animationEnd: AnimationEventHandler<HTMLLIElement> = (event) => {
        if (event.animationName === 'scaleOut') {
            onHidden?.();
        }

        if (event.animationName === 'scaleIn') {
            onShown?.();
        }
    }


    return (
        <li 
            className={`flatlist-item ${show ? 'show' : 'hide'}`} 
            style={{ gridTemplateColumns: "1fr 1rem" }} 
            onAnimationEnd={animationEnd}
        >
            <div className="row-content">
                <div className='row-marker'>{item.startGroup}</div>
                <div>{item.rider?.fullname}</div>
                <div>{item.horse?.horseName}</div>
                <div className="text-right">{item.rider?.ageGroup?.split(' ').map((word => word[0]))}</div>
            </div>
        </li>
    )
}

type StartListProps = {
    startList: StartListEntry[]
}


export const StartList: React.FC<StartListProps> = ({ startList }) => {
    const { screenGroup } = useScreenContext();

    return <AnimatedFlatList 
        header={<>{screenGroup?.test?.testName} - <small>Start List</small></>} 
        headerImg="assets/img/ICeCompass_Logo_Final6.png" 
        items={startList} RenderComponent={StartListItem} 
        itemsPerPage={10} 
        timePerPage={10000} 
    />
}