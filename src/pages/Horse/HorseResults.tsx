import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { dateToString, markWithUnit } from '../../tools';
import { FlatList, FlatListItem } from '../../components/partials/FlatList';
import { Result } from '../../models/result.model';
import { Pagination } from '../../models/apiresponse.model';
import { getResults } from '../../services/v2/result.service';
import { Rider } from '../../models/rider.model';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { Horse } from '../../models/horse.model';
import { Test } from '../../models/test.model';
import { getTest } from '../../services/v2/test.service';
import { Skeleton } from '../../components/partials/Skeleton';
import { FeaturedCard } from '../../components/partials/FeaturedCard';
import { getRankingResults } from '../../services/v2/rankingresult.service';
import { getRankingList } from '../../services/v2/rankinglist.service';
import { useHorse } from '../../contexts/horse.context';
import { getRider } from '../../services/v2/rider.service';

const HorseResult: React.FC<FlatListItem<Result, Horse>> = ({ item: result }) => {
    const ref = useRef(null);
    const isVisible = useIntersectionObserver(ref, { rootMargin: '50px' });

    const [rider, setRider] = useState<Rider>();
    const [test, setTest] = useState<Test>();

    useEffect(() => {
        if (isVisible) {
            getRider(result.riderId).then((rider) => {
                setRider(rider);
            });

            getTest(result.testId, new URLSearchParams({ expand: 'competition' })).then((test) => {
                setTest(test);
            })
        }
    }, [result, isVisible])

    const renderTest = useMemo(() => {
        if (!test || !test.competition) return (
            <>
                <Skeleton style={{ height: "24px" }} />
                <Skeleton style={{ width: "60%", height: "24px" }} />
            </>
        );

        const firstDate = dateToString(test.competition.firstDate, 'd/m/Y');
        const lastDate = dateToString(test.competition.lastDate, 'd/m/Y');

        return (
            <>
                <Link to={`/competition/${test.competition.id}/test/${test.testcode}`}>{test.competition.name}</Link>
                <span className="text-muted d-none d-sm-block">{firstDate} - {lastDate}</span>
            </>
        )
    }, [test])

    const renderMark = useMemo(() => {
        if (!test) return <Skeleton />;

        return markWithUnit(result.mark, test.roundingPrecision, test.markType);

    }, [result.mark, test]);

    const renderRider = useMemo(() => {
        if (!rider || !test) return (
            <>
                <Skeleton style={{ height: "24px" }} />
                <Skeleton style={{ width: "60%", height: "24px" }} />
            </>
        );

        return (
            <>
                <Link to={`/rider/${rider.id}/results/${test?.testcode}`}>{rider.fullname}</Link>
                {/* <span className="text-muted d-none d-sm-block">{rider}</span> */}
            </>
        )
    }, [rider, test])

    return (
        <li className="flatlist-item" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) 8ch" }} ref={ref}>
            <div className="mobile-span-3">
                {renderRider}
            </div>
            <div className="mobile-span-3">
                {renderTest}
            </div>
            <div className="mark">
                {renderMark}
            </div>
        </li>
    )
}

const BestResult: React.FC<{horseId: number, testcode?: string, order?: string}> = ({horseId, testcode, order}) => {
        const [result, setResult] = useState<Result>();

        useEffect(() => {
            if (!order || !testcode) return;
            
            const params = new URLSearchParams({
                limit: '1',
                orderBy: `mark ${order}`,
                'filter[]': `mark > 0`,
                expand: 'test,horse'
            });
            params.append('filter[]', `horseId == ${horseId}`);
            params.append('filter[]', `test.testcode == ${testcode}`);

            getResults(params).then(([results]) => {
                setResult(results[0]);
            })
        }, [horseId, testcode, order])

        useEffect(() => {
            setResult(undefined);
        },[horseId, testcode])

        const renderMark = useMemo(() => {
            if (!result || !result.test) return null;

            return markWithUnit(result.mark, result.test.roundingPrecision, result.test.markType)
        }, [result])

        return (
            <FeaturedCard title="Personal best" featuredText={renderMark} additionalText={result?.horse?.horseName} />
        )
}

const BestRank: React.FC<{horseId: number, testcode: string}> = ({ horseId, testcode }) => {
    const [rank, setRank] = useState<string>();
    const [listname, setListname] = useState<string>();

    useEffect(() => {
        const getBestRank = async () => {
            const params = new URLSearchParams({
                limit: '1',
                'filter[]': 'rank > 0',
                'expand': 'test',
                'order': 'rank asc',
            });
            params.append('filter[]', `test.testcode == ${testcode}`);
            params.append('filter[]', `horses contains id == ${horseId}`,);
    
            const [results] = await getRankingResults(params)

            if (!results || results.length === 0) {
                setRank("N/A");
                setListname(`Not currently ranked in ${testcode}`)
                return;
            }

            setRank(results[0].rank.toString());
            
            if (!results[0].test) return;

            const rankinglist = await getRankingList(results[0].test.rankinglistId);
            
            setListname((rankinglist).shortname);
        }
        setRank(undefined);
        setListname(undefined);
        
        getBestRank();
    }, [horseId, testcode])
    return <FeaturedCard title="Best rank" featuredText={rank} additionalText={listname} />
}

const Activity: React.FC<{numberOfResults?: number}> = ({ numberOfResults }) => {
    return <FeaturedCard title="Activity" featuredText={numberOfResults?.toFixed()} additionalText="results" />
}

export const HorseResults: React.FC = () => {
    const [horse] = useHorse();
    const { testcode } = useParams<{testcode: string}>();

    const [results, setResults] = useState<Result[]>([]);
    const [pagination, setPagination] = useState<Pagination>();
    const [loading, setLoading] = useState<boolean>(false);

    const getNextPage = useCallback(async (horseId: number): Promise<void> => {
        if (loading || (results.length > 0 && !pagination?.hasNext)) return;
        setLoading(true);

        const params = new URLSearchParams({ 
            page: pagination?.nextPage?.toString() ?? '1',
            perPage: '10',
            'filter[]': `horseId == ${horseId}`,
            orderBy: 'test.competition.lastDate desc',
            expand: 'test'
        });

        params.append('filter[]', `test.testcode == ${testcode}`)

        try {
            const [results, pagination] = await getResults(params)

            setResults(((oldValue) => [...oldValue, ...results]));
            setPagination(pagination);
        } catch (error: unknown) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [results, pagination, loading, testcode]);

    useEffect(() => {
        setResults([]);
        setPagination(undefined);
    }, [testcode])

    if (!horse) return null;

    return (
        <>
            <h2 className="subtitle">{testcode} results</h2>
            <div className="grid-col-3">
                <BestResult horseId={horse.id} testcode={results[0]?.test?.testcode} order={results[0]?.test?.order} />
                <BestRank horseId={horse.id} testcode={testcode} />
                <Activity numberOfResults={pagination?.totalItems} />
            </div>
            <FlatList
                items={results}
                RenderComponent={HorseResult}
                onBottomReached={() => getNextPage(horse.id)}
                parent={horse}
                hasMoreItems={(!pagination && results.length === 0) || (pagination && pagination.hasNext)}
            />
        </>
    );
}