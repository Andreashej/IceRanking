import React from 'react';
import { connect } from 'react-redux';

import { getRanking, updateRanking, getProfile, setCurrentPage } from '../../../actions/index';

import {InputText} from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';

class EditRanking extends React.Component {
    growl;

    state = {
        listname: "",
        shortname: "",
        results_valid_days: 0
    }

    componentDidMount() {
        this.props.getProfile().then(()=>{
            if (!this.props.user) {
                this.props.history.push(`/rankings/${this.props.match.params.shortname}`);            
            }
        });

        this.props.getRanking(this.props.match.params.shortname);

        this.props.setCurrentPage(this.props.location.pathname);
    }

    componentDidUpdate(prevProps) {
        if (this.props.ranking && !this.state.listname) {
            this.setState({
                listname: this.props.ranking.listname,
                shortname: this.props.ranking.shortname,
                results_valid_days: this.props.ranking.results_valid_days
            });
        }
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.updateRanking(this.props.shortname, this.state).then(
            () => {
                this.growl.show({severity: 'success', summary: 'Success!', detail: "The options were saved successfully."});
            }
        );
    }

    render() {
        if (this.props.ranking) {
            return (
                <>
                    <Growl ref={el => {this.growl = el}}></Growl>
                    <h2 className="subheader">Ranking options</h2>
                    <form id="editRanking" onSubmit={e => this.onSubmit(e)}>
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
                        <Button type="submit" label="Save" className="p-button-success p-button-raised p-button-rounded" icon="pi pi-save" />
                    </form>
                </>
            );
        }
        return null;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ranking: state.rankings[ownProps.match.params.shortname],
        user: state.users.currentUser
    }
};

export default connect(mapStateToProps, { getRanking, updateRanking, getProfile, setCurrentPage })(EditRanking);