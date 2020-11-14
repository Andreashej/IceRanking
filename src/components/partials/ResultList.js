import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { markToDouble } from '../../tools';
import { Link } from 'react-router-dom';

class ResultList extends React.Component {

    getSubmarks = (result, col) => {
        return result.marks.map((mark, index) => {
            return (
                <span key={mark.id}>
                    {index > 0 && ", "}
                    <Link to={`/competition/${mark.test.competition.id}/test/${mark.test.testcode}`}>{markToDouble(mark.mark, this.props.rounding_precision)}</Link>
                </span>
            )
            
        });
    }

    getDisplayName = (result) => {
        if (this.props.type === 'rider') {
            return <Link to={`/rider/${result.riders[0].id}/results/${this.props.testcode}`}>{result.riders[0].fullname}</Link>;
        } else if (this.props.type === 'horse') {
            return <Link to={`/horse/${result.horses[0].id}/results/${this.props.testcode}`}>{`${result.horses[0].horse_name} (${result.horses[0].feif_id})`}</Link>;
        }
    }

    getDisplayHeader = () => {
        if (this.props.type) return `${this.props.type.charAt(0).toUpperCase()}${this.props.type.slice(1)}`;
        else return;
    }

    render() {
        return (
            <DataTable className="results-table" value={this.props.results} autoLayout={true}>
                <Column field="rank" header="" className="minimize rank" />
                <Column field="name" body={(result, col) => this.getDisplayName(result)} header={this.getDisplayHeader()} />
                <Column field="submarks" className="submark" body={this.getSubmarks} header="" />
                <Column field="mark" className="mark minimize" header="Mark" body={(result, col) => markToDouble(result.mark, this.props.rounding_precision)} />
            </DataTable>
        );
    }
}

export default ResultList;