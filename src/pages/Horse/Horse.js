import React from 'react';
import { connect } from 'react-redux';

import Page from '../../components/partials/Page';
import HorseResults from './HorseResults';
import HorseInfo from './HorseInfo';

import {getHorse} from '../../actions';
import { Route, Switch } from 'react-router-dom';
import history from '../../history';

class Horse extends React.Component {

    componentDidMount() {
        this.props.getHorse(this.props.match.params.id);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.props.getHorse(this.props.match.params.id);
        }
    }
    
    getTitle() {
        switch(this.props.match.params.page) {
            case 'results':
                return `${this.props.match.params.testcode} results`;
            default:
                return "Overview"
        }
    }

    getFullName() {
        return this.props.horse && this.props.horse.horse_name;
    }

    getFeifId() {
        return this.props.horse && this.props.horse.feif_id;
    }

    getMenuItems() {
        const tests = this.props.horse && "testlist" in this.props.horse ? this.props.horse.testlist.map( testcode => {
            return {
                label: testcode,
                className: history.location.hash.includes(testcode) ? 'active' : null,
                command: () => this.props.history.push(`/horse/${this.props.horse.id}/results/${testcode}`)
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
            <Page title={this.getFullName()} subtitle={this.getFeifId()} icon="horse-head" menuItems={this.getMenuItems()}>
                <Switch>
                    <Route exact path="/horse/:id" component={HorseInfo} />
                    <Route path="/horse/:id/results/:testcode" component={HorseResults} />
                </Switch>
            </Page>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        horse: state.horses[ownProps.match.params.id]
    }
}

export default connect(mapStateToProps, { getHorse })(Horse);