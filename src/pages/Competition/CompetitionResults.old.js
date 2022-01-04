import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTest, getCompetition } from '../../actions';
import { markToDouble } from '../../tools';

class CompetitionResults extends React.Component {
    
    componentDidMount() {
        this.props.getCompetition(this.props.match.params.id).then(() => {
            if (this.props.test) {
                this.props.getTest(this.props.test.id);
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.test && (prevProps.match.params.testcode !== this.props.match.params.testcode || !this.props.test.results)) {
            this.props.getTest(this.props.test.id);
        }
    }

    renderRider(rowData, col) {
        return ( 
            <Link to={`/rider/${rowData.rider.id}/results/${this.props.match.params.testcode}`}>{rowData.rider.fullname}</Link>
        )
    }

    renderHorse(rowData, col) {
        return (
            <Link to={`/horse/${rowData.horse.id}/results/${this.props.match.params.testcode}`}>{rowData.horse.horse_name}</Link>
        )
    }

    renderMark(rowData) {
        return markToDouble(rowData.mark, this.props.test.rounding_precision);
    }

    render() {
        return (
            <>
                <div className="row">
                    <div className="col">
                        <h2 className="subheader">{this.props.match.params.testcode} results</h2>
                    </div>
                </div>
                {(this.props.test && this.props.test.results && <DataTable className="results-table mt-4" value={this.props.test.results} autoLayout={true} dataKey="id">
                    <Column field="rank" className="minimize rank" />
                    <Column field="rider.fullname" className="rider" header="Rider" body={(rowData, col) => this.renderRider(rowData, col)} />
                    <Column field="horse.horse_name" className="horse" header="Horse" body={(rowData, col) => this.renderHorse(rowData, col)} />
                    <Column field="mark" className="mark" header="Mark" body={(rowData) => this.renderMark(rowData)} />
                </DataTable>) || <ProgressSpinner />}
            </>
        )
    }
}

const mapStateToProps = (state, ownProps) => {

    return {
        competition: state.competitions[ownProps.match.params.id],
        test: state.competitions[ownProps.match.params.id] ? state.competitions[ownProps.match.params.id].tests[ownProps.match.params.testcode] : null
    }
}

export default connect(mapStateToProps, { getTest, getCompetition })(CompetitionResults);