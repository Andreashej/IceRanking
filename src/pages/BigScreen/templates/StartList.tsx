import React, { AnimationEventHandler, useMemo } from 'react';
import { FlatListItem } from '../../../components/partials/FlatList';
import { StartListEntry } from '../../../models/startlist.model';
import { Test } from '../../../models/test.model';
import { AnimatedFlatList } from './components/AnimatedFlatList';

type Phase = "PREL" | "AFIN" | "BFIN" | "CFIN" | "FIN"

const StartListItem: React.FC<FlatListItem<StartListEntry, Phase>> = ({ item, show, onHidden, onShown, parent: phase }) => {
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
                <div className='row-marker' style={{ backgroundColor: phase !== "PREL" ? `var(--${item.color})` : 'var(--blue)' }}>{item.startGroup}</div>
                <div>{item.rider?.fullname}</div>
                <div>{item.horse?.horseName}</div>
                <div className="text-right">{item.rider?.ageGroup?.split(' ').map((word => word[0]))}</div>
            </div>
        </li>
    )
}

type StartListProps = {
    startList: StartListEntry[]
    test: Test;
    phase: Phase;
}


export const StartList: React.FC<StartListProps> = ({ startList, test, phase }) => {
    const phaseText = useMemo(() => {
        switch(phase) {
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
        header={<>{test.testName} {phaseText} - <small>Start List</small></>} 
        headerImg={test.sponsorLogo ?? "assets/img/ICeCompass_Logo_Final6.png" }
        items={startList} RenderComponent={StartListItem} 
        itemsPerPage={10} 
        timePerPage={15000}
        parent={phase}
    />
}