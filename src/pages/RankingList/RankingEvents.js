import React from 'react';
import {connect} from 'react-redux';

import EventList from '../../components/partials/EventList';

import competitionService from '../../services/competition.service';

class RankingEvents extends React.Component {
    state = {
        events: null,
        limit: 10
    }

    componentDidMount() {
        const today = new Date()

        competitionService.getCompetitions({
            filter: [
                "include_in_ranking contains DRL shortname",
                `first_date > ${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()}`
            ],
            order_by: "first_date asc",
            // limit: this.state.limit
        }).then(competitions => {
            this.setState({
                events: competitions
            })
        });
    }

    renderEvents() {
        if (!this.state.events) {
            return <div>Loading...</div>;
        }

        return (
            <EventList events={this.state.events} />
        );
    }

    render() {
        return (
            <>
                <h2 className="subtitle">Upcoming events</h2>
                {this.renderEvents()}
            </>
        )
    }
}

export default connect(null, { })(RankingEvents);