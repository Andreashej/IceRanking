import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { markToDouble } from '../../tools';
import { getRiderResults, getRider } from '../../actions';
import { ProgressSpinner } from 'primereact/progressspinner';

class RiderResults extends React.Component {
    state = {
        expandedRows: []
    }

    componentDidMount() {
        this.props.getRider(this.props.match.params.id).then(() => {
            this.props.getRiderResults(this.props.match.params.id, this.props.match.params.testcode).then((results) => {
                if (!this.props.results) {
                    this.props.history.push(`/rider/${this.props.match.params.id}`);
                }
            });
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.testcode !== this.props.match.params.testcode) {
            this.props.getRiderResults(this.props.match.params.id, this.props.match.params.testcode);
        }
    }

    renderHorse(rowData, column) {
        return (
            <Link to={`/horse/${rowData.horse.id}/results/${this.props.match.params.testcode}`} >{rowData.horse.horse_name}<span className="horse-id d-none d-md-inline"> ({rowData.horse.feif_id})</span></Link>
        );
    }

    renderMark(rowData, column) {
        return markToDouble(rowData.mark, rowData.test.rounding_precision);
    }

    renderCompetition(rowData, col) {
        return (
            <Link to={`/competition/${rowData.test.competition.id}/test/${this.props.match.params.testcode}`}>{rowData.test.competition.name}</Link>
        )
    }

    bestResult() {
        if (!this.props.results) {
            return <ProgressSpinner />
        }
        const best = this.props.best;
        return (
            <Card title="Personal best" className="featured-card">
                <h4 className="display-4 featured-number">{markToDouble(best.mark, best.test.rounding_precision)}</h4>
                <p className="lead mb-0">{best.horse.horse_name}</p>
            </Card>
        )
    }

    bestRank() {
        if (!this.props.results) {
            return <ProgressSpinner />
        }

        let content;

        if (this.props.bestRank.rank) {
            content = (
                <>
                    <h4 className="display-4 featured-number">{this.props.bestRank.rank}</h4>
                    <p className="lead mb-0">{this.props.bestRank.test.rankinglist.listname}</p>
                </>
            );
        } else {
            content = (
                <>
                    <h4 className="display-4 featured-number">N/A</h4>
                    <p className="lead mb-0">Not currently ranked in {this.props.match.params.testcode}</p>
                </>
            )
        }


        return (
            <Card title="Best rank" className="featured-card">
                {content}
            </Card>
        )
    }

    activity() {
        if (!this.props.results) {
            return <ProgressSpinner />
        }

        return (
            <Card title="Activity" className="featured-card">
                <h4 className="display-4 featured-number">{this.props.results.length}</h4>
                <p className="lead mb-0">results</p>
            </Card>
        );
    }

    getValidity(rowData, column) {
        return rowData.test.competition.include_in_ranking.map(ranking => {
            const expiryDate = new Date()
            expiryDate.setTime(new Date(rowData.test.competition.last_date).getTime() + ranking.results_valid_days * 24 * 60 * 60 * 1000);
            
            const tooltip = `The result is valid for ${ranking.listname} until ${expiryDate.getDate()}/${expiryDate.getMonth()+1}/${expiryDate.getFullYear()}.`

            const isValid = new Date() <= expiryDate;
            return (
                <Button key={ranking.shortname}
                    label={ranking.shortname} 
                    className="p-button-sm p-button-text" 
                    tooltip={tooltip} 
                    tooltipOptions={{position: "top"}}
                    onClick={() => this.props.history.push(`/rankings/${ranking.shortname}/tests/${this.props.match.params.testcode}`)}
                    disabled={!isValid}
                />
            )
        });
    }

    rowExtraTemplate(result) {
        return (
            <div className="row d-flex d-md-none">
                <div className="col">
                    <ul className="list-unstyled mb-0">
                        <li>
                            <b>Competition:</b> {result.test.competition.name} ({new Date(result.test.competition.first_date).toLocaleDateString()} - {new Date(result.test.competition.last_date).toLocaleDateString()})
                        </li>
                        <li>
                            <b>Valid for:</b><br />
                            {this.getValidity(result)}
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

    render() {
        return (
            <>
            <div className="row">
                <div className="col">
                    <h2 className="subtitle">{this.props.match.params.testcode} results</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-4 pb-3 pb-md-0">
                    {this.bestResult()}
                </div>
                <div className="col-12 col-md-4 pb-3 pb-md-0">
                    {this.bestRank()}
                </div>
                <div className="col-12 col-md-4 pb-3 pb-md-0">
                    {this.activity()}
                </div>
            </div>
            {(this.props.results && <DataTable className="results-table mt-4" value={this.props.results} autoLayout={true} rowExpansionTemplate={(row) => this.rowExtraTemplate(row)} expandedRows={this.state.expandedRows} onRowToggle={(e) => this.setState({expandedRows:e.data})} dataKey="id">
                <Column expander={true} className="expander" />
                <Column field="horse.horse_name" className="horse" header="Horse" body={(rowData, col) => this.renderHorse(rowData, col)} />
                <Column field="test.competition.name" className="competition" header="Competition" body={(rowData, col) => this.renderCompetition(rowData, col)} />
                <Column field="mark" header="Mark" className="mark" body={this.renderMark} />
                <Column field="test.competition.include_in_ranking.shortname" className="rankings" header="" body={(r, c) => this.getValidity(r, c)} />
            </DataTable>) || <ProgressSpinner />}
            </>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    if(!state.riders[ownProps.match.params.id] || !state.riders[ownProps.match.params.id].results[ownProps.match.params.testcode]) {
        return {};
    }

    return {
        results: state.riders[ownProps.match.params.id].results[ownProps.match.params.testcode].history,
        best: state.riders[ownProps.match.params.id].results[ownProps.match.params.testcode].best,
        bestRank: state.riders[ownProps.match.params.id].results[ownProps.match.params.testcode].best_rank,
    };
};

export default withRouter(connect(mapStateToProps, { getRiderResults, getRider } )(RiderResults))