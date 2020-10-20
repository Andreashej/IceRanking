import React from 'react';
import { connect } from 'react-redux';

import { getRanking, getRankingTests, getRankingTestResult, setCurrentPage } from '../../actions';

import { ProgressSpinner } from 'primereact/progressspinner';

import ResultList from '../partials/ResultList';

class RankingResultList extends React.Component {

    componentDidMount() {
        const { shortname, testcode } = this.props.match.params;

        this.props.getRanking(shortname).then(() => {
            this.props.getRankingTests(shortname).then(() => {
                this.props.getRankingTestResult(shortname, testcode);
            });
        });

        this.props.setCurrentPage(this.props.location.pathname);

    }

    componentDidUpdate(prevProps) {
        const { shortname, testcode } = this.props.match.params;

        if (prevProps.match.params.testcode !== this.props.match.params.testcode) {
            // test was changed

            this.props.getRankingTests(shortname).then(() => {
                this.props.getRankingTestResult(shortname, testcode);
            });
            
            this.props.setCurrentPage(this.props.location.pathname);
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
        ranking: state.rankings[ownProps.match.params.shortname],
    }

    if (props.ranking) {
        props = {...props, test: props.ranking.tests[ownProps.match.params.testcode]}
    }

    return props;
}

export default connect(mapStateToProps, { getRanking, getRankingTests, getRankingTestResult, setCurrentPage })(RankingResultList);