import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo } from 'react';
import { JudgeMark, Result } from '../../../../models/result.model';
import { Test } from '../../../../models/test.model';
import { markToDouble } from '../../../../tools';
import { JudgeCard, judgeNoToLetter } from './JudgeCard';

type MarkProps = {
    mark: JudgeMark;
    test: Test;
    result: Result;
}

export const Mark: React.FC<MarkProps> = ({ mark, test }) => {

    const displayMark = useMemo(() => {
        switch(mark.markType) {
            case 'mark':
                return <span className='sign'>{markToDouble(mark.mark, test.roundingPrecision - 1)}</span>
            case 'time':
                const roundingPrecision = test.testcode === 'PP1' ? 1 : 2;
                return <span className='sign'><FontAwesomeIcon icon="stopwatch" style={{ marginRight: ".125rem" }} />{markToDouble(mark.mark, roundingPrecision)}"</span>
            case 'flag':
                return (
                    <span className='sign' style={{ backgroundColor: `var(--${mark.flagOk ? 'green' : 'red'})` }}>
                        {mark.flagOk ? 'OK' : 'XX'}
                    </span>
                )
        }
    }, [mark, test])

    return (
        <div>
            {test.testcode !== 'PP1' || <span>{judgeNoToLetter(mark.judgeNo)}</span>}
            {displayMark}
            {mark.redCard && <JudgeCard color="red" />}
            {mark.yellowCard && <JudgeCard color="yellow" />}
            {mark.blueCard && <JudgeCard color="blue" />}
        </div>
    );
}