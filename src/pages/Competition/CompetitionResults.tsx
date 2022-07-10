import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import TooltipOptions from 'primereact/tooltip/tooltipoptions';
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { FlatList, FlatListItem } from '../../components/partials/FlatList';
import { Skeleton } from '../../components/partials/Skeleton';
import { useCompetitionContext } from '../../contexts/competition.context';
import { useToast } from '../../contexts/toast.context';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { Pagination } from '../../models/apiresponse.model';
import { Horse } from '../../models/horse.model';
import { Result } from '../../models/result.model';
import { Person } from '../../models/person.model';
import { Test } from '../../models/test.model';
import { deleteTest, getTestResults, uploadTestResults } from '../../services/v2/test.service';
import { getResult } from '../../services/v2/result.service';
import { cancellablePromise } from '../../tools/cancellablePromise';
import { Dialog } from 'primereact/dialog';
import { FileUpload, FileUploadHandlerParam } from 'primereact/fileupload';

const CompetitionResultItem: React.FC<FlatListItem<Result, Test>> = ({ item: result, extraData: test }) => {
    const [rider, setRider] = useState<Person>();
    const [horse, setHorse] = useState<Horse>();
    const [fetchingStarted, setFetchingStarted] = useState<boolean>(false);
    const ref = useRef(null);
    const isVisible = useIntersectionObserver(ref, { rootMargin: '50px' })

    useEffect(() => {
        if (isVisible && !fetchingStarted) {
            const params = new URLSearchParams({
                fields: 'rider,horse',
                expand: 'rider,horse'
            });
            
            setFetchingStarted(true)
            const p = getResult(result.id, params);
            const { promise, cancel } = cancellablePromise<Result>(p);
            promise.then((result) => {
                if (result.horse) setHorse(result.horse);
                if (result.rider) setRider(result.rider);
            });
            
            return cancel;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result.id, isVisible])

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
                {result.state === "VALID" ? formatMark(result.mark) : result.state}
            </div>
        </li>
    )
}

export const CompetitionResults: React.FC = () => {
    const { resource: competition, fetch: fetchCompetition } = useCompetitionContext();
    const [results, setResults] = useState<Result[]>([]);
    const [pagination, setPagination] = useState<Pagination>();
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadResultsDialog, setUploadResultsDialog] = useState<boolean>(false);
    const showToast = useToast();

    const history = useHistory();


    const { testcode } = useParams<{ testcode: string; }>()

    const test = useMemo(() => competition?.tests?.find(test => test.testName === testcode), [testcode, competition?.tests]);

    const cancelLoading = useRef(() => {})

    const getNextPage = useCallback(async (testId: number): Promise<void> => {
        if (loading || (results.length > 0 && !pagination?.hasNext)) return;
        setLoading(true);
        cancelLoading.current();

        const params = new URLSearchParams({ 
            // "filter[]": "phase == PREL",
            page: pagination?.nextPage?.toString() ?? '1',
            perPage: '100',
        });

        try {
            const { promise, cancel } = cancellablePromise(getTestResults(testId, params));
            cancelLoading.current = cancel;
            const [results, pagination] = await promise;

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
        setLoading(false);
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
            });
        }
    }

    const upload = async (event: FileUploadHandlerParam) => {
        try {
            const task = await uploadTestResults(test, event.files[0])
            console.log(task);
            setUploadResultsDialog(false);
        } catch (error: unknown) {
            showToast({
                severity: 'error',
                summary: 'Could not upload results',
                detail: error as string,
            });
        }
    }

    return (
        <>
            <div className="grid-col-2">
                <h2 className="subheader">
                    {testcode} results 
                </h2>
                {competition?.isAdmin && <div className="toolbar" style={{ width: "max-content", placeSelf: "end" }} >
                    <Button icon={PrimeIcons.UPLOAD} className="p-button-text" tooltip="Upload results" tooltipOptions={tooltipOptions} onClick={() => setUploadResultsDialog(true)} />
                    <Button icon={PrimeIcons.PENCIL} className="p-button-text" tooltip="Edit" tooltipOptions={tooltipOptions} onClick={() => history.push(`${history.location.pathname}/edit`)} />
                    <Button icon={PrimeIcons.TRASH} className="p-button-text p-button-danger" tooltip="Delete" tooltipOptions={tooltipOptions} onClick={() => removeTest()} />
                </div>}
            </div>
            <FlatList
                items={results}
                extraData={test}
                RenderComponent={CompetitionResultItem} 
                hasMoreItems={(!pagination && results.length === 0) || (pagination && pagination.hasNext)}
                onBottomReached={() => getNextPage(test.id)}
            />
            <Dialog header="Upload results (XLS)" visible={uploadResultsDialog} onHide={() => setUploadResultsDialog(false)}>
                <FileUpload customUpload uploadHandler={upload} auto />
            </Dialog>
        </>
    )
}