import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { dateToString } from "../tools";

import { Competition } from "../models/competition.model";
import { getCompetitions } from "../clients/v3/competition.service";
import { RankingList } from "../models/rankinglist.model";
import { getRankingLists } from "../clients/v3/rankinglist.service";
import EventList from "../components/partials/EventList";
import { useProfile } from "../contexts/user.context";

export const Frontpage: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Competition[]>([]);
  const [recentEvents, setRecentEvents] = useState<Competition[]>([]);
  const [rankingLists, setRankingLists] = useState<RankingList[]>([]);
  const [user] = useProfile();

  useEffect(() => {
    const today = new Date();

    const upcomingParams = new URLSearchParams({
      startDateAfter: dateToString(today, "Y-M-d"),
      orderBy: "startDate",
      limit: "5",
    });

    getCompetitions(upcomingParams).then(([competitions]) => {
      setUpcomingEvents(competitions);
    });

    const recentParams = new URLSearchParams({
      startDateBefore: dateToString(today, "Y-M-d"),
      orderBy: "-startDate",
      limit: "5",
    });

    getCompetitions(recentParams).then(([competitions]) => {
      setRecentEvents(competitions);
    });

    getRankingLists().then(([rankingLists]) => {
      setRankingLists(rankingLists);
    });
  }, []);

  const rankingListRender = rankingLists?.map((rankingList) => {
    return (
      <div
        className="jumbotron bg-light border-blue border-bottom border-primary mb-0"
        key={rankingList.id}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-auto d-flex justify-content-center">
              <img
                className="logo"
                src={`${process.env.REACT_APP_API_URL}${rankingList.logoUrl}`}
                style={{ width: 150, height: 150 }}
                alt={`${rankingList.shortname} logo`}
              />
            </div>
            <div className="col">
              <h2 className="display-4">{rankingList.shortname}</h2>
              <p className="lead">{rankingList.listname}</p>
              <Link
                to={`/rankinglist/${rankingList.shortname}`}
                className="btn btn-primary"
              >
                Go to ranking list
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const eventCardStyle = {
    margin: "-1em",
    marginTop: "1em",
    borderTop: "1px solid rgba(0, 0, 0, 0.125)",
  };

  const welcomeText = useMemo(() => {
    if (user?.person) {
      return (
        <>
          Welcome,
          <br />
          {user.person.firstName}
        </>
      );
    }

    return "Welcome";
  }, [user]);

  return (
    <>
      <section className="frontpage-branding">
        <div className="jumbotron jumbotron-fluid mb-0">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-auto d-flex order-2 order-lg-1">
                <img
                  src="assets/img/iceranking_textunder.png"
                  style={{
                    height: 250,
                    maxWidth: "80vw",
                  }}
                  alt="Large app logo"
                />
              </div>
              <div className="col-12 col-lg d-flex order-1 order-lg-2 align-items-center stylish-border">
                <h1
                  className="display-2"
                  style={{ fontSize: "min(12vw, 5.5rem)" }}
                >
                  {welcomeText}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container-fluid bg-light px-0">
        {rankingListRender}
      </section>
      <section className="container-fluid px-0 bg-info">
        <div className="container">
          <div className="row py-5">
            <div className="col-12 col-md">
              <Card title="Upcoming events" className="list-card">
                <EventList
                  events={upcomingEvents}
                  style={eventCardStyle}
                  noEventsText="There are no upcoming events :("
                />
              </Card>
            </div>
            <div className="col-12 col-md pt-4 pt-md-0">
              <Card title="Most recent results" className="list-card">
                <EventList events={recentEvents} style={eventCardStyle} />
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
