import { PrimeIcons } from 'primereact/api';
import { AutoComplete, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../../contexts/toast.context';
import { Competition } from '../../models/competition.model';
import { Person } from '../../models/person.model';
import { createCompetition } from '../../services/v2/competition.service';
import { getPersons } from '../../services/v2/person.service';
import { EmailDialog } from './EmailDialog';

type CompetitionSetupProps = {
    onCreated?: (competition: Competition) => void;
}

export const CompetitionSetup: React.FC<CompetitionSetupProps> = ({ onCreated }) => {
    const [competition, setCompetition] = useState<Partial<Competition>>({ name: "", country: 'DK' });
    const [personSuggestions, setPersonSuggestions] = useState<Person[]>([]);
    const [personSearchTerm, setPersonSearchTerm] = useState('');
    const [emailDialog, setEmailDialog] = useState(false);

    const showToast = useToast();

    const searchPersons = (event: AutoCompleteCompleteMethodParams) => {
        if (event.query.length === 0) {
            setPersonSuggestions([]);
            return;
        }

        const params = new URLSearchParams({
            'filter[]': `fullname like %${event.query}%`,
            'limit': '10'
        });
 
        getPersons(params).then(([persons]) => {
            setPersonSuggestions(persons);
        })
    }

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const newCompetition = await createCompetition(competition);
            onCreated?.(newCompetition);
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
                            country: e.target.value
                        }
                    })} />
                    <label htmlFor="country">Country</label>
                </span>
                <span className="p-float-label">
                    <AutoComplete 
                        itemTemplate={(person) => person.fullname}
                        suggestions={personSuggestions} 
                        completeMethod={searchPersons} 
                        value={personSearchTerm} 
                        onChange={(e) => setPersonSearchTerm(e.value)}
                        onSelect={(e) => {
                            setCompetition((prev) => {
                                return {
                                    ...prev,
                                    contactPersonId: e.value.id,
                                    contactPerson: e.value
                                }
                            })
                            setPersonSearchTerm(e.value.fullname)
                            if (!e.value.email) {
                                setEmailDialog(true);
                            }
                        }}
                        dropdown
                    />
                    <label htmlFor="contactPerson">Contact Person</label>
                </span>
                <Button label="Next" className="p-button-rounded p-button-raised p-button-info" icon={PrimeIcons.ARROW_RIGHT} iconPos="right" type="submit" />
            </form>
            {competition.contactPerson && <EmailDialog initialPerson={competition.contactPerson} show={emailDialog} onHide={() => setEmailDialog(false)} />}
        </>
    )
}