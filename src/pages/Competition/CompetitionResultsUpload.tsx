import { Message } from 'primereact/message';
import React from 'react';
import CompetitionUpload from '../../components/Task/CompetionUpload';
import { useCompetition } from '../../contexts/competition.context';

export const CompetitionResultsUpload: React.FC = () => {
    const [competition] = useCompetition();

    return (
        <>
        <div className="row">
            <div className="col">
                <h2 className="subtitle">Upload results</h2>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <Message severity="warn" text="All current results will be deleted and replaced with the contents of the file" />
                <p>Expected filename: {competition?.extId}.txt</p>
                <div>
                    <CompetitionUpload competitionId={competition?.extId} onComplete={() => { 
                        // this.props.getCompetition(this.props.match.params.id)
                        window.location.reload();
                        }} />
                </div>
            </div>
        </div>
        </>
    )
}