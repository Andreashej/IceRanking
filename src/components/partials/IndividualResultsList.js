import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { withRouter, Link } from 'react-router-dom';
import { markToDouble } from '../../tools';
import { ProgressSpinner } from 'primereact/progressspinner';

class RiderResults extends React.Component {
    state = {
        expandedRows: []
    }

    renderLink(rowData, column) {
        return (
            <Link to={`/horse/${rowData.horse.id}/tests/${this.props.testcode}`} >{rowData.horse.horse_name}<span className="horse-id d-none d-md-inline"> ({rowData.horse.feif_id})</span></Link>
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
            <Card title="Personal best">
                <h4 className="display-4 featured-number">{markToDouble(best.mark, best.test.rounding_precision)}</h4>
                <p className="lead mb-0">{best.horse.horse_name}</p>
            </Card>
        )
    }

    bestRank() {
        if (!this.props.results) {
            return <ProgressSpinner />
        }

        return (
            <Card title="Best rank" style={{height: "100%"}} >
                <h4 className="display-4 featured-number">1</h4>
                <p className="lead mb-0">Den Danske Rangliste</p>
            </Card>
        )
    }

    activity() {
        if (!this.props.results) {
            return <ProgressSpinner />
        }

        return (
            <Card title="Activity">
                <h4 className="display-4 featured-number">{this.props.results.length}</h4>
                <p className="lead mb-0">results</p>
            </Card>
        );
    }

    getValidity(rowData, column) {
        console.log(rowData);
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

    getColumns() {
        return this.props.columns.map(column => {
            switch(column.type) {
                case 'text':
                    return <Column field={column.field} className={`${column.type} ${column.className}`} header={column.header} />
                case 'link':
                    return <Column field={column.field} className={`${column.type} ${column.className}`} header={column.header} body={(rowData, col) => this.renderLink(rowData, col)} />
            }
        })
    }

    render() {
        return (
            <>
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
            <DataTable className="results-table mt-4" value={this.props.results} autoLayout={true} rowExpansionTemplate={(row) => this.rowExtraTemplate(row)} expandedRows={this.state.expandedRows} onRowToggle={(e) => this.setState({expandedRows:e.data})} dataKey="id">
                <Column expander={true} className="expander" />
                <Column field="horse.horse_name" className="horse" header="Horse" body={(rowData, col) => this.renderHorse(rowData, col)} />
                <Column field="test.competition.name" className="competition" header="Competition" />
                <Column field="mark" header="Mark" className="mark" body={this.renderMark} />
                <Column field="test.competition.include_in_ranking.shortname" className="rankings" header="" body={(r, c) => this.getValidity(r, c)} />
            </DataTable>
            </>
        );
    }
}

export default withRouter(RiderResults);