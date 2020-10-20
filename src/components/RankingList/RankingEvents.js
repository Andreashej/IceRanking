import React from 'react';
import {connect} from 'react-redux';
import { setCurrentPage } from '../../actions';

import EventList from '../partials/EventList';

class RankingEvents extends React.Component {
    componentDidMount() {
        this.props.setCurrentPage(this.props.location.pathname);
    }

    renderEvents(filter = 'upcoming') {
        if (!this.props.events) {
            return <div>Loading...</div>;
        }

        if (filter === 'upcoming') {
            return <EventList events={[]} />
        }

        return (
            <EventList events={this.props.ranking.competitions} />
        );
    }

    render() {
        return this.renderEvents()
    }
}

const mapStateToProps = (state, ownProps) => {
    if (state.rankings[ownProps.shortname]) {
        return {
            events: state.rankings[ownProps.match.params.shortname].competitions,
        }
    } else {
        return {
            events: []
        }
    }
}

export default connect(mapStateToProps, { setCurrentPage })(RankingEvents);