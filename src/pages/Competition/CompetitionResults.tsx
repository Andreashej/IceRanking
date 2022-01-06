import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCompetition } from '../../contexts/competition.context';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { Pagination } from '../../models/apiresponse.model';
import { Horse } from '../../models/horse.model';
import { Result } from '../../models/result.model';
import { Rider } from '../../models/rider.model';
import { getTestResults } from '../../services/v2/test.service';

export const CompetitionResults: React.FC = () => {
    const [competition] = useCompetition();
    const [results, setResults] = useState<Result[]>([]);
    const [pagination, setPagination] = useState<Pagination>();
    const [loading, setLoading] = useState<boolean>(false);
    const listBottomRef = useRef<HTMLDivElement>(null);
    const bottomReached = useIntersectionObserver(listBottomRef, { threshold: 0, rootMargin: '500px' });

    const { testcode } = useParams<{ testcode: string; }>()

    const test = useMemo(() => competition.tests?.find(test => test.testcode === testcode), [testcode, competition.tests]);

    const getResults = useCallback(async (testId: number): Promise<void> => {
        setLoading(true);

        const params = new URLSearchParams({ 
            page: pagination?.nextPage?.toString() ?? '1',
            perPage: '10',
            expand: 'rider,horse' 
        });

        try {
            const [results, pagination] = await getTestResults(testId, params)

            setResults(((oldValue) => [...oldValue, ...results]));
            setPagination(pagination);
        } catch (error: unknown) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [pagination]);

    useEffect(() => {
        setResults([]);
        setPagination(undefined);
    }, [testcode])

    useEffect(() => {
        if(bottomReached && test && !loading) getResults(test.id);
    }, [bottomReached, loading, getResults, test])

    const riderColumn = (rider: Rider) => {
        return (
            <Link to={`/rider/${rider.id}/results/${testcode}`}>{rider.fullname}</Link>
        )
    }

    const horseColumn = (horse: Horse) => {
        return (
            <Link to={`/horse/${horse.id}/results/${testcode}}`}>{horse.horseName}</Link>
        )
    }

    const markColumn = (mark: number) => {
        const roundedMark = mark.toFixed(test?.roundingPrecision);
        const unit = test?.markType === 'time' ? '"' : '';

        return `${roundedMark}${unit}`;
    }

    return (
        <>
            <div className="row">
                <div className="col">
                    <h2 className="subheader">{testcode} results</h2>
                </div>
            </div>
            {(results.length > 0 && <DataTable className="results-table mt-4" value={results} autoLayout={true} dataKey="id">
                <Column field="rank" className="minimize rank" />
                <Column field="rider.fullname" className="rider" header="Rider" body={(rowData) => riderColumn(rowData.rider)} />
                <Column field="horse.horseName" className="horse" header="Horse" body={(rowData) => horseColumn(rowData.horse)}/>
                <Column field="mark" className="mark" header="Mark" body={(rowData) => markColumn(rowData.mark)} />
            </DataTable>)}
            {(!pagination || pagination?.hasNext) && <div ref={listBottomRef}><ProgressSpinner /></div>}
        </>
    )
}