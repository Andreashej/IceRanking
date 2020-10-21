import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';
import { connect } from 'react-redux';
import { getTest, getCompetition } from '../../actions';

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

    render() {
        console.log(this.props.test);
        return (
            <>
                <div className="row">
                    <div className="col">
                        <h2 className="subheader">{this.props.match.params.testcode} results</h2>
                    </div>
                </div>
                {this.props.test && <DataTable className="results-table mt-4" value={this.props.test.results} autoLayout={true} dataKey="id">
                    <Column field="rider.fullname" className="rider" header="Rider" />
                    <Column field="horse.horse_name" className="horse" header="Horse" />
                    <Column field="mark" className="mark" header="Mark" />
                    {/* <Column field="test.competition.name" className="competition" header="Competition" />
                    <Column field="mark" header="Mark" className="mark" body={this.renderMark} />
                    <Column field="test.competition.include_in_ranking.shortname" className="rankings" header="" body={(r, c) => this.getValidity(r, c)} /> */}
                </DataTable>}
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