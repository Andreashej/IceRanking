import React, { FormEvent } from 'react';
import {InputText} from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { useRankingList } from '../../../contexts/rankinglist.context';

export const RankingListEdit: React.FC = () => {
    const [rankingList, update, save, isChanged] = useRankingList();

    const submit = (e: FormEvent) => {
        e.preventDefault();
        save?.();
    }

    return (
        <>
            <h2 className="subheader">Ranking options</h2>
            <form id="editRanking" onSubmit={submit}>
                <span className="p-float-label">
                    <InputText id="name" value={rankingList?.listname} onChange={(e) => update?.({ listname: e.target.value })} />
                    <label htmlFor="name">Listname</label>
                </span>
                <span className="p-float-label">
                    <InputText id="shortname" value={rankingList?.shortname} onChange={(e) => update?.({ shortname: e.target.value })} />
                    <label htmlFor="shortname">Shortname</label>
                </span>
                <span className="p-float-label">
                    <InputNumber id="shortname" value={rankingList?.resultsValidDays} onChange={(e) => update?.({ resultsValidDays: e.value })} prefix="Results are valid for " suffix=" days" style={{width: "20rem"}} />
                    <label htmlFor="shortname">Results valid for</label>
                </span>
                <Button type="submit" label="Save" className="p-button-success p-button-raised p-button-rounded" icon="pi pi-save" disabled={!isChanged} />
            </form>
        </>
    );
}