import React from 'react';
import { connect } from 'react-redux';

import { getRanking, getRankingTests, getRankingTestResult, setCurrentPage, recomputeRankingTestResult, getRankingTest } from '../../actions';

import { ProgressSpinner } from 'primereact/progressspinner';
import ProgressBar from '../../components/Task/Progressbar';
import { Button } from 'primereact/button';

import ResultList from '../../components/partials/ResultList';

class RankingResultList extends React.Component {

    componentDidMount() {
        const { shortname, testcode } = this.props.match.params;

        this.props.getRanking(shortname).then(() => {
            this.props.getRankingTests(shortname).then(() => {
                if (this.props.test && this.props.test.tasks_in_progress.length === 0) {
                    this.props.getRankingTestResult(shortname, testcode);
                }
            });
        });

        this.props.setCurrentPage(this.props.location.pathname);


    }

    componentDidUpdate(prevProps) {
        const { shortname, testcode } = this.props.match.params;

        if (prevProps.match.params.testcode !== this.props.match.params.testcode) {
            // test was changed

            this.props.getRankingTests(shortname).then(() => {
                if (this.props.test.tasks_in_progress.length === 0) {
                    this.props.getRankingTestResult(shortname, testcode);
                    
                }
            });
            document.title = `${testcode} | ${this.props.ranking.listname} | IceCompass Rankings`;
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
        if (!this.props.test) {
            return false;
        }

        if (this.props.test.tasks_in_progress.length > 0) {
            return (
                <p>Ranking is being recomputed. Please wait...</p>
            );
        } else if (!this.props.test.results) {
            return false;
        }
        
        return (
            <ResultList results={this.props.test.results} rounding_precision={this.props.test.rounding_precision} type={this.props.test.grouping} testcode={this.props.test.testcode} mark_type={this.props.test.mark_type} />
        );
    }

    onRecompute() {
        this.props.recomputeRankingTestResult(this.props.match.params.shortname, this.props.match.params.testcode).then(response => {
            this.props.getRankingTest(this.props.match.params.shortname, this.props.match.params.testcode);
        });
    }

    onRecomputeComplete() {
        const {shortname, testcode} = this.props.match.params;

        this.props.getRankingTests(shortname).then(() => {
            if (this.props.test.tasks_in_progress.length === 0) {
                this.props.getRankingTestResult(shortname, testcode);
            }
        });
    }

    renderToolbar() {
        if (!this.props.test || !this.props.user) {
            return false;
        }

        if (this.props.test.tasks_in_progress.length > 0) {
            return this.props.test.tasks_in_progress.map(task => {
                return <ProgressBar key={task.id} taskId={task.id} onComplete={() => this.onRecomputeComplete()} />
            });
        }

        return (
            <Button label="Recompute" className="mb-3" onClick={(e) => this.onRecompute(e)} />
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
                        {this.renderToolbar()}
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
        user: state.users.currentUser
    }

    if (props.ranking) {
        props = {...props, test: props.ranking.tests[ownProps.match.params.testcode]}
    }

    return props;
}

export default connect(mapStateToProps, { getRanking, getRankingTests, getRankingTest, getRankingTestResult, setCurrentPage, recomputeRankingTestResult })(RankingResultList);