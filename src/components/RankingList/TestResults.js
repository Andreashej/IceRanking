import React from 'react';
import { connect } from 'react-redux';

import { getRanking, getRankingTests, getRankingTestResult } from '../../actions';

import { ProgressSpinner } from 'primereact/progressspinner';

import ResultList from '../partials/ResultList';

class RankingResultList extends React.Component {

    componentDidMount() {
        const { shortname } = this.props;

        this.props.getRanking(shortname);
    }

    componentDidUpdate() {
        const { shortname, testcode } = this.props;

        if(!this.props.ranking.tests[testcode]) {
            this.props.getRankingTests(shortname);
        } else if (this.props.ranking.tests[testcode]) {
            if(!this.props.test.results) {
                this.props.getRankingTestResult(shortname, testcode);
            }

        }


    }

    renderDescription() {
        if(!this.props.test) {
            return false;
        }

        const fromDate = new Date()
        fromDate.setTime(new Date().getTime() - (this.props.ranking.results_valid_days * 24 * 60 * 60 * 1000));

        return (
            <div className="container-fluid mt-3">
                <div className="row">
                    <div className="col">
                        <h2 className="display-4">{this.props.test.testcode} results</h2>
                        <p>This ranking is based on the best {this.props.test.included_marks} marks per {this.props.test.grouping} in {this.props.test.testcode}. The results are valid from {fromDate.toLocaleDateString()} to today. Only marks above {this.props.test.min_mark} are taken into account.</p>
                    </div>
                </div>
            </div>
        )

    }

    renderList() {
        if (!this.props.test || !this.props.test.results) {
            return false;
        }

        return (
            <ResultList results={this.props.test.results} rounding_precision={this.props.test.rounding_precision} type={this.props.test.grouping} />
        );
    }

    render() {
        const description = this.renderDescription();
        const list = this.renderList();
        if (description && list) {
            return (
                <>
                    {description}
                    {list}
                </>
            );
        } else {
            return <ProgressSpinner style={{display: "flex"}} />
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    let props = {
        ranking: state.rankings[ownProps.shortname],
    }

    if (props.ranking) {
        props = {...props, test: props.ranking.tests[ownProps.testcode]}
    }

    return props;
}

export default connect(mapStateToProps, { getRanking, getRankingTests, getRankingTestResult })(RankingResultList);