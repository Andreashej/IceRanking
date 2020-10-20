import React from 'react';
import { connect } from 'react-redux';

import Page from '../partials/Page';
import HorseResults from './HorseResults';

import {getHorse} from '../../actions';

class HorseProfile extends React.Component {

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
        return this.props.horse ? `${this.props.horse.horse_name}` : null;
    }

    getMenuItems() {
        const tests = this.props.horse ? this.props.horse.testlist.map( testcode => {
            return {
                label: testcode,
                className: this.props.match.params.testcode === testcode ? 'active' : null,
                command: () => this.props.history.push(`/horse/${this.props.horse.id}/results/${testcode}`)
            };
        }) : [];

        return [
            {
                label: "Overview",
                className: !this.props.match.params.testcode ? "active" : null,
                command: () => this.props.history.push(`/horse/${this.props.horse.id}`)
            },
            {
                label: "Results",
                items: tests
            }
        ];
    }

    getContent() {
        if (this.props.horse) {
            switch (this.props.match.params.page) {
                case 'results':
                    return <HorseResults testcode={this.props.match.params.testcode} horseId={this.props.match.params.id} />;
                default:
                    return <p>Overview</p>
            }
        }
    }

    render() {
        return (
            <Page title={this.getFullName()} icon="horse-head" menuItems={this.getMenuItems()}>
                <div className="row">
                    <div className="col">
                        <h2 className="subtitle">{this.getTitle()}</h2>
                        {this.getContent()}
                    </div>
                </div>
            </Page>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        horse: state.horses[ownProps.match.params.id]
    }
}

export default connect(mapStateToProps, { getHorse })(HorseProfile);