import React from 'react';
import { Message } from 'primereact/message';

import { Link } from 'react-router-dom';

const EventList = ({events, noEventsText = "There are no events in the list.", style = {}}) => {

    if (events.length < 1) {
        return (
            <Message severity="info" text={noEventsText} style={{width: "100%"}}></Message>
        )
    }

    const eventItems = events.map(event => {
        const startdate = new Date(event.first_date);
        const enddate = new Date(event.last_date);

        return (
            <li className="list-group-item" key={event.id}>
                <div className="row">
                    <div className="col">
                        <Link to={`/competition/${event.id}`}><h5>{event.name}</h5></Link>
                        <p className="text-muted mb-0">{startdate.toLocaleDateString()} - {enddate.toLocaleDateString()}</p>
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