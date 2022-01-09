import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FlatList, FlatListItem } from '../../components/partials/FlatList';
import { Skeleton } from '../../components/partials/Skeleton';
import { useCompetition } from '../../contexts/competition.context';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { Pagination } from '../../models/apiresponse.model';
import { Horse } from '../../models/horse.model';
import { Result } from '../../models/result.model';
import { Rider } from '../../models/rider.model';
import { Test } from '../../models/test.model';
import { getHorse } from '../../services/v2/horse.service';
import { getRider } from '../../services/v2/rider.service';
import { getTestResults } from '../../services/v2/test.service';

const CompetitionResultItem: React.FC<FlatListItem<Result, Test>> = ({ item: result, parent: test }) => {
    const [rider, setRider] = useState<Rider>();
    const [horse, setHorse] = useState<Horse>();
    const ref = useRef(null);
    const isVisible = useIntersectionObserver(ref, { rootMargin: '50px' })

    useEffect(() => {
        if (isVisible) {
            getRider(result.riderId).then((rider) => {
                setRider(rider);
            })
    
            getHorse(result.horseId).then((horse) => {
                setHorse(horse);
            })
        }
    }, [result.horseId, result.riderId, isVisible])

    const formatMark = (mark: number) => {
        const roundedMark = mark.toFixed(test.roundingPrecision);
        const unit = test?.markType === 'time' ? '"' : '';

        return `${roundedMark}${unit}`;
    }

    return (
        <>
            <li className="flatlist-item" ref={ref}>
                <div className="rank">
                    {result.rank ?? '-'}
                </div>
                <div className="rider" style={{ alignSelf: "center" }}>{(rider && <Link to={`/rider/${rider.id}/results/${test.testcode}`}>{rider.fullname}</Link>) ?? <Skeleton style={{ height: "18px" }} />}</div>
                <div className="horse" style={{ alignSelf: "center" }}>{(horse && <Link to={`/horse/${horse.id}/results/${test.testcode}`}>{horse.horseName}</Link>) ?? <Skeleton style={{ height: "18px" }} />}</div>
                <div className="mark">
                    {formatMark(result.mark)}
                </div>
            </li>
        </>
    )
}

export const CompetitionResults: React.FC = () => {
    const [competition] = useCompetition();
    const [results, setResults] = useState<Result[]>([]);
    const [pagination, setPagination] = useState<Pagination>();
    const [loading, setLoading] = useState<boolean>(false);


    const { testcode } = useParams<{ testcode: string; }>()

    const test = useMemo(() => competition?.tests?.find(test => test.testcode === testcode), [testcode, competition?.tests]);

    const getNextPage = useCallback(async (testId: number): Promise<void> => {
        if (loading || (results.length > 0 && !pagination?.hasNext)) return;
        setLoading(true);

        const params = new URLSearchParams({ 
            page: pagination?.nextPage?.toString() ?? '1',
            perPage: '100',
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
    }, [results, pagination, loading]);

    useEffect(() => {
        setResults([]);
        setPagination(undefined);
    }, [testcode])

    // useEffect(() => {
    //     if (test && results.length === 0 && !pagination) {
    //         getNextPage(test.id);
    //     }
    // }, [test, results, pagination, getNextPage])



    if (!test) return null;

    return (
        <>
            <div className="row">
                <div className="col">
                    <h2 className="subheader">{testcode} results</h2>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <FlatList
                        items={results}
                        parent={test}
                        RenderComponent={CompetitionResultItem} 
                        hasMoreItems={pagination?.hasNext}
                        onBottomReached={() => getNextPage(test.id)}
                    />
                </div>
            </div>
            
        </>
    )
}