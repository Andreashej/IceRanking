import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Page from '../../components/partials/Page';
import CompetitionInfo from './CompetitionInfo';
import CompetitionResults from './CompetitionResults';
import CompetitionCreate from './CompetitionCreate';
import { getCompetition } from '../../actions';
import { dateToString } from '../../tools';
import Progressbar from '../../components/Task/Progressbar';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import CompetitionUpload from '../../components/Task/CompetionUpload';
import history from '../../history';

class Competition extends React.Component {
    state = {
        uploadDialogVisible: false
    }

    componentDidMount() {
        if (this.props.match.params.id !== 'create') {
            this.props.getCompetition(this.props.match.params.id);
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

        if (this.props.match.params.id === 'create') {
            return 'Create competition';
        }

        return 'Competition not found';
    }

    getMenuItems() {
        const tests = Object.values(this.props.competition.tests).map( test => {
            return {
                label: test.testcode,
                className: history.location.hash.includes(test.testcode) ? 'active' : null,
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

    getAdminItems() {
        if (!this.props.user || !this.props.competition) {
            return [];
        }

        return [
            {
                label: "Upload results",
                command: () => {
                    this.setState({ uploadDialogVisible: true })
                }
            }
        ]
    }

    getSubtitle() {
        if (!this.props.competition) return null
        
        const fromDate = new Date(this.props.competition.first_date);
        const toDate = new Date(this.props.competition.last_date);
        return `${dateToString(fromDate, 'd/m/Y')} - ${dateToString(toDate, 'd/m/Y')}`;
    }

    getContent () {
        if (!this.props.competition && this.props.match.params.id !== 'create') {
            return;
        }

        if (this.props.competition && this.props.competition.tasks_in_progress.length > 0) {
            return this.props.competition.tasks_in_progress.map(task => {
                return <Progressbar taskId={task.id} />
            })
        }

        return (
            <Switch>
                <Route exact path="/competition/create" component={CompetitionCreate} />
                <Route exact path="/competition/:id" component={CompetitionInfo} />
                <Route path="/competition/:id/test/:testcode" component={CompetitionResults} /> 
            </Switch>
        );
    }

    getDialog() {
        if (!this.props.competition) {
            return;
        }

        return (
        <Dialog header="Upload results" visible={this.state.uploadDialogVisible} onHide={() => this.setState({ uploadDialogVisible: false})}>
            <Message severity="warn" text="All current results will be deleted and replaced with the contents of the file" />
            <p>Expected filename: {this.props.competition.isirank_id}.txt</p>
            <div>
                <CompetitionUpload competitionId={this.props.competition.isirank_id} onComplete={(tasks) => { 
                    // this.props.getCompetition(this.props.match.params.id)
                    window.location.reload();
                 }} />
            </div>
        </Dialog>
        );
    }

    render() {
        return (
            <>
            <Page title={this.getTitle()} icon="calendar-alt" menuItems={this.props.competition ? this.getMenuItems() : []} subtitle={this.getSubtitle()} adminMenuItems={this.getAdminItems()}>
                {this.getContent()}
            </Page>
            {this.getDialog()}
            </>
        );
    };
}

const mapStateToProps = (state, ownProps) => {
    return {
        competition: state.competitions[ownProps.match.params.id],
        user: state.users.currentUser
    };
}

export default connect(mapStateToProps, { getCompetition })(Competition);