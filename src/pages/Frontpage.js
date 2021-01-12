import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card } from 'primereact/card'
import { dateToString } from '../tools';

import competitionService from '../services/competition.service';

import { getRankings } from '../actions';
import EventList from '../components/partials/EventList';

class Frontpage extends React.Component {
    state = {
        upcomingEvents: [],
        recentEvents: [],
    }

    componentDidMount() {
        this.props.getRankings();

        const today = new Date()

        competitionService.getCompetitions({
            filter: `first_date > ${dateToString(today)}`,
            order_by: "first_date asc",
            limit: 5
        }).then(competitions => {
            this.setState({
                upcomingEvents: competitions
            })
        });

        competitionService.getCompetitions({
            filter: `first_date < ${dateToString(today)}`,
            order_by: "first_date desc",
            limit: 5
        }).then(competitions => {
            this.setState({
                recentEvents: competitions
            })
        });
    }

    renderCardRow() {
        return this.props.rankings.map((ranking) => {
            return (
                <div className="jumbotron bg-light border-blue border-bottom border-primary mb-0" key={ranking.id}> 
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-sm-auto d-flex justify-content-center">
                                <img className="logo" src={ranking.logo} style={{ width: 150 }} alt={`${ranking.shortname} logo`} />
                            </div>
                            <div className="col">
                                <h2 className="display-4">{ranking.shortname}</h2>
                                <p className="lead">{ranking.listname}</p>
                                <Link to={`/rankings/${ranking.shortname}`} className="btn btn-primary">
                                    Go to ranking list
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )
        });
    }

    
    render() {
        const eventCardStyle= { margin: "-1em", marginTop: "1em", borderTop: "1px solid rgba(0, 0, 0, 0.125)" };

        return (
            <React.Fragment>
                <section className="frontpage-branding">
                    <div className="jumbotron jumbotron-fluid mb-0">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h1 className="display-3">Welcome to IceCompass Rankings</h1>
                                    <hr className="stylish-line" />
                                    <p className="lead" style={{fontSize: "2rem"}}>A simple, modern ranking system</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="container-fluid bg-light px-0">
                    {this.renderCardRow()}
                </section>
                <section className="container-fluid px-0 bg-info">
                    <div className="container">
                        <div className="row py-5">
                            <div className="col-12 col-md">
                                <Card title="Upcoming events">
                                    <EventList events={this.state.upcomingEvents} style={eventCardStyle} noEventsText="There are no upcoming events :(" />
                                </Card>
                            </div>
                            <div className="col-12 col-md">
                                <Card title="Recently finished">
                                    <EventList events={this.state.recentEvents} style={eventCardStyle} />
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        rankings: Object.values(state.rankings)
    }
}

export default connect(mapStateToProps, { getRankings })(Frontpage);