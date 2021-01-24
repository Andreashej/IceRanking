import React from 'react';
import { dateToString } from '../../tools';
import competitionService from '../../services/competition.service';
import CompetitionUpload from '../../components/Task/CompetionUpload';

class CompetitionList extends React.Component {
    state = {
        competitions: [],
    }

    componentDidMount() {
        const today = new Date();
        
        competitionService.getCompetitions({
            noresults: 1,
            filter: [
                `last_date < ${dateToString(today)}`,
                'state eq NORMAL',
            ],
            order_by: 'last_date desc'
        }).then( (competitions) => {
            this.setState({
                competitions: competitions
            });
        });
    }

    renderCompetitions() {
        return this.state.competitions.map((competition) => {
            return (
                <li className="list-group-item container" key={competition.id}>
                    <div className="row">
                        <div className="col">
                            <p className="mb-0">{competition.name}</p>
                            <p className="text-muted mb-0">Filename: {competition.isirank_id}.txt</p>
                            </div>
                        <div className="col-4 text-right">
                            <CompetitionUpload competitionId={competition.isirank_id} />
                        </div>
                    </div>
                </li>
            );
        });
    }

    render() {
        return (
            <>
                <h2 className="subtitle">Competitions ready for results</h2>
                <ul className="list-group list-group-flush">
                    {this.renderCompetitions()}
                </ul>
            </>
        );
    }
}

export default CompetitionList;