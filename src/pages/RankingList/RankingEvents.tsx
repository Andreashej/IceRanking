import React, { useEffect, useState } from 'react';

import EventList from '../../components/partials/EventList';
import { useRankingList } from '../../contexts/rankinglist.context';

import { Competition } from '../../models/competition.model';
import { getCompetitions } from '../../services/v2/competition.service';
import { dateToString } from '../../tools';

export const RankingEvents: React.FC = () => {
    const [competitions, setCompetitions] = useState<Competition[]>();
    const [rankingList] = useRankingList();
    
    useEffect(() => {
        const fetchCompetitions = async () => {
            if (!rankingList) return;

            const params = new URLSearchParams({
                'filter[]': `include_in_ranking contains id == ${rankingList.id}`,
                'orderBy': 'firstDate asc'
            });
            params.append('filter[]', `firstDate > ${dateToString(new Date())}`)

            const [competitions] = await getCompetitions(params);

            setCompetitions(competitions);
        }
        
        fetchCompetitions();
    }, [rankingList])

    return (
        <>
            <h2 className="subtitle">Upcoming events</h2>
            <EventList events={competitions} noEventsText="There are no upcoming events registeret yet..." />
        </>
    )
}