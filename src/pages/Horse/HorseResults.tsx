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
import { Result } from "../../models/result.model";
import { Pagination } from "../../models/apiresponse.model";
import { getResults } from "../../clients/v3/result.service";
import { Person } from "../../models/person.model";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { Horse } from "../../models/horse.model";
import { Test } from "../../models/test.model";
import { getTest } from "../../clients/v3/test.service";
import { Skeleton } from "../../components/partials/Skeleton";
import { FeaturedCard } from "../../components/partials/FeaturedCard";
import { getRankingResults } from "../../clients/v3/rankingresult.service";
import { getRankingList } from "../../clients/v3/rankinglist.service";
import { useHorse } from "../../contexts/horse.context";
import { getPerson } from "../../clients/v3/person.service";
import { cancellablePromise } from "../../tools/cancellablePromise";

const HorseResult: React.FC<FlatListItem<Result, Horse>> = ({
  item: result,
}) => {
  const ref = useRef(null);
  const isVisible = useIntersectionObserver(ref, { rootMargin: "50px" });
  const [fetchingStarted, setFetchingStarted] = useState<boolean>(false);

  const [rider, setRider] = useState<Person>();
  const [test, setTest] = useState<Test>();

  // useEffect(() => {
  //   if (isVisible && !fetchingStarted) {
  //     setFetchingStarted(true);
  //     const { promise: personPromise, cancel: personCancel } =
  //       cancellablePromise(getPerson(result.riderId));
  //     personPromise.then((rider) => {
  //       setRider(rider);
  //     });

  //     const { promise: testPromise, cancel: testCancel } = cancellablePromise(
  //       getTest(result.testId, new URLSearchParams({ expand: "competition" }))
  //     );
  //     testPromise.then((test) => {
  //       setTest(test);
  //     });

  //     return () => {
  //       personCancel();
  //       testCancel();
  //     };
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [result, isVisible]);

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

    return result.state === "VALID" ? result.score : result.state;
  }, [result.score, test, result.state]);

  const renderRider = useMemo(() => {
    if (!rider || !test)
      return (
        <>
          <Skeleton style={{ height: "24px" }} />
          <Skeleton style={{ width: "60%", height: "24px" }} />
        </>
      );

    return (
      <>
        <Link to={`/rider/${rider.id}/results/${test?.catalogCode}`}>
          {rider.firstName} {rider.lastName}
        </Link>
      </>
    );
  }, [rider, test]);

  return (
    <li
      className="flatlist-item"
      style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) 8ch" }}
      ref={ref}
    >
      <div className="mobile-span-3">{renderRider}</div>
      <div className="mobile-span-3">{renderTest}</div>
      <div className="mark">{renderMark}</div>
    </li>
  );
};

const BestResult: React.FC<{
  horseId: string;
  testcode?: string;
  order?: string;
}> = ({ horseId, testcode, order }) => {
  const [result, setResult] = useState<Result>();

  useEffect(() => {
    if (!order || !testcode) return;

    const params = new URLSearchParams({
      limit: "1",
      orderBy: `mark ${order}`,
      "filter[]": `mark > 0`,
      expand: "test,horse",
    });
    params.append("filter[]", `horseId == ${horseId}`);
    params.append("filter[]", `test.testcode == ${testcode}`);

    const { promise, cancel } = cancellablePromise(getResults(params));
    promise.then(([results]) => {
      setResult(results[0]);
    });

    return cancel;
  }, [horseId, testcode, order]);

  useEffect(() => {
    setResult(undefined);
  }, [horseId, testcode]);

  return (
    <FeaturedCard
      title="Personal best"
      featuredText={result?.score}
      additionalText={result?.entry?.participant?.equipage?.horse?.horseName}
    />
  );
};

const BestRank: React.FC<{ horseId: string; test?: Test }> = ({
  horseId,
  test,
}) => {
  const [rank, setRank] = useState<string>();
  const [listname, setListname] = useState<string>();

  useEffect(() => {
    let resultCancel = () => {};
    let rankingListCancel = () => {};
    const getBestRank = async () => {
      if (!test) return;
      const params = new URLSearchParams({
        limit: "1",
        "filter[]": "mark > 0",
        expand: "test",
        order: `mark ${test.order}`,
      });
      params.append("filter[]", `test.testcode == ${test.catalogCode}`);
      params.append("filter[]", `horses contains id == ${horseId}`);

      const { promise: resultPromise, cancel: rc } = cancellablePromise(
        getRankingResults(params)
      );
      resultCancel = rc;

      const [results] = await resultPromise;

      if (!results || results.length === 0) {
        setRank("N/A");
        setListname(`Not currently ranked in ${test.catalogCode}`);
        return;
      }

      setRank(results[0].rank.toString());

      if (!results[0].test) return;

      const { promise: rankingListPromise, cancel: rlc } = cancellablePromise(
        getRankingList(results[0].test.rankinglistId)
      );
      rankingListCancel = rlc;
      const rankinglist = await rankingListPromise;

      setListname(rankinglist.shortname);
    };
    setRank(undefined);
    setListname(undefined);

    getBestRank();
    return () => {
      resultCancel();
      rankingListCancel();
    };
  }, [horseId, test]);
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

export const HorseResults: React.FC = () => {
  const [horse] = useHorse();
  const { testcode } = useParams<{ testcode: string }>();

  const [results, setResults] = useState<Result[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [loading, setLoading] = useState<boolean>(false);

  const cancelLoading = useRef(() => {});

  const getNextPage = useCallback(
    async (horseId: string): Promise<void> => {
      if (loading || (results.length > 0 && !pagination?.hasNext)) return;
      setLoading(true);
      cancelLoading.current();

      const params = new URLSearchParams({
        page: pagination?.nextPage?.toString() ?? "1",
        perPage: "10",
        "filter[]": `horseId == ${horseId}`,
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

  if (!horse) return null;

  return (
    <>
      <h2 className="subtitle">{testcode} results</h2>
      <div className="grid-col-3">
        <BestResult
          horseId={horse.id}
          testcode={results[0]?.entry?.test?.catalogCode}
          order={results[0]?.entry?.test?.order}
        />
        <BestRank horseId={horse.id} test={results[0]?.entry?.test} />
        <Activity numberOfResults={pagination?.totalItems} />
      </div>
      <FlatList
        items={results}
        RenderComponent={HorseResult}
        onBottomReached={() => getNextPage(horse.id)}
        extraData={horse}
        hasMoreItems={
          (!pagination && results.length === 0) ||
          (pagination && pagination.hasNext)
        }
      />
    </>
  );
};
