import React, { useEffect, useState } from 'react';
import { useTest } from '../../../contexts/test.context';
import { getTestResults, getTestStartList } from '../../../services/v2/test.service';
import { StartListEntry } from '../../../models/startlist.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Result } from '../../../models/result.model';
import { getResult } from '../../../services/v2/result.service';
import { markToDouble } from '../../../tools';
import { Button } from 'primereact/button';
import { TestEntry, useControllerState } from '../BigScreenController';

type TableRowProps = {
    testEntry: TestEntry;
}

const TableRow: React.FC<TableRowProps> = ({ testEntry }) => {
    const [state, dispatch] = useControllerState();

    const isPreview = state.previewEntries?.includes(testEntry.id);
    const isProgram = state.programEntries?.includes(testEntry.id);

    const rowClasses = ['table-row', isPreview ? 'preview' : '', isProgram ? 'program' : ''];
    const [test] = useTest()

    const { startListEntry, result } = testEntry;

    // useEffect(() => {
    //     getResult(startListEntry.id, new URLSearchParams({ expand: 'marks' })).then((result) => {
    //         console.log(result);
    //         dispatch({ type: 'setResults', payload: [result] })
    //     })
    // }, [startListEntry, dispatch])

    const marks = result?.marks?.map((mark, index) => {
        const formattedMark = markToDouble(mark.mark, test?.roundingPrecision ?? 1);
        return (
            <span key={testEntry.id+mark.judgeNo}>
                {index !== 0 ? ` - ${formattedMark}` : formattedMark }
            </span>
        )
    });

    const setPreviewGroup = () => {
        dispatch({ type: 'setPreviewGroup', payload: startListEntry.startGroup })
    }

    const setPreviewEntry = () => {
        dispatch({ type: 'setPreviewEntry', payload: startListEntry.id });
    }

    const rowClassName = rowClasses.join(' ');
    return (
        <React.Fragment key={startListEntry.id}>
            <div className={rowClassName} onClick={setPreviewGroup}>{startListEntry.startGroup}</div>
            <div className={rowClassName}>
                <div className="color-card" style={{ 
                    backgroundColor: `var(--${startListEntry.color})`, 
                }}>
                </div>
            </div>
            <div className={rowClassName}>{startListEntry.rider?.fullname}</div>
            <div className={rowClassName}>{startListEntry.horse?.horseName}</div>
            <div className={rowClassName}>{startListEntry.state}</div>
            <div className={rowClassName}>{marks}</div>
            <div className={rowClassName}>{result?.mark}</div>
            <div className={rowClassName}>
                <Button 
                    label="Select" 
                    className="p-button-rounded p-button-raised p-button-primary" 
                    onClick={setPreviewEntry}
                    style={{ fontSize: ".8rem", padding: ".25rem .75rem" }}
                />
            </div>
        </React.Fragment>
    )
}

export const StartListController: React.FC = () => {
    const [test] = useTest();
    // const [startlist, setStartlist] = useState<StartListEntry[]>()
    const [state, dispatch] = useControllerState();

    useEffect(() => {
        if (!test) return;
        
        const params = new URLSearchParams({
            'expand': 'rider,horse'
        })

        const promises = Promise.all([
            getTestStartList(test.id, params), 
            getTestResults(test.id, new URLSearchParams({ 'expand': 'marks' }))
        ]);

        promises.then(([[startListEntries], [results]]) => {
            dispatch({ type: 'setStartList', payload: startListEntries })
            dispatch({ type: 'setResults', payload: results })
        });
    }, [test, dispatch])

    const tableRow = state.testEntries?.map((testEntry) => <TableRow 
        key={testEntry.id}
        testEntry={testEntry} 
    />)

    return (
        <>
        <div className="table" style={{ gridTemplateColumns: "minmax(3ch, min-content) 3rem 1fr 1fr min-content max-content min-content max-content" }}>
            <div className="table-header">#</div>
            <div className="table-header"></div>
            <div className="table-header">Rider</div>
            <div className="table-header">Horse</div>
            <div className="table-header">State</div>
            <div className="table-header">Marks</div>
            <div className="table-header">TOT</div>
            <div className="table-header"></div>
            {tableRow}
        </div>
        </>
    )
}