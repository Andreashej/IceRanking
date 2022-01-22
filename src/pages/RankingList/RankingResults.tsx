import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { ProgressSpinner } from 'primereact/progressspinner';
import { Tooltip } from 'primereact/tooltip';

import { useHistory, useParams } from 'react-router-dom';
import { Ranking } from '../../models/ranking.model';
import { Skeleton } from '../../components/partials/Skeleton';
import { useRankingList } from '../../contexts/rankinglist.context';
import { FlatList, FlatListItem } from '../../components/partials/FlatList';
import { RankingResult } from '../../models/rankingresult.model';
import { Pagination } from '../../models/apiresponse.model';
import { getRanking, getResultForRanking } from '../../services/v2/ranking.service';
import { getHorse } from '../../services/v2/horse.service';
import { getPerson } from '../../services/v2/person.service';
import { Horse } from '../../models/horse.model';
import { Person } from '../../models/person.model';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { dateToString, markWithUnit } from '../../tools';
import { Link } from 'react-router-dom';
import { Result } from '../../models/result.model';
import { getRankingResultMarks } from '../../services/v2/rankingresult.service';
import { Competition } from '../../models/competition.model';
import { getCompetition } from '../../services/v2/competition.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'primereact/button';
import { useIsLoggedIn } from '../../contexts/user.context';
import { Task } from '../../models/task.model';
import { TaskBar } from '../../components/Task/TaskBar';
import { createTask } from '../../services/v2/task.service';
import { PrimeIcons } from 'primereact/api';

type RankingResultMarkProps = {
    mark: Result;
    isQualifying: boolean;
}

const RankingResultMarkItem: React.FC<RankingResultMarkProps> = ({mark, isQualifying}) => {
    const [competition, setCompetition] = useState<Competition>();
    const [rankingList] = useRankingList()

    const competitionId = mark.test?.competitionId;

    useEffect(() => {
        if (competitionId) {
            const fetchCompetition = async () => {
                const competition = await getCompetition(competitionId)
                
                setCompetition(competition);
            }

            fetchCompetition()
        }
    }, [competitionId])

    const expiresAt = new Date()
    if (competition && rankingList) {
        expiresAt.setTime(competition?.lastDate.getTime() + (rankingList.resultsValidDays * 24 * 60 * 60 * 1000));
    }


    return (
        <>
            <Link style={{ fontWeight: isQualifying ? 'bold' : 'normal' }} to={`/horse/${mark.horseId}/results/${mark.test?.testcode}`}>{mark.horse?.horseName}</Link>
            <Link style={{ fontWeight: isQualifying ? 'bold' : 'normal' }}  to={`/competition/${competition?.id}/test/${mark.test?.testcode}`}>{competition?.name}</Link>
            <div id={`mark-${mark.id}-expires-at`} className="expires-at d-none d-md-block" data-pr-tooltip="Result is no longer valid for this rankinglist after this date.">
                <Tooltip target={`#mark-${mark.id}-expires-at`} position="top"  />
                <span style={{ fontWeight: isQualifying ? 'bold' : 'normal', padding: "0 1rem" }}><FontAwesomeIcon icon="clock" /> {dateToString(expiresAt, 'd/m/Y')}</span>
            </div>
            <div id={`is-qualifying-${mark.id}`} className="is-qualifying"  data-pr-tooltip="This result is used in the calculation of the final mark." style={{ textAlign: "right", fontWeight: isQualifying ? 'bold' : 'normal' }}>
                {isQualifying && <Tooltip target={`#is-qualifying-${mark.id}`} position="top" />}
                {markWithUnit(mark.mark, mark.test?.roundingPrecision, mark.test?.markType)}
                <FontAwesomeIcon icon="check-circle" style={{ marginLeft: ".25rem", color: "green", visibility: isQualifying ? "visible" : "hidden" }} />
            </div>
        </>
    )
}

const RankingResultListItem: React.FC<FlatListItem<RankingResult, Ranking>> = ({ item: result, parent: ranking }) => {
    const [rider, setRider] = useState<Person>();
    const [horse, setHorse] = useState<Horse>();
    const [marks, setMarks] = useState<Result[]>([]);
    const [height, setHeight] = useState<number>();
    const [isExpanded, setIsExpanded] = useState<boolean>(false); 
    const [loading, setLoading] = useState<boolean>(false); 
    const markRef = useRef<HTMLDivElement>(null);
    const rankRef = useRef<HTMLDivElement>(null);
    const ref = useRef(null);
    const isVisible = useIntersectionObserver(ref, { threshold: 0 });
    const [rankingList] = useRankingList();

    useEffect(() => {
        const fetchHorse = async () => {
            if (result.horseId) {
                const horse = await getHorse(result.horseId);
                setHorse(horse);
            }
        }

        if (isVisible) fetchHorse();
    }, [result.horseId, isVisible])
    
    useEffect(() => {
        const fetchRider = async () => {
            if (result.riderId) {
                const rider = await getPerson(result.riderId);
                setRider(rider);
            }
        }

        if (isVisible) fetchRider();
    }, [result.riderId, isVisible]);

    useLayoutEffect(() => {
        if (markRef.current) {
            setHeight(markRef.current.clientHeight);
        }
    }, [])

    useEffect(() => {
        if (markRef.current && rankRef.current ) {
            setHeight(isExpanded ? rankRef.current.clientHeight + 20 : markRef.current.clientHeight)
        }
    }, [isExpanded])

    const toggle = async () => {
        if (marks.length === 0 && rankingList) {
            setLoading(true)
            const fromDate = new Date()
            fromDate.setTime(new Date().getTime() - (rankingList.resultsValidDays * 24 * 60 * 60 * 1000));

            const grouping = ranking.grouping === "rider" ? "horse" : "rider";

            const params = new URLSearchParams({
                'filter[]': `test.competition.last_date > ${dateToString(fromDate)}`,
                'orderBy': 'test.competition.last_date asc',
                'expand': `test,${grouping}`,
            });

            const [marks] = await getRankingResultMarks(result.id, params);
            
            setMarks(marks);

        }
        setIsExpanded((prevValue) => !prevValue)
        setLoading(false);
    }

    const qualifyingMarks = useMemo<number[]>(() => {
        return marks.sort((a, b) => b.mark - a.mark).slice(0, 2).map((mark) => mark.id);
    }, [marks])


    return (
        <li 
            className="flatlist-item no-padding-left expandable" 
            style={{ gridTemplateColumns: "6ch minmax(0, 1fr) 8ch", maxHeight: `${height}px` }} 
            ref={ref}
            onClick={toggle}
        >
            <div className="rank" style={{ gridRow: "1 / 4" }} ref={rankRef}>
                {!loading ? result.rank ?? '-' : <ProgressSpinner style={{ height: "1.5rem", margin: "0.125rem" }} strokeWidth="3px" />}
            </div>
            {ranking.grouping === 'rider' && <div style={{ alignSelf: "center" }}>
                {(rider && <Link style={{ width: 'fit-content'}} to={`/rider/${rider.id}/results/${ranking.testcode}`}>{rider.fullname}</Link>) ?? <Skeleton style={{ height: "18px" }} />}
            </div>}
            {ranking.grouping === 'horse' && <div style={{ alignSelf: "center" }}>
                {(horse && <Link style={{ width: 'fit-content'}}  to={`/horse/${horse.id}/results/${ranking.testcode}`}>{horse.horseName}</Link>) ?? <Skeleton style={{ height: "18px" }} />}
            </div>}
            <div className="expanded" style={{ gridColumn: "2 / -1" }}>
                <div className="header-col">{ranking.grouping === 'horse' ? 'Rider' : 'Horse'}</div>
                <div className="header-col">Competition</div>
                <div className="header-col" style={{ paddingLeft: "1rem" }}>Valid until</div>
                <div className="header-col">Mark</div>
                {marks.map((mark) => <RankingResultMarkItem mark={mark} key={mark.id} isQualifying={qualifyingMarks.includes(mark.id)} />)}
            </div>
            <div className="mark" ref={markRef} style={{ gridColumn: "3 / 4", gridRow: "1 / 3" }}>
                {markWithUnit(result.mark, ranking.roundingPrecision, ranking.markType)}
            </div>

        </li>
    )
}

export const RankingResults: React.FC = () => {
    const [rankingList] = useRankingList();
    const { testcode } = useParams<{testcode: string}>();
    const [results, setResults] = useState<RankingResult[]>([]);
    const [pagination, setPagination] = useState<Pagination>();
    const [loading, setLoading] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Task[]>([]);

    const isLoggedIn = useIsLoggedIn();

    const history = useHistory();

    const ranking = useMemo<Ranking | undefined>(() => {
        if (!rankingList || !rankingList.tests) return;

        return rankingList.tests.find((ranking) => ranking.testcode === testcode);
    }, [testcode, rankingList])


    const description = useMemo<JSX.Element | undefined>(() => {
        if (!ranking || !rankingList) return;

        return <p>This ranking is based on the best {ranking.includedMarks} marks per {ranking.grouping} in {ranking.testcode}. Only marks above {ranking.minMark} are taken into account.</p>
    }, [ranking, rankingList])

    const getNextPage = useCallback(async (rankingId: number): Promise<void> => {
        if (loading || (results.length > 0 && !pagination?.hasNext)) return;
        setLoading(true);

        const params = new URLSearchParams({ 
            page: pagination?.nextPage?.toString() ?? '1',
            perPage: '100',
        });

        try {
            const [results, pagination] = await getResultForRanking(rankingId, params)

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

    const fetchTasks = useCallback(async (rankingId) => {
        const params = new URLSearchParams({
            'expand': 'tasksInProgress',
            'fields': 'tasksInProgress'
        })
        const r = await getRanking(rankingId, params) as Required<Pick<Ranking, 'tasksInProgress'>>;

        setTasks(r.tasksInProgress);
    }, []);

    useEffect(() => {
        if (ranking) fetchTasks(ranking.id);
    }, [ranking, fetchTasks])

    const toolbar = (
        <>
            <Button 
                tooltip="Edit ranking definition"
                tooltipOptions={{ position: 'top' }}
                className="p-button-info mr-2 p-button-text" 
                icon={PrimeIcons.PENCIL} 
                onClick={async () => {
                    if (ranking) {
                        history.push(`/rankinglist/${rankingList?.shortname}/ranking/${testcode}/edit`)
                    }
                }} 
                disabled={tasks.length > 0} 
                />
            <Button 
                tooltip="Recompute marks"
                tooltipOptions={{ position: 'top' }}
                className="p-button-success mr-2 p-button-text" 
                icon={PrimeIcons.SORT_NUMERIC_DOWN} 
                onClick={async () => {
                    if (ranking) {
                        const task = await createTask(ranking.id, 'recompute');
                        setTasks((prevTasks) => [...prevTasks, task]);
                    }
                }} 
                disabled={tasks.length > 0} 
            />
            <Button 
                tooltip="Flush all results"
                tooltipOptions={{ position: 'top' }}
                className="p-button-warning p-button-text" 
                icon={PrimeIcons.REFRESH} 
                onClick={async () => {
                    if (ranking) {
                        const task = await createTask(ranking.id, 'flush');
                        setTasks((prevTasks) => [...prevTasks, task]);
                    }
                }} 
                disabled={tasks.length > 0} 
            />
        </>
    );

    if (!ranking) return null;

    const renderTasks = (
        <div>
            <h4>Ranking is being recomputed. Please wait...</h4>
            {tasks.map((task) => <TaskBar key={task.id} task={task} onComplete={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))} />)}
        </div>
        );

    return (
        <> 
            <div className="grid-col-2">
                <h2 className="subheader">{testcode} results</h2>
                {isLoggedIn && <div className="toolbar" style={{ width: "max-content", placeSelf: "end" }}>
                    {toolbar}
                </div>}
            </div>
            {description}
            {tasks.length === 0 ? <FlatList
                items={results}
                RenderComponent={RankingResultListItem}
                hasMoreItems={(!pagination && results.length === 0) || (pagination && pagination.hasNext)} 
                parent={ranking}
                onBottomReached={() => getNextPage(ranking.id)}
            /> : renderTasks}
        </>
    )

    // onRecompute() {
    //     this.props.recomputeRankingTestResult(this.props.match.params.shortname, this.props.match.params.testcode).then(response => {
    //         this.props.getRankingTest(this.props.match.params.shortname, this.props.match.params.testcode);
    //     });
    // }

    // onRecomputeComplete() {
    //     const {shortname, testcode} = this.props.match.params;

    //     this.props.getRankingTests(shortname).then(() => {
    //         if (this.props.test.tasks_in_progress.length === 0) {
    //             this.props.getRankingTestResult(shortname, testcode);
    //         }
    //     });
    // }

    // renderToolbar() {
    //     if (!this.props.test || !this.props.user) {
    //         return false;
    //     }

    //     if (this.props.test.tasks_in_progress.length > 0) {
    //         return this.props.test.tasks_in_progress.map(task => {
    //             return <ProgressBar key={task.id} taskId={task.id} onComplete={() => this.onRecomputeComplete()} />
    //         });
    //     }

    //     return (
    //         <Button label="Recompute" className="mb-3" onClick={(e) => this.onRecompute(e)} />
    //     );
    // }
}