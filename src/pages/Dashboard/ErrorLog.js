import { Button } from 'primereact/button'
import React from 'react'
import { Link } from 'react-router-dom'
import horseService from '../../services/v1/horse.service'
import logService from '../../services/v1/log.service'
import _ from 'lodash';

class ErrorLog extends React.Component {
    state = {
        horses: [],
        logs: {}
    }
    componentDidMount() {
        horseService.getHorses({
            filter: [
                'lookup_error eq 1'
            ]
        }).then( (horses) => {

            this.setState({
                horses: horses
            });

            horses.map( (horse) => {
                logService.getLog({
                    filter: [
                        `horse_id eq ${horse.id}`
                    ],
                    order_by: 'logged_at desc',
                    limit: 1
                }).then( (log) => {
                    if (log.length > 0)
                    this.setState({
                        logs: {
                            ...this.state.logs,
                            [horse.id]: log[0]
                        }
                    })
                });

                return horse;
            })
            }
        )
    }

    logAction(horseId, action) {
        switch(action) {
            case 'ACCEPT':
                horseService.updateHorse(horseId, { force_update: true });
                break;
            case 'REJECT':
                horseService.updateHorse(horseId, { ignore_wf_error: true })
                break;
        }

        this.setState((state) => {
            const logs = _.omit(state.logs, horseId);

            return {
                logs
            }
        });
    }

    renderLog() {
        return this.state.horses.map( (horse) => {
            const logItem = this.state.logs[horse.id];

            if (!logItem) {
                return null;
            }

            const tooltipOptions = {
                position: 'top'
            }

            return (
                <tr key={horse.id}>
                    <td>
                        {logItem.text}
                    </td>
                    <td>
                        <Link to={`/horse/${horse.id}`}>{horse.id}</Link>
                    </td>
                    <td>
                        <Button icon="pi pi-check" onClick={() => this.logAction(horse.id, 'ACCEPT')} className="p-button-rounded p-button-success p-button-text" tooltip="Accept change from Worldfengur" tooltipOptions={tooltipOptions} />
                        <Button icon="pi pi-times" onClick={() => this.logAction(horse.id, 'REJECT')} className="p-button-rounded p-button-danger p-button-text" tooltip="Keep horse as is" tooltipOptions={tooltipOptions} />
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <>
                <h2 className="subtitle">Lookup errors</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Error</th>
                            <th>Horse ID</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderLog()}
                    </tbody>
                </table>
            </>
        )
    }
}

export default ErrorLog