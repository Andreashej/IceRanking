import React from 'react'

import Page from '../../components/partials/Page';

import { SelectButton } from 'primereact/selectbutton';

import taskService from '../../services/task.service';
import { ProgressBar } from 'primereact/progressbar';
import { ProgressSpinner } from 'primereact/progressspinner';

class Taskmanager extends React.Component {
    state = {
        filter: "",
        tasks: [],
        requestComplete: false
    }

    interval = null;

    componentDidMount() {
        this.setState({
            filter: "progress"
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.filter !== prevState.filter) {
            this.setState({ tasks: [], requestComplete: false });
            
            this.interval = setInterval(
                () => {
                    taskService.getTasks({
                    complete: 0
                }).then(tasks => {
                    this.setState({
                        tasks,
                        requestComplete: true
                    });

                    if (this.state.filter === 'COMPLETE' || this.state.tasks.length === 0) {
                        clearInterval(this.interval);
                    }
                })
            }, 2000);
        }
    }

    stateTemplate(rowData) {
        console.log(rowData);
        let cls;

        switch (rowData.state) {
            case "PROGRESS":
                cls = 'success';
            break;

            case "COMPLETE":
                cls = 'success';
            break;

            case "ERROR":
                cls = 'danger';
            break;

            default:
                cls = 'warning';
            break;

        }
        
        return <span className={`badge badge-pill badge-${cls}`} style={{ fontSize: "1rem" }}>{rowData.state}</span>;
    }
    
    render() {
        const filters = [
            { label: "In progress", value: "progress" },
            { label: "Not started yet", value: "waiting" },
            { label: "Done", value: "complete" },
            { label: "Error", value: "error" },
        ];

        const taskHtml = this.state.tasks.map(task => {
            return (
                <li class="list-group-item" key={task.id}>
                    <div class="row">
                        <div class="col">
                            {task.description}
                        </div>
                        <div class="col col-auto">
                            {this.stateTemplate(task)}
                        </div>
                        <div class="col-4">
                            <ProgressBar value={task.progress} color="#A8D0E6" style={{
                                borderRadius: 20,
                            }} />
                        </div>
                    </div>
                </li>
            )
        })

        return (
            <Page title="Task manager">
                <h2 className="subtitle">Tasks</h2>
                {/* <SelectButton value={this.state.filter} options={filters} onChange={(e) => this.setState({filter: e.value})} /> */}
                {this.state.tasks.length > 0 ? <ul class="list-group">
                    {taskHtml}
                </ul> : (!this.state.requestComplete && <ProgressSpinner />)}
            </Page>
        )
    }
}

export default Taskmanager;