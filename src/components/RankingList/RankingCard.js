import React from 'react';

import { Card } from 'primereact/card';

const RankingCard = ({ranking, style}) => {
    const header = (
        <img src="https://via.placeholder.com/300x150" alt={`${ranking.listname}`} style={{borderTopLeftRadius: ".5rem", borderTopRightRadius: ".5rem"}} />
    );
    
    return (
        <Card title={ranking.shortname} subTitle={ranking.listname} style={{borderRadius: ".5rem"}} header={header}>
        </Card>
    );
}

export default RankingCard;