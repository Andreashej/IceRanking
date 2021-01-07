import React from 'react';
import {connect} from 'react-redux';
import { setCurrentPage } from '../../actions';

import EventList from '../../components/partials/EventList';

import competitionService from '../../services/competition.service';

class RankingEvents extends React.Component {
    state = {
        events: null,
        limit: 10
    }

    componentDidMount() {
        this.props.setCurrentPage(this.props.location.pathname);

        const today = new Date()

        competitionService.getCompetitions({
            filter: "include_in_ranking contains DRL",
            filter: `first_date > ${today.toLocaleDateString()}`,
            order_by: "first_date asc",
            limit: this.state.limit
        }).then(competitions => {
            console.log(competitions);
            this.setState({
                events: competitions
            })
        })
    }

    renderEvents(filter = 'upcoming') {
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

export default connect(null, { setCurrentPage })(RankingEvents);