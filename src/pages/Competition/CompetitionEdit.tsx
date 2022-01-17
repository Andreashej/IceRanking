import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import React, { FormEvent } from 'react';
import { useCompetition } from '../../contexts/competition.context';

export const CompetitionEdit: React.FC = () => {
    const [competition, updateCompetition, saveCompetition, isChanged] = useCompetition();
    
    if (!competition || !updateCompetition || !saveCompetition) return null;

    const submit = (e: FormEvent) => {
        e.preventDefault();
        saveCompetition()
    }

    return (
        <>
            <h2 className="subtitle">Edit</h2>
            <form id="editCompetition" onSubmit={submit}>
                <span className="p-float-label">
                    <InputText 
                        id="competitionName" 
                        value={competition.name} 
                        onChange={(e) => {
                            updateCompetition({ name: e.target.value })
                        }} 
                    />
                    <label htmlFor="competitionName">Competition Name</label>
                </span>
                <div className="grid-col-2">
                    <span className="p-float-label">
                        <Calendar 
                            name="startdate" 
                            value={competition.firstDate} 
                            dateFormat="yy-mm-dd" 
                            style={{ width: '100%' }}
                            onChange={(e) => updateCompetition({
                                    firstDate: e.value as Date
                                })
                            }
                        />
                        <label htmlFor="startdate">Start date</label>
                    </span>
                    <span className="p-float-label">
                        <Calendar 
                            name="enddate" 
                            value={competition.lastDate} 
                            dateFormat="yy-mm-dd" 
                            onChange={(e) => updateCompetition({ 
                                lastDate: e.value as Date
                            })} 
                            style={{ width: '100%' }} 
                        />
                        <label htmlFor="enddate">End date</label>
                    </span>
                </div>
                <Button type="submit" label="Save" className="p-button-success p-button-raised p-button-rounded" icon="pi pi-save" disabled={!isChanged} />
            </form>
        </>
    )
}