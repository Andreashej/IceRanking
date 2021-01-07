import React from 'react';

import { Card } from 'primereact/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';

import riderService from '../../../services/rider.service';
import rankingListService from '../../../services/rankings.service';
import ProgressBar from '../../../components/Task/Progressbar';

class RankingImports extends React.Component {
    state = {
        activeForm: null,
        currentTask: "",
    }

    uploadHandler = (event) => {
        console.log(event);

        switch (this.state.activeForm) {
            case "riders":
                riderService.importAliases(event.files[0]).then((task) => {
                    console.log(task);
                    this.setState({activeForm: "processing", currentTask: task.id})
                });
            break;

            case "competitions":
                rankingListService.importCompetitions(this.props.match.params.shortname, event.files[0]).then((task) => {
                    console.log(task);
                    this.setState({activeForm: "processing", currentTask: task.id})
                });
            break;

            case "results":
                rankingListService.importResults(this.props.match.params.shortname, event.files[0]).then((task) => {
                    console.log(task);
                    this.setState({activeForm: "processing", currentTask: task.id})
                });
            break;
            
            default:
            break;
        }
    }

    renderForm = () => {
        switch (this.state.activeForm) {
            case "riders":
                return (
                    <>
                        <h3>Import riders</h3>
                        <FileUpload name="aliases" mode="basic" customUpload uploadHandler={this.uploadHandler} />
                    </>
                )

            case "competitions":
                return (
                    <>
                        <h3>Import competitions</h3>
                        <FileUpload name="competitions" mode="basic" customUpload uploadHandler={this.uploadHandler} />
                    </>
                )

            case "results":
                return (
                    <>
                        <h3>Import results</h3>
                        <FileUpload name="results" mode="basic" customUpload uploadHandler={this.uploadHandler} />
                    </>
                )

            case "processing":
                return (
                    <>
                    <h3>Processing file ...</h3>
                    {this.state.currentTask && <ProgressBar taskId={this.state.currentTask} onComplete={() => this.setState({ activeForm: null })} />}
                    </>
                )

            default:
                return;
        }
    }

    renderCard = (title, description, icon, buttonText, buttonAction) => {
        const header = (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "1rem",
                color: "#374785",
            }}>
                <FontAwesomeIcon icon={icon} style={{ fontSize: "8rem" }} />
            </div>);
        const footer = (
            <span>
                <Button label={buttonText} onClick={() => this.setState({activeForm: buttonAction})} className="p-button-primary" />
            </span>
        );
        return (
            <Card title={title} header={header} footer={footer}>
                {description}
            </Card>
        );
    }

    render = () => {
        return (
            <>
                <h2 className="subheader">What would you like to import?</h2>
                <div className="row pb-2">
                    <div className="col">
                        {this.renderCard("Riders", "Import a CSV with rider-aliases from IsiRank.", "user", "Import riders", "riders")}
                    </div>
                    <div className="col">
                        {this.renderCard("Competitions", "Import a CSV with competitions from IsiRank.", "calendar-alt", "Import competitions", "competitions")}
                    </div>
                    <div className="col">
                        {this.renderCard("Results", "Import a CSV with results from IsiRank.", "list-ol", "Import results", "results")}
                    </div>
                </div>
                {this.renderForm()}
            </>
        );
    }
}

export default RankingImports