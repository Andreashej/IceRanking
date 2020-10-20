import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { markToDouble } from '../../tools';
import { getHorseResults } from '../../actions';
import { ProgressSpinner } from 'primereact/progressspinner';

class HorseResults extends React.Component {
    state = {
        expandedRows: []
    }

    componentDidMount() {
        this.props.getHorseResults(this.props.horseId, this.props.testcode);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.testcode !== this.props.testcode) {
            this.props.getHorseResults(this.props.horseId, this.props.testcode)
        }
    }

    renderHorse(rowData, column) {
        return (
            <Link to={`/rider/${rowData.rider.id}/tests/${this.props.testcode}`} >{rowData.rider.fullname}</Link>
        );
    }

    renderMark(rowData, column) {
        return markToDouble(rowData.mark, rowData.test.rounding_precision);
    }

    bestResult() {
        if (!this.props.results) {
            return <ProgressSpinner />
        }
        const best = this.props.best;
        return (
            <>
                <h4 className="display-4 featured-number">{markToDouble(best.mark, best.test.rounding_precision)}</h4>
                <p className="lead mb-0">{best.rider.fullname}</p>
            </>
        )
    }

    bestRank() {
        if (!this.props.results) {
            return <ProgressSpinner />
        }

        return (
            <>
                <h4 className="display-4 featured-number">1</h4>
                <p className="lead mb-0">Den Danske Rangliste</p>
            </>
        )
    }

    activity() {
        if (!this.props.results) {
            return <ProgressSpinner />
        }

        return (
            <>
                <h4 className="display-4 featured-number">{this.props.results.length}</h4>
                <p className="lead mb-0">results</p>
            </>
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
                    className="p-button-raised p-button-rounded" 
                    tooltip={tooltip} 
                    tooltipOptions={{position: "top"}}
                    onClick={() => this.props.history.push(`/rankings/${ranking.shortname}/tests/${this.props.testcode}`)}
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
                <div className="col-12 col-md-4 pb-3 pb-md-0">
                    <Card title="Personal best" className="featured-card">
                        {this.bestResult()}
                    </Card>
                </div>
                <div className="col-12 col-md-4 pb-3 pb-md-0">
                    <Card title="Best rank" className="featured-card">
                        {this.bestRank()}
                    </Card>
                </div>
                <div className="col-12 col-md-4 pb-3 pb-md-0">
                    <Card title="Activity"  className="featured-card">
                        {this.activity()}
                    </Card>
                </div>
            </div>
            <DataTable className="results-table mt-4" value={this.props.results} autoLayout={true} rowExpansionTemplate={(row) => this.rowExtraTemplate(row)} expandedRows={this.state.expandedRows} onRowToggle={(e) => this.setState({expandedRows:e.data})} dataKey="id">
                <Column expander={true} className="expander" />
                <Column field="rider.fullname" className="rider" header="Rider" body={(rowData, col) => this.renderHorse(rowData, col)} />
                <Column field="test.competition.name" className="competition" header="Competition" />
                <Column field="mark" header="Mark" className="mark" body={this.renderMark} />
                <Column field="test.competition.include_in_ranking.shortname" className="rankings" header="" body={(r, c) => this.getValidity(r, c)} />
            </DataTable>
            </>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        results: state.horses[ownProps.horseId].results[ownProps.testcode].history,
        best: state.horses[ownProps.horseId].results[ownProps.testcode].best,
    };
};

export default withRouter(connect(mapStateToProps, { getHorseResults } )(HorseResults))