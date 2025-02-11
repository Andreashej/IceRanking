import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useParams } from "react-router-dom";
import { dateToString, markWithUnit } from "../../tools";
import { FlatList, FlatListItem } from "../../components/partials/FlatList";
import { RiderProps, useRider } from "../../contexts/rider.context";
import { Result } from "../../models/result.model";
import { Pagination } from "../../models/apiresponse.model";
import { getResults } from "../../services/v3/result.service";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { Horse } from "../../models/horse.model";
import { Test } from "../../models/test.model";
import { getHorse } from "../../services/v3/horse.service";
import { getTest } from "../../services/v3/test.service";
import { Skeleton } from "../../components/partials/Skeleton";
import { FeaturedCard } from "../../components/partials/FeaturedCard";
import { getRankingResults } from "../../services/v3/rankingresult.service";
import { getRankingList } from "../../services/v3/rankinglist.service";
import { cancellablePromise } from "../../tools/cancellablePromise";

const RiderResult: React.FC<FlatListItem<Result, RiderProps>> = ({
  item: result,
}) => {
  const ref = useRef(null);
  const isVisible = useIntersectionObserver(ref, { rootMargin: "50px" });
  const [fetchingStarted, setFetchingStarted] = useState<boolean>(false);

  const [horse, setHorse] = useState<Horse>();
  const [test, setTest] = useState<Test>();

  useEffect(() => {
    if (isVisible && !fetchingStarted && result.entry) {
      setFetchingStarted(true);

      let horseCancel = () => {};

      if (result?.entry?.participant?.equipage) {
        const { promise: horsePromise, cancel } = cancellablePromise(
          getHorse(result?.entry?.participant?.equipage?.horseId)
        );

        horseCancel = cancel;

        horsePromise.then((horse) => {
          setHorse(horse);
        });
      }

      const { promise: testPromise, cancel: testCancel } = cancellablePromise(
        getTest(
          result.entry?.testId,
          new URLSearchParams({ expand: "competition" })
        )
      );

      testPromise.then((test) => {
        setTest(test);
      });

      return () => {
        horseCancel();
        testCancel();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.entry?.test, isVisible]);

  const renderTest = useMemo(() => {
    if (!test || !test.competition)
      return (
        <>
          <Skeleton style={{ height: "24px" }} />
          <Skeleton style={{ width: "60%", height: "24px" }} />
        </>
      );

    const firstDate = dateToString(test.competition.startDate, "d/m/Y");
    const lastDate = dateToString(test.competition.endDate, "d/m/Y");

    return (
      <>
        <Link
          to={`/competition/${test.competition.id}/test/${test.catalogCode}`}
        >
          {test.competition.name}
        </Link>
        <span className="text-muted d-none d-sm-block">
          {firstDate} - {lastDate}
        </span>
      </>
    );
  }, [test]);

  const renderMark = useMemo(() => {
    if (!test) return <Skeleton />;

    return result.state === "VALID" ? result?.score : result.state;
  }, [result.score, test, result.state]);

  const renderHorse = useMemo(() => {
    if (!horse || !test)
      return (
        <>
          <Skeleton style={{ height: "24px" }} />
          <Skeleton style={{ width: "60%", height: "24px" }} />
        </>
      );

    return (
      <>
        <Link to={`/horse/${horse.id}/results/${test?.catalogCode}`}>
          {horse.horseName}
        </Link>
        <span className="text-muted d-none d-sm-block">{horse.feifId}</span>
      </>
    );
  }, [horse, test]);

  return (
    <li
      className="flatlist-item"
      style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) 8ch" }}
      ref={ref}
    >
      <div className="mobile-span-3">{renderHorse}</div>
      <div className="mobile-span-3">{renderTest}</div>
      <div className="mark">{renderMark}</div>
    </li>
  );
};

const BestResult: React.FC<{
  riderId: string;
  testcode?: string;
  order?: string;
}> = ({ riderId, testcode, order }) => {
  const [result, setResult] = useState<Result>();

  useEffect(() => {
    if (!order || !testcode) return;

    const params = new URLSearchParams({
      limit: "1",
      orderBy: `mark ${order}`,
      "filter[]": `mark > 0`,
      expand: "test,horse",
    });
    params.append("filter[]", `riderId == ${riderId}`);
    params.append("filter[]", `test.testcode == ${testcode}`);

    const { promise, cancel } = cancellablePromise(getResults(params));

    promise.then(([results]) => {
      setResult(results[0]);
    });

    return cancel;
  }, [riderId, testcode, order]);

  useEffect(() => {
    setResult(undefined);
  }, [riderId, testcode]);

  return (
    <FeaturedCard
      title="Personal best"
      featuredText={result?.score}
      additionalText={result?.entry?.participant?.equipage?.horse?.horseName}
    />
  );
};

const BestRank: React.FC<{ riderId: string; test?: Test }> = ({
  riderId,
  test,
}) => {
  const [rank, setRank] = useState<string>();
  const [listname, setListname] = useState<string>();

  useEffect(() => {
    let cancel = () => {};
    const getBestRank = async () => {
      if (!test) return;

      const params = new URLSearchParams({
        limit: "1",
        "filter[]": "mark > 0",
        expand: "test",
        order: `mark ${test.order}`,
      });
      params.append("filter[]", `test.testcode == ${test.catalogCode}`);
      params.append("filter[]", `riders contains id == ${riderId}`);

      const [results] = await getRankingResults(params);

      if (!results || results.length === 0) {
        setRank("N/A");
        setListname(`Not currently ranked in ${test.catalogCode}`);
        return;
      }

      setRank(results[0].rank.toString());

      if (!results[0].test) return;

      const { promise, cancel: c } = cancellablePromise(
        getRankingList(results[0].test.rankinglistId)
      );
      cancel = c;

      const rankinglist = await promise;

      setListname(rankinglist.slug);
    };
    setRank(undefined);
    setListname(undefined);

    getBestRank();

    return cancel;
  }, [riderId, test]);
  return (
    <FeaturedCard
      title="Best rank"
      featuredText={rank}
      additionalText={listname}
    />
  );
};

const Activity: React.FC<{ numberOfResults?: number }> = ({
  numberOfResults,
}) => {
  return (
    <FeaturedCard
      title="Activity"
      featuredText={numberOfResults?.toFixed()}
      additionalText="results"
    />
  );
};

export const RiderResults: React.FC = () => {
  const [rider] = useRider();
  const { testcode } = useParams<{ testcode: string }>();

  const [results, setResults] = useState<Result[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [loading, setLoading] = useState<boolean>(false);

  let cancelLoading = useRef(() => {});

  const getNextPage = useCallback(
    async (riderId: string): Promise<void> => {
      if (loading || (results.length > 0 && !pagination?.hasNext)) return;
      cancelLoading.current();
      setLoading(true);

      const params = new URLSearchParams({
        page: pagination?.nextPage?.toString() ?? "1",
        perPage: "10",
        "filter[]": `riderId == ${riderId}`,
        orderBy: "test.competition.lastDate desc",
        expand: "test",
      });

      params.append("filter[]", `test.testcode == ${testcode}`);

      try {
        const { promise, cancel } = cancellablePromise(getResults(params));
        cancelLoading.current = cancel;
        const [results, pagination] = await promise;

        setResults((oldValue) => [...oldValue, ...results]);
        setPagination(pagination);
      } catch (error: unknown) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [results, pagination, loading, testcode]
  );

  useEffect(() => {
    setResults([]);
    setPagination(undefined);
    setLoading(false);
  }, [testcode]);

  if (!rider) return null;

  return (
    <>
      <h2 className="subtitle">{testcode} results</h2>
      <div className="grid-col-3">
        <BestResult
          riderId={rider.id}
          testcode={results[0]?.entry?.test?.catalogCode}
          order={results[0]?.entry?.test?.order}
        />
        <BestRank riderId={rider.id} test={results[0]?.entry?.test} />
        <Activity numberOfResults={pagination?.totalItems} />
      </div>
      <FlatList
        items={results}
        RenderComponent={RiderResult}
        onBottomReached={() => getNextPage(rider.id)}
        extraData={rider}
        hasMoreItems={
          (!pagination && results.length === 0) ||
          (pagination && pagination.hasNext)
        }
      />
    </>
  );
};
