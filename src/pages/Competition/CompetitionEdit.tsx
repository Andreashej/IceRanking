import { AutoComplete, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import React, { FormEvent, useState } from 'react';
import { useCompetition } from '../../contexts/competition.context';
import { useToast } from '../../contexts/toast.context';
import { Person } from '../../models/person.model';
import { getPersons } from '../../services/v2/person.service';
import { EmailDialog } from '../CompetitionCreate/EmailDialog';

export const CompetitionEdit: React.FC = () => {
    const [competition, updateCompetition, saveCompetition, isChanged] = useCompetition();
    const [personSearchTerm, setPersonSearchTerm] = useState(competition?.contactPerson?.fullname);
    const [emailDialog, setEmailDialog] = useState(false);
    const [personSuggestions, setPersonSuggestions] = useState<Person[]>([]);
    const showToast = useToast();
    
    if (!competition || !updateCompetition || !saveCompetition) return null;

    const submit = (e: FormEvent) => {
        e.preventDefault();
        saveCompetition()
    }

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

    const copyText = async () => {
        console.log("click")
        await navigator.clipboard.writeText(competition.extId);
        showToast({
            'severity': 'success',
            'summary': "External ID copied to clipboard!"
        })
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
                <SelectButton 
                    id="competitionState" 
                    value={competition.state} 
                    options={['PENDING', 'NORMAL', 'BLOCKED', 'CANCELLED', 'UNLISTED']}
                    onChange={(e) => {
                        updateCompetition({ state: e.target.value })
                    }}
                    className="mb-4"
                />
                <span className="p-float-label">
                    <AutoComplete 
                        itemTemplate={(person) => person.fullname}
                        suggestions={personSuggestions} 
                        completeMethod={searchPersons} 
                        value={personSearchTerm} 
                        onChange={(e) => setPersonSearchTerm(e.value)}
                        onSelect={(e) => {
                            updateCompetition({
                                contactPersonId: e.value.id,
                                contactPerson: e.value
                            });

                            setPersonSearchTerm(e.value.fullname);

                            if (!e.value.email) {
                                setEmailDialog(true);
                            }
                        }}
                        dropdown
                    />
                    <label htmlFor="contactPerson">Contact Person</label>
                </span>
                <Button type="submit" label="Save" className="p-button-success p-button-raised p-button-rounded" icon="pi pi-save" disabled={!isChanged} />
            </form>
            <div>
                <span className="p-float-label mt-4">
                    <InputText onClick={copyText} style={{ cursor: 'pointer', caretColor: 'transparent' }} id="extId" value={competition.extId} />
                    <label className='p-float-label'>External ID</label>
                    <p><small className="text-muted">Used by integrations to other systems, e.g. IcetestNG. Click to copy.</small></p>
                </span>
            </div>
            <EmailDialog show={emailDialog} onHide={() => setEmailDialog(false)} initialPerson={competition.contactPerson} />
        </>
    )
}