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
            <>
                <h2 className="subheader">{this.props.test.testcode} results</h2>
                <p>This ranking is based on the best {this.props.test.included_marks} marks per {this.props.test.grouping} in {this.props.test.testcode}. The results are valid from {fromDate.toLocaleDateString()} to today. Only marks above {this.props.test.min_mark} are taken into account.</p>
            </>
        );

    }

    renderList() {
        if (!this.props.test || !this.props.test.results) {
            return false;
        }

        return (
            <ResultList results={this.props.test.results} rounding_precision={this.props.test.rounding_precision} type={this.props.test.grouping} testcode={this.props.test.testcode} />
        );
    }

    render() {
        const description = this.renderDescription();
        const list = this.renderList();
        if (description && list) {
            return (
                <div className="row">
                    <div className="col">
                        {description}
                        {list}
                    </div>
                </div>
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