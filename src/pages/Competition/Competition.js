import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Page from '../../components/partials/Page';
import CompetitionInfo from './CompetitionInfo';
import CompetitionResults from './CompetitionResults';
import CompetitionCreate from './CompetitionCreate';
import { getCompetition } from '../../actions';

class Competition extends React.Component {

    componentDidMount() {
        if (this.props.match.params.id !== 'create') {
            this.props.getCompetition(this.props.match.params.id).then(() => {
                console.log("fetched competition");
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== ' create' && prevProps.match.params.id !== this.props.match.params.id) {
            this.props.getCompetition(this.props.match.params.id)
        }
    }

    getTitle() {
        if (this.props.competition) {
            return this.props.competition.name;
        }

        return 'Register competition'
    }

    getMenuItems() {
        const tests = Object.values(this.props.competition.tests).map( test => {
            return {
                label: test.testcode,
                className: this.props.match.params.testcode === test.testcode ? 'active' : null,
                command: () => this.props.history.push(`/competition/${this.props.competition.id}/test/${test.testcode}`)
            };
        });

        return [
            {
                label: "Results",
                items: tests
            }
        ];
    }

    getSubtitle() {
        if (!this.props.competition) return null
        
        const fromDate = new Date(this.props.competition.first_date);
        const toDate = new Date(this.props.competition.last_date);
        return `${fromDate.getDate()}/${fromDate.getMonth()+1}/${fromDate.getFullYear()} - ${toDate.getDate()}/${toDate.getMonth()+1}/${toDate.getFullYear()}`;
    }

    render() {
        return (
            <Page title={this.getTitle()} icon="calendar-alt" menuItems={this.props.competition ? this.getMenuItems() : []} subtitle={this.getSubtitle()}>
                <Switch>
                    <Route exact path="/competition/create" component={CompetitionCreate} />
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