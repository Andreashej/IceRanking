import React from 'react';

const RankingCard = ({title, description, style}) => {
    return (
        <div className="card shadow" style={style}>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
            </div>
        </div>
    );
}

export default RankingCard;