import React, { CSSProperties } from 'react';
import { Message } from 'primereact/message';
import { dateToString } from '../../tools';

import { Link } from 'react-router-dom';
import { Competition } from '../../models/competition.model';
import { ProgressSpinner } from 'primereact/progressspinner';

type EventListProps = {
    events?: Competition[];
    noEventsText?: string;
    style?: CSSProperties;
}

const EventList: React.FC<EventListProps> = ({events, noEventsText = "There are no events in the list.", style = {}}) => {

    if(!events) return <ProgressSpinner />;

    if (events.length < 1) {
        return (
            <Message severity="info" text={noEventsText} style={{width: "100%"}}></Message>
        )
    }

    const eventItems = events.map(event => {
        return (
            <li className="list-group-item" key={event.id}>
                <div className="row">
                    <div className="col">
                        <Link to={`/competition/${event.id}`}><h5>{event.name}</h5></Link>
                        <p className="text-muted mb-0">{dateToString(event.firstDate, 'd/m/Y')} - {dateToString(event.lastDate, 'd/m/Y')}</p>
                    </div>
                </div>
            </li>
        )
    });

    return (
        <ul className="list-group list-group-flush" style={style}>
            {eventItems}
        </ul>
    );
};

export default EventList;