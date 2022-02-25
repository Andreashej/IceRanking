import React, { AnimationEventHandler, useEffect, useState } from 'react';
import { FlatListItem } from '../../../components/partials/FlatList';
import { Result } from '../../../models/result.model';
import { Test } from '../../../models/test.model';
import { useScreenContext } from '../BigScreen';
import { AnimatedFlatList } from './components/AnimatedFlatList';

const ResultListItem: React.FC<FlatListItem<Result, Test>> = ({ item: result, show, onHidden, onShown }) => {

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
                <div className='row-marker'>{result.rank}</div>
                <div>{result.rider?.fullname}</div>
                <div>{result.horse?.horseName}</div>
                <div className="text-right">
                    <b>{result.mark}</b>
                </div>
            </div>
            {/* <div className="row-end-marker">
                A
            </div> */}
        </li>
    )
}

type ResultListProps = {
    results: Result[];
}

export const ResultList: React.FC<ResultListProps> = ({ results }) => {
    const { screenGroup } = useScreenContext();

    return <AnimatedFlatList 
        header={<>{screenGroup?.test?.testName} - <small>Results</small></>}
        headerImg="assets/img/ICeCompass_Logo_Final6.png"
        items={results} 
        RenderComponent={ResultListItem} 
        itemsPerPage={10} 
        timePerPage={10000} 
    />
}
