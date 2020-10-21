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

    getMenuItems() {
        const tests = this.props.competition ? Object.values(this.props.competition.tests).map( test => {
            return {
                label: test.testcode,
                className: this.props.match.params.testcode === test.testcode ? 'active' : null,
                command: () => this.props.history.push(`/competition/${this.props.competition.id}/test/${test.testcode}`)
            };
        }) : [];

        return [
            {
                label: "Results",
                items: tests
            }
        ];
    }

    render() {
        return (
            <Page title={this.getTitle()} icon="calendar-alt" menuItems={this.getMenuItems()}>
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