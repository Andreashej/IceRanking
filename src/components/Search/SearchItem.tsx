import React, { useMemo } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SearchResult } from '../../models/searchresult.model';
import { dateToString } from '../../tools';

type ListItem = {
    icon: JSX.Element;
    primaryText: string;
    secondaryText: string;
}

type SearchItemProps = {
    searchResult: SearchResult
}

export const SearchItem: React.FC<SearchItemProps> = ({ searchResult }) => {

    const listItem = useMemo<ListItem>(() => {
        switch (searchResult.type) {
            case "RankingList":
                return {
                    icon: <FontAwesomeIcon icon="list-ol" size="2x" />,
                    primaryText: searchResult.rankingList?.listname ?? '',
                    secondaryText: searchResult.rankingList?.shortname ?? ''
                }
            case "Person":
                return {
                    icon: <FontAwesomeIcon icon="user" size="2x" />,
                    primaryText: searchResult.person?.fullname ?? '',
                    secondaryText: `${searchResult.person?.numberOfResults ?? ''} results`
                }
            case "Horse":
                return {
                    icon: <FontAwesomeIcon icon="horse-head" size="2x" />,
                    primaryText: searchResult.horse?.horseName ?? '',
                    secondaryText: `${searchResult.horse?.numberOfResults} results`
                }
            case "Competition":
                return {
                    icon: <FontAwesomeIcon icon="calendar-alt" size="2x" />,
                    primaryText: searchResult.competition?.name ?? '',
                    secondaryText: `${dateToString(searchResult.competition?.firstDate, 'd/m/Y')} - ${dateToString(searchResult.competition?.lastDate, 'd/m/Y')}`
                }
            default:
                return {
                    icon: <FontAwesomeIcon icon='question' size="2x" />,
                    primaryText: searchResult.searchString,
                    secondaryText: "Don't know how to get that one for you :("
                }
        }
    }, [searchResult]);

    return (
        <div className="row px-0 mx-0" style={{maxWidth: "100%"}}>
            <div className="col-1 d-flex justify-content-center align-items-center">
               {listItem.icon}
            </div>
            <div className="col">
                <span className="item-name">{listItem.primaryText}</span><br />
                <small className="text-muted">{listItem.secondaryText}</small>
            </div>
        </div>
    );
}