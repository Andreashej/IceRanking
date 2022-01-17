import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useToast } from '../../contexts/toast.context';
import { Competition } from '../../models/competition.model';
import { createCompetition } from '../../services/v2/competition.service';

export const CompetitionSetup: React.FC = () => {
    const [competition, setCompetition] = useState<Partial<Competition>>({ name: "", country: 'DK' });
    const history = useHistory()

    const showToast = useToast();

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const newCompetition = await createCompetition(competition);
            history.push(`/competition/${newCompetition.id}/tests`);
        } catch (error: unknown) {
            if (typeof error === 'object') {
                const err = error as Record<string, string>;
                Object.keys(err).forEach((field) => {
                    document.getElementById(field)?.classList.add("p-invalid");
                })
            } else {
                showToast({
                    severity: 'error',
                    summary: "Could not create competition",
                    detail: error as string
                })
            }
        }
        
    }

    return (
        <>
            <h2 className="subtitle">Create competition</h2>
            <form name="createCompetition" onSubmit={submit}>
                <span className="p-float-label">
                    <InputText id="name" value={competition.name} onChange={(e) => setCompetition((prev) => {
                        return {
                            ...prev as Competition,
                            name: e.target.value
                        }
                    })} />
                    <label htmlFor="name">Competition name</label>
                </span>
                <div className="grid-col-2">
                    <span className="p-float-label">
                        <Calendar name="firstDate" value={competition.firstDate} dateFormat="yy-mm-dd" onChange={(e) => setCompetition((prev) => {
                            return {
                                ...prev as Competition,
                                firstDate: e.value as Date
                            }
                        })} style={{ width: '100%' }} />
                        <label htmlFor="firstDate">Start date</label>
                    </span>
                    <span className="p-float-label">
                        <Calendar name="lastDate" value={competition.lastDate} dateFormat="yy-mm-dd" onChange={(e) => setCompetition((prev) => {
                            return {
                                ...prev as Competition,
                                lastDate: e.value as Date,
                            }
                        })} style={{ width: '100%' }} />
                        <label htmlFor="lastDate">End date</label>
                    </span>
                </div>
                <span className="p-float-label">
                    <Dropdown options={[{ label: "Denmark", value: "DK" }]} id="country" value={competition.country} onChange={(e) => setCompetition((prev) => {
                        return {
                            ...prev as Competition,
                            name: e.target.value
                        }
                    })} />
                    <label htmlFor="country">Country</label>
                </span>
                <Button label="Next" className="p-button-rounded p-button-raised p-button-info" icon={PrimeIcons.ARROW_RIGHT} iconPos="right" type="submit" />
            </form>
        </>
    )
}