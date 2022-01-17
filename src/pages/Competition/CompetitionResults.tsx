import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import TooltipOptions from 'primereact/tooltip/tooltipoptions';
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { FlatList, FlatListItem } from '../../components/partials/FlatList';
import { Skeleton } from '../../components/partials/Skeleton';
import { useCompetition, useCompetitionContext } from '../../contexts/competition.context';
import { useToast } from '../../contexts/toast.context';
import { useIsLoggedIn } from '../../contexts/user.context';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { Pagination } from '../../models/apiresponse.model';
import { Horse } from '../../models/horse.model';
import { Result } from '../../models/result.model';
import { Rider } from '../../models/rider.model';
import { Test } from '../../models/test.model';
import { getHorse } from '../../services/v2/horse.service';
import { getRider } from '../../services/v2/rider.service';
import { deleteTest, getTestResults } from '../../services/v2/test.service';

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
        <li className="flatlist-item no-padding-left" style={{ gridTemplateColumns: "6ch minmax(0, 1fr) minmax(0, 1fr) 8ch" }} ref={ref}>
            <div className="rank">
                {result.rank ?? '-'}
            </div>
            <div className="mobile-span-2" style={{ alignSelf: "center" }}>{(rider && <Link to={`/rider/${rider.id}/results/${test.testcode}`}>{rider.fullname}</Link>) ?? <Skeleton style={{ height: "18px" }} />}</div>
            <div className="mobile-span-2" style={{ alignSelf: "center" }}>{(horse && <Link to={`/horse/${horse.id}/results/${test.testcode}`}>{horse.horseName}</Link>) ?? <Skeleton style={{ height: "18px" }} />}</div>
            <div className="mark">
                {formatMark(result.mark)}
            </div>
        </li>
    )
}

export const CompetitionResults: React.FC = () => {
    const { resource: competition, fetch: fetchCompetition } = useCompetitionContext();
    const [results, setResults] = useState<Result[]>([]);
    const [pagination, setPagination] = useState<Pagination>();
    const [loading, setLoading] = useState<boolean>(false);
    const isLoggedIn = useIsLoggedIn();
    const showToast = useToast();

    const history = useHistory();


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

    const tooltipOptions: TooltipOptions = {
        position: "top",
    }

    
    if (!test) return null;

    const removeTest = async () => {
        try {
            await deleteTest(test)
            await fetchCompetition()
        } catch (error: unknown) {
            showToast({
                severity: 'error',
                summary: 'Could not delete test',
                detail: error as string,
            })
        }
    }

    return (
        <>
            <div className="grid-col-2">
                <h2 className="subheader">
                    {testcode} results 
                </h2>
                {isLoggedIn && <div className="toolbar" style={{ width: "max-content", placeSelf: "end" }} >
                    <Button icon={PrimeIcons.PENCIL} className="p-button-text" tooltip="Edit" tooltipOptions={tooltipOptions} onClick={() => history.push(`${history.location.pathname}/edit`)} />
                    <Button icon={PrimeIcons.TRASH} className="p-button-text p-button-danger" tooltip="Delete" tooltipOptions={tooltipOptions} onClick={() => removeTest()} />
                </div>}
            </div>
            <FlatList
                items={results}
                parent={test}
                RenderComponent={CompetitionResultItem} 
                hasMoreItems={(!pagination && results.length === 0) || (pagination && pagination.hasNext)}
                onBottomReached={() => getNextPage(test.id)}
            />
        </>
    )
}