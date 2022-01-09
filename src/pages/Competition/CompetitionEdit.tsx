import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { useCompetition } from '../../contexts/competition.context';

export const CompetitionEdit: React.FC = () => {
    const [competition, updateCompetition, saveCompetition] = useCompetition();
    
    if (!competition || !updateCompetition || !saveCompetition) return null;

    return (
        <>
        <div className="row">
            <div className="col">
                <h2 className="subtitle">Edit</h2>
            </div>
        </div>
        <form id="editCompetition" className="mt-4" onSubmit={e => {}}>
            <span className="p-float-label">
                <InputText 
                    id="competitionName" 
                    value={competition.name} 
                    onChange={(e) => {
                        updateCompetition({ name: e.target.value })
                    }} 
                    onBlur={() => saveCompetition()} 
                />
                <label htmlFor="competitionName">Competition Name</label>
            </span>
            <div className="form-row">
                <div className="col">
                    <span className="p-float-label">
                        <Calendar 
                            name="startdate" 
                            value={competition.firstDate} 
                            dateFormat="yy-mm-dd" 
                            style={{ width: '100%' }}
                            onChange={(e) => saveCompetition({
                                    ...competition,
                                    firstDate: e.value as Date
                                })
                            }
                        />
                        <label htmlFor="startdate">Start date</label>
                    </span>
                </div>
                <div className="col">
                    <span className="p-float-label">
                        <Calendar 
                            name="enddate" 
                            value={competition.lastDate} 
                            dateFormat="yy-mm-dd" 
                            onChange={(e) => saveCompetition({ 
                                ...competition, 
                                lastDate: e.value as Date
                            })} 
                            style={{ width: '100%' }} 
                        />
                        <label htmlFor="enddate">End date</label>
                    </span>
                </div>
            </div>
        </form>
    </>
    )
}