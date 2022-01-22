import React, { useState } from 'react'
import { useHistory } from 'react-router';

import { AutoComplete, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete';

import { SearchItem } from './SearchItem';
import { Button } from 'primereact/button';
import { getSearchResults } from '../../services/v2/search.service';
import { SearchResult } from '../../models/searchresult.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { dateToString } from '../../tools';

type SearchBarProps = {
    show: boolean;
    onHide: () => void;
}

const buildLink = (searchResult: SearchResult) => {
    switch (searchResult.type) {
        case 'Competition':
            return `/competition/${searchResult.competition?.id}`;
        case 'Horse':
            return `/horse/${searchResult.horse?.id}`;
        case 'Person':
            return `/rider/${searchResult.person?.id}`;
        case 'RankingList':
            return `/rankinglist/${searchResult.rankingList?.shortname}`;
    }
}

export const SearchBar: React.FC<SearchBarProps> = ({show, onHide}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const history = useHistory();

    const search = async (event: AutoCompleteCompleteMethodParams) => {
        const params = new URLSearchParams({ 
            q: event.query,
            limit: '10', 
            expand: 'competition,person,horse,rankingList'
        });

        const [searchResults] = await getSearchResults(params);

        setSuggestions(searchResults.map((result) => {

            return {
                ...result,
                link: buildLink(result)
            }
        }));
    }

    return (
        <>
            <AutoComplete
                className={`${show ? 'show' : ''}`}
                placeholder="Search for rankings, horses, riders and competitions..." 
                scrollHeight={"50%"}
                minLength={3}
                itemTemplate={(suggestion) => <SearchItem searchResult={suggestion} />}
                suggestions={suggestions} 
                value={searchTerm} 
                completeMethod={search}
                onChange={(e) => setSearchTerm(e.value)} 
                onSelect={(e) => {
                    history.push(e.value.link);
                    setSearchTerm('');
                }}
            />
            <Button label="" icon="pi pi-times" className={`d-block d-md-none hide-search ${show ? 'show' : 'hide'}`} onClick={onHide}></Button>
        </>
    );
}