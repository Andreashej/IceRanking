import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import React from 'react'
import { connect } from 'react-redux'
import { updateRider } from '../../../actions';
import riderService from '../../../services/rider.service';

class RiderSettings extends React.Component {
    toast;

    state = {
        firstName: "",
        lastName: "",
        aliases: [],
        newAlias: "",
        mergeId: ""
    }

    componentDidMount() {
        riderService.getAliases(this.props.match.params.id).then(aliases => {
            this.setState({
                aliases
            });
        });
    }

    componentDidUpdate() {
        if (this.props.rider && !this.state.firstName) {
            this.setState({
                firstName: this.props.rider.firstname,
                lastName: this.props.rider.lastname
            })
        }
    }

    aliasList() {
        return this.state.aliases.map((alias) => {
            return (
                <li className="list-group-item" key={alias.id}>{alias.alias}</li>
            )
        })
    }

    async onSave(e) {

        e.preventDefault();
        if (this.state.firstName && this.state.lastName) {
            await this.props.updateRider(this.props.match.params.id, {
                fname: this.state.firstName,
                lname: this.state.lastName
            });
        }

        this.toast.show({ severity: 'success', summary: 'Rider saved'})
    }

    async addAlias() {
        try {
            const aliases = await riderService.createAlias(this.props.match.params.id, {
                alias: this.state.newAlias
            });
    
            this.setState({
                aliases,
                newAlias: ''
            });
    
            this.toast.show({ severity: 'success', summary: 'Alias added'});
        } catch (e) {
            this.toast.show({ severity: 'error', summary: 'Error', detail: e})
            this.setState({
                newAlias: ""
            })
        }
    }

    async mergeRiders() {
        try {
            const aliases = await riderService.createAlias(this.props.match.params.id, {
                rider: this.state.mergeId
            });

            this.setState({
                aliases,
                mergeId: ""
            });
    
            this.toast.show({ severity: 'success', summary: 'Riders merged'});
        } catch (e) {
            this.toast.show({ severity: 'error', summary: 'Error', detail: e});
            this.setState({
                mergeId: ""
            })

        }

    }

    render() {
        return (
            <>
                <Toast ref={el => this.toast = el}></Toast>
                <h2 className="subtitle">Edit rider</h2>
                <form id="editRider" className="mt-4" onSubmit={e => this.onSave(e)}>
                    <span className="p-float-label">
                        <InputText id="firstName" value={this.state.firstName} onChange={(e) => this.setState({ firstName: e.target.value })} />
                        <label htmlFor="firstName">First name</label>
                    </span>
                    <span className="p-float-label">
                        <InputText id="lastName" value={this.state.lastName} onChange={(e) => this.setState({ lastName: e.target.value })}  />
                        <label htmlFor="lastName">Last name</label>
                    </span>
                    <Button type="submit" label="Save" className="p-button-success p-button-raised p-button-rounded" icon="pi pi-save" />
                </form>
                <h2 className="subtitle mt-4">Aliases</h2>
                <ul className="list-group">
                    {this.aliasList()}
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col">
                                <InputText id="alias" placeholder="New alias" value={this.state.newAlias} onChange={(e) => this.setState({ newAlias: e.target.value })} />
                                <Button type="button" label="Add alias" icon="pi pi-plus" className="p-button-info" onClick={(e) => this.addAlias()} />
                            </div>
                            <div className="col">
                                <InputText id="mergeRider" placeholder="Rider ID to merge" value={this.state.mergeId} onChange={(e) => this.setState({ mergeId: e.target.value })} />
                                <Button type="button" label="Merge riders" icon="pi pi-plus" className="p-button-info" onClick={(e) => this.mergeRiders()} />
                            </div>
                        </div>
                    </li>
                </ul>
            </>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        rider: state.riders[ownProps.match.params.id],
    }
}

export default connect(mapStateToProps, { updateRider })(RiderSettings);