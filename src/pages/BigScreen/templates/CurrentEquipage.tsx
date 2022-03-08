import React from 'react';
import { FlatListItem } from '../../../components/partials/FlatList';
import { Result } from '../../../models/result.model';
import { StartListEntry } from '../../../models/startlist.model';
import { Test } from '../../../models/test.model';
import { markToDouble } from '../../../tools';
import { AnimatedFlatList } from './components/AnimatedFlatList';
import { JudgeCard, judgeNoToLetter } from './components/JudgeCard';
import { LowerThird } from './components/LowerThird';



const EquipageResult: React.FC<FlatListItem<Result, Test>> = ({ item: result, onHidden, show, parent: test}) => {

    const marks = result.marks?.map((mark) => {
        const m = markToDouble(mark.mark, test.roundingPrecision - 1);
        return (
            <div key={`${mark.judgeId}.${result.sta}`}>
                <span>{judgeNoToLetter(mark.judgeNo)}</span>
                <span className="sign">{m}</span>
                {mark.redCard && <JudgeCard color="red" />}
                {mark.yellowCard && <JudgeCard color="yellow" />}
                {mark.blueCard && <JudgeCard color="blue" />}
            </div>
        );
    });

    const finalMark = <>
        <div style={{ backgroundColor: "var(--blue)" }}>
            <span className="light mr-2">Rank</span>
            <span>{result.rank}</span>
        </div>
        <div>
            <span className="light mr-2">Total</span>
            <span>{markToDouble(result.mark, test.roundingPrecision)}</span>
        </div>
    </>

    return (
        <LowerThird 
            header={<>{result.rider?.fullname}</>} 
            color={result.color} 
            onHidden={onHidden} 
            show={show} 
            className="flatlist-item"
            gridTemplateColumns={`repeat(${result.marks?.length},20%)`}
            footer={finalMark}
        >
            {marks}
        </LowerThird>
    )
}


const EquipageInfo: React.FC<FlatListItem<StartListEntry, Test>> = ({ item, onHidden, show }) => {

    return (
       <LowerThird header={<>{item.rider?.fullname}</>} color={item.color} onHidden={onHidden} show={show} className="flatlist-item" gridTemplateColumns="2fr min-content">
            <div>    
                <span className="mr-4">{item.horse?.horseName}</span>
                <span className="light">{item.horse?.feifId}</span>
            </div>
            <div>
                <span>{item.rider?.ageGroup}</span>
            </div>
        </LowerThird>
    )
}

type CurrentEquipageProps = {
    type: 'info' | 'result';
    currentGroup: StartListEntry[] | Result[];
    test: Test;
}

export const CurrentEquipage: React.FC<CurrentEquipageProps> = ({ type, currentGroup, test }) => {
    const renderTemplate = type === 'info' ? EquipageInfo : EquipageResult;

    return (
        <>
            <AnimatedFlatList parent={test} items={currentGroup} RenderComponent={renderTemplate} itemsPerPage={1} timePerPage={10000} usePlaceholder={false} />
        </>
    )
}