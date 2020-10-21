import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Page from '../../components/partials/Page';
import CompetitionInfo from './CompetitionInfo';
import CompetitionResults from './CompetitionResults';
import { getCompetition } from '../../actions';

class Competition extends React.Component {

    componentDidMount() {
        this.props.getCompetition(this.props.match.params.id);
    }

    getTitle() {
        if (this.props.competition) {
            return this.props.competition.name;
        }
    }

    render() {
        return (
            <Page title={this.getTitle()} icon="calendar-alt">
                <Switch>
                    <Route exact path="/competition/:id" component={CompetitionInfo} />
                    <Route path="/competition/:id/test/:testcode" component={CompetitionResults} /> 
                </Switch>
            </Page>
        );
    };
}

const mapStateToProps = (state, ownProps) => {
    return {
        competition: state.competitions[ownProps.match.params.id]
    };
}

export default connect(mapStateToProps, { getCompetition })(Competition);