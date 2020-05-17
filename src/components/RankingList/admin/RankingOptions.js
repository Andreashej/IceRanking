import React from 'react';
import { connect } from 'react-redux';

import { getRanking } from '../../../actions/index';

import {InputText} from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import { Button } from 'primereact/button';

class EditRanking extends React.Component {
    state = {
        listname: "",
        shortname: "",
        results_valid_days: 0
    }

    componentDidMount() {
        this.props.getRanking(this.props.shortname);
    }

    componentDidUpdate() {
        if (this.state.listname === "") {
            console.log(this.props.ranking);
            this.setState({
                listname: this.props.ranking.listname,
                shortname: this.props.ranking.shortname,
                results_valid_days: this.props.ranking.results_valid_days
            });
        }
    }

    render() {
        return (
            <>
                <h2 className="subheader">Ranking options</h2>
                <form id="editRankning">
                    <span className="p-float-label">
                        <InputText id="name" value={this.state.listname} onChange={(e) => this.setState({listname: e.target.value})} />
                        <label htmlFor="name">Listname</label>
                    </span>
                    <span className="p-float-label">
                        <InputText id="shortname" value={this.state.shortname} onChange={(e) => this.setState({shortname: e.target.value})} />
                        <label htmlFor="shortname">Shortname</label>
                    </span>
                    <span className="p-float-label">
                        <InputNumber id="shortname" value={this.state.results_valid_days} onChange={(e) => this.setState({results_valid_days: e.target.value})} prefix="Results are valid for " suffix=" days" style={{width: "20rem"}} />
                        <label htmlFor="shortname">Results valid for</label>
                    </span>
                    <Button label="Save" className="p-button-success p-button-raised p-button-rounded" icon="pi pi-save" />
                </form>
            </>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ranking: state.rankings[ownProps.shortname]
    }
};

export default connect(mapStateToProps, { getRanking })(EditRanking);