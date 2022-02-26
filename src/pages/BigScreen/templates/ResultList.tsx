import React, { AnimationEventHandler, useMemo } from 'react';
import { FlatListItem } from '../../../components/partials/FlatList';
import { Result } from '../../../models/result.model';
import { Test } from '../../../models/test.model';
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
            {result.scope && <div className={`row-end-marker ${result.scope.toLowerCase()}`}>
                {result.scope[0]}
            </div>}
        </li>
    )
}

type ResultListProps = {
    results: Result[];
    test: Test;
    phase: "PREL" | "AFIN" | "BFIN" | "CFIN" | "FIN";
}

export const ResultList: React.FC<ResultListProps> = ({ results, test, phase }) => {
    const phaseText = useMemo(() => {
        switch(phase) {
            case 'PREL':
                return "Preliminary";
            case 'AFIN':
                return 'A-final';
            case 'BFIN':
                return 'B-final';
            case 'CFIN':
                return 'C-final';
            default:
                return '';
        }
    }, [phase])

    return <AnimatedFlatList 
        header={<>{test.testName} {phaseText} - <small>Results</small></>}
        headerImg={test.sponsorLogo ?? "assets/img/ICeCompass_Logo_Final6.png"}
        items={results} 
        RenderComponent={ResultListItem} 
        itemsPerPage={10} 
        timePerPage={10000} 
    />
}
