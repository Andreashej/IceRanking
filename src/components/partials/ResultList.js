import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { markToDouble } from '../../tools';
import { Link } from 'react-router-dom';

class ResultList extends React.Component {

    getSubmarks = (result, col) => {
        let marks = result.marks;
        const isCombination = this.props.testcode.charAt(0) === 'C'
        if (isCombination) {
            marks = result.marks.map((result) => {
                let sortOrder = 0;
                switch(result.test.testcode.charAt(0).toUpperCase()) {
                    case 'T':
                        sortOrder = 0;
                        break;
    
                    case 'V':
                    case 'F':
                        sortOrder = 1;
                        break;
                    
                    case 'P':
                        sortOrder = 2;
                        break;
                    
                    default:
                        sortOrder = 3;
                        break;
                }

                return {
                    ...result,
                    sortOrder 
                }
            });
    
            marks.sort((a,b) => {
                return a.sortOrder - b.sortOrder;
            });
        }

        return marks.map((mark, index) => {
            return (
                <span key={mark.id}>
                    {index > 0 && ", "}
                    {isCombination && `${mark.test.testcode}: `}<Link to={`/competition/${mark.test.competition.id}/test/${mark.test.testcode}`}>{this.getDisplayMark(mark)}</Link>
                </span>
            )
            
        });
    }

    getDisplayMark = (result, col) => {
        const mark = markToDouble(result.mark, this.props.rounding_precision)

        if (this.props.mark_type === 'time') return `${mark}s`;

        return mark;
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
                <Column field="submarks" className="submark d-none d-md-table-cell" body={this.getSubmarks} header="" />
                <Column field="mark" className="mark minimize" header="Mark" body={this.getDisplayMark} />
            </DataTable>
        );
    }
}

export default ResultList;