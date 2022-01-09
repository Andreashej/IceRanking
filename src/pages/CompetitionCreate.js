import { InputText } from 'primereact/inputtext';
import React from 'react';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { connect } from 'react-redux';
import { getRankings, getTestCatalog, createCompetition } from '../actions';
import { AutoComplete } from 'primereact/autocomplete';

class CompetitionCreate extends React.Component {
    state = {
        name: '',
        startdate: null,
        enddate: null,
        ranking_scopes: [],
        tests: [],
        filteredTests: null,
    }

    componentDidMount() {
        console.log("test");
        this.props.getRankings();
        this.props.getTestCatalog();
    }

    renderRankingOption(option) {
        return `${option.listname} (${option.shortname})`;
    }

    onSubmit(e) {
        e.preventDefault();
        console.log(this.state);
        this.props.createCompetition(this.state).then(
            (response) => {
                console.log(response);
                this.props.history.push(`/competition/${response.id}`);
            }
        );
    }

    filterTestList(event) {
        let tests = this.props.testCatalog.filter(test => !this.state.tests.includes(test));

        if (event.query.length > 0) {
            tests = tests.filter((test) => test.toLowerCase().startsWith(event.query.toLowerCase()));
        }

        this.setState({ filteredTests: tests });
    }

    parseDate(date) {
        return date.toLocaleDateString();
    }

    render() {
        return (
            <div className="row">
                <div className="col-6">
                    <h2 className="subtitle">Create competition</h2>
                    <form name="createCompetition" onSubmit={(e) => this.onSubmit(e)}>
                        <span className="p-float-label">
                            <InputText id="name" value={this.state.name} onChange={(e) => this.setState({name : e.target.value})} />
                            <label htmlFor="name">Competition name</label>
                        </span>
                        <div className="form-row">
                            <div className="col">
                                <span className="p-float-label">
                                    <Calendar name="startdate" value={this.state.startdate} dateFormat="yy-mm-dd" onChange={(e) => this.setState({ startdate: this.parseDate(e.value) })} style={{ width: '100%' }} />
                                    <label htmlFor="startdate">Start date</label>
                                </span>
                            </div>
                            <div className="col">
                                <span className="p-float-label">
                                    <Calendar name="enddate" value={this.state.enddate} dateFormat="yy-mm-dd" onChange={(e) => this.setState({ enddate: this.parseDate(e.value) })} style={{ width: '100%' }} />
                                    <label htmlFor="enddate">End date</label>
                                </span>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-6">
                                <MultiSelect name="ranking_scopes" placeholder="Ranking lists" optionLabel="shortname" optionValue="shortname" value={this.state.ranking_scopes} onChange={(e) => this.setState({ ranking_scopes: e.value})} options={this.props.rankings} itemTemplate={this.renderRankingOption} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col">
                                <span className="p-float-label" style={{ width: '100%' }}>
                                    <AutoComplete multiple name="tests" suggestions={this.state.filteredTests} completeMethod={(e) => this.filterTestList(e)} value={this.state.tests} onChange={(e) => this.setState({ tests: e.value })} style={{ width: '100%' }} inputStyle={{ width: '100%'}} panelStyle={{ width: '100%'}} />
                                    <label htmlFor="tests">Klasser</label>
                                </span>
                            </div>
                        </div>
                        <Button label="Submit" type="submit" />
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        rankings: Object.values(state.rankings),
        testCatalog: Object.values(state.testCatalog).map(test => test.testcode)
    }
}

export default connect(mapStateToProps, { getRankings, getTestCatalog, createCompetition })(CompetitionCreate);