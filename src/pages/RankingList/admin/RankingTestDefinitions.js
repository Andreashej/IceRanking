import React from 'react';
import { connect } from 'react-redux';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

import { getRanking, updateRankingTest, getProfile, getRankingTests, createRankingTest, setCurrentPage } from '../../../actions';

class RankingTestDefinitions extends React.Component {
    state = {
        tests: {},
        editClone: null
    }

    componentDidMount() {
        this.props.getProfile().then(()=>{
            if (!this.props.user) {
                this.props.history.push(`/rankings/${this.props.match.params.shortname}`);            
            }
        });

        this.props.getRankingTests(this.props.match.params.shortname).then(() => {
            this.setState({
                tests: this.props.ranking.tests
            })
        });

        this.props.setCurrentPage(this.props.location.pathname);
    }

    textEditor(props, field) {
        return <InputText value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(props, e.target.value)} />
    }

    dropdownEditor(props, field, options) {
        return <Dropdown value={props.rowData[field]} options={options} onChange={(e) => this.onEditorValueChange(props, e.value)} />
    }

    numberEditor(props, field, decimals) {
        return <InputNumber value={props.rowData[field]} mode="decimal" minFractionDigits={decimals} onChange={(e) => this.onEditorValueChange(props, e.value)} />
    }

    getGroupingOptions() {
        return [
            {
                label: "Rider",
                value: "rider"
            },
            {
                label: "Horse",
                value: "horse"
            }
        ]
    }

    getOrderingOptions() {
        return [
            {
                label: "Ascending",
                value: "asc"
            },
            {
                label: "Descending",
                value: "desc"
            }
        ]
    }

    getTypeOptions() {
        return [
            {
                label: "Mark",
                value: "mark"
            },
            {
                label: "Time",
                value: "time"
            }
        ]
    }

    onRowEdit(event) {
        this.setState({
            editClone: event.data
        })
    }

    onRowSave(event) {
        let test = this.state.editClone;

        if (test.action === 'create') {
            this.props.createRankingTest(this.props.match.params.shortname, test);
            delete test.action;

            let tests = this.state.tests;
            delete tests.new;

            this.setState({
                tests: {
                    ...tests,
                    test
                }
            });
        } else {
            this.props.updateRankingTest(event.data.id, test);
        }

        this.setState({
            editClone: null
        });
    }

    onRowEditCancel(event) {
        this.setState({
            editClone: null
        });
    }

    onEditorValueChange(props, value) {
        let test = this.state.editClone;
        test[props.field] = value;

        this.setState({
            editClone: test
        });
    }

    addNew() {
        const newTest = {
            action: 'create',
            testcode: '',
        }
        this.setState({
            tests: {
                ...this.state.tests,
                new: newTest
            },
        });
    }

    render() {
        if (this.props.ranking) {
            return (
                <>
                    <h2 className="subheader">Test definitions</h2>
                    <DataTable className="table" value={Object.values(this.state.tests)} editMode="row" onRowEditInit={(e) => this.onRowEdit(e)} onRowEditSave={(e) => this.onRowSave(e)} onRowEditCancel={(e) => this.onRowEditCancel(e)}>
                        <Column rowEditor={true} style={{'width': '70px', 'textAlign': 'center'}}></Column>
                        <Column field="testcode" header="Testcode" editor={props => this.textEditor(props, 'testcode')}></Column>
                        <Column field="grouping" header="Grouping" editor={props => this.dropdownEditor(props, 'grouping', this.getGroupingOptions())}></Column>
                        <Column field="order" header="Ordering" editor={props => this.dropdownEditor(props, 'order', this.getOrderingOptions())}></Column>
                        <Column field="min_mark" header="Minimum mark" className="number" editor={props => this.numberEditor(props, 'min_mark', 2)}></Column>
                        <Column field="mark_type" header="Type" editor={props => this.dropdownEditor(props, 'mark_type', this.getTypeOptions())}></Column>
                        <Column field="included_marks" header="Required marks" className="number" editor={props => this.numberEditor(props, 'included_marks', 0)}></Column>
                        <Column field="rounding_precision" header="Rounding precision" className="number" editor={props => this.numberEditor(props, 'rounding_precision', 0)}></Column>
                    </DataTable>
                    <Button label="Add new test" className="p-button-raised p-button-rounded mt-2" icon="pi pi-plus" onClick={() => this.addNew()}/>
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
}

export default connect(mapStateToProps, { getRanking, updateRankingTest, getProfile, getRankingTests, createRankingTest, setCurrentPage })(RankingTestDefinitions);