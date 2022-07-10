import React, { AnimationEventHandler, useMemo } from 'react';
import { FlatListItem } from '../../../components/partials/FlatList';
import { Result } from '../../../models/result.model';
import { Test } from '../../../models/test.model';
import { markToDouble } from '../../../tools';
import { AnimatedFlatList } from './components/AnimatedFlatList';

type Phase = "PREL" | "AFIN" | "BFIN" | "CFIN" | "FIN";

const ResultListItem: React.FC<FlatListItem<Result, {phase: Phase, test: Test}>> = ({ item: result, show, onHidden, onShown, extraData }) => {

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
                <div className='row-marker' style={{ backgroundColor: extraData.phase !== "PREL" ? `var(--${result.color})` : 'var(--blue)' }}>{result.rank}</div>
                <div>{result.rider?.fullname}</div>
                <div>{result.horse?.horseName}</div>
                <div className="text-right">
                    <b>{markToDouble(result.mark, extraData.test?.roundingPrecision ?? 2)}</b>
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
    phase: Phase;
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
        extraData={{phase, test}}
    />
}
