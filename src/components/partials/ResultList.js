import React from 'react';

const ResultList = ({ results, rounding_precision, type }) => {
    console.log(results);
    const items = results.map(result => {
        return <li key={result.id} className="list-group-item py-1">
            <div className="container-fluid">
                <div className="row">
                    <div className="d-flex" style={{width: "1.5rem"}}>
                        {result.rank}
                    </div>
                    <div className="col">
                        {getDisplayName(result, type)}
                    </div>
                    <div className="col-3 text-right">
                        <span className="mr-2">{markToDouble(result.final_mark, rounding_precision)}</span>
                        <i className="d-none d-md-inline">
                            {result.results.map((result, index, arr) => {
                                let mark = markToDouble(result.mark, rounding_precision);
                                return (index !== arr.length - 1) ? mark + ", " : mark;
                            })}
                        </i>
                    </div>
                </div>
            </div>
            </li>
    });

    return (
        <ol className="list-group list-group-flush border-top">
            {items}
        </ol>
    )
}

const getDisplayName = (result, type) => {
    if (type === 'rider') {
        return result.firstname + " " + result.lastname;
    } else if (type === 'horse') {
        return `${result.horse_name} (${result.feif_id})`;
    }
}

const markToDouble = (mark, precision) => {
    return ((mark * 100) / 100).toFixed(precision)
}

export default ResultList;