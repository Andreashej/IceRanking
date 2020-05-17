import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { markToDouble } from '../../tools';
import { Link } from 'react-router-dom';

class ResultList extends React.Component {

// } = ({ results, rounding_precision, type }) => {
//     const items = results.map(result => {
//         return <li key={result.id} className="list-group-item py-1">
//             <div className="container-fluid">
//                 <div className="row">
//                     <div className="d-flex" style={{width: "1.5rem"}}>
//                         {result.rank}
//                     </div>
//                     <div className="col">
//                         {getDisplayName(result, type)}
//                     </div>
//                     <div className="col-3 text-right">
//                         <span className="mr-2">{markToDouble(result.final_mark, rounding_precision)}</span>
//                         <i className="d-none d-md-inline">
//                             {}
//                         </i>
//                     </div>
//                 </div>
//             </div>
//             </li>
//     });
    getSubmarks = (result, col) => {
        return result.results.map((result, index, arr) => {
            let mark = markToDouble(result.mark, this.props.rounding_precision);
            return (index !== arr.length - 1) ? mark + ", " : mark;
        });
    }

    getDisplayName = (result) => {
        console.log(result);
        if (this.props.type === 'rider') {
            return <Link to={`/rider/${result.id}/results/${this.props.testcode}`}>{result.firstname + " " + result.lastname}</Link>;
        } else if (this.props.type === 'horse') {
            return `${result.horse_name} (${result.feif_id})`;
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
                <Column field="final_mark" className="mark minimize" header="Mark" body={(result, col) => markToDouble(result.final_mark, this.props.rounding_precision)} />
            </DataTable>
        );
    }
}

export default ResultList;