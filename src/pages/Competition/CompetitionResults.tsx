import axios from 'axios';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
    // const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const listBottomRef = useRef<HTMLDivElement>(null);
    const bottomReached = useIntersectionObserver(listBottomRef, { threshold: 0, rootMargin: '200px' });

    const { testcode } = useParams<{ testcode: string; }>()

    const test = useMemo(() => competition.tests?.find(test => test.testcode === testcode), [testcode]);

    const getResults = async (testId: number): Promise<void> => {
        setLoading(true);
        console.log("Loading started...", pagination?.nextPage?.toString() ?? '1');

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
            console.log(testcode, error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setResults([]);
        setPagination(undefined);
        if (test) getResults(test.id)
    }, [test?.id])

    useEffect(() => {
        if(pagination?.hasNext && bottomReached && test && !loading) getResults(test?.id);
    }, [bottomReached, loading])

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
                <Column field="mark" className="mark" header="Mark" body={(rowData) => rowData.mark.toFixed(test?.roundingPrecision)} />
            </DataTable>)}
            {(!pagination || pagination?.hasNext) && <div ref={listBottomRef}><ProgressSpinner /></div>}
        </>
    )
}