import React from 'react';
import { Message } from 'primereact/message';

const EventList = ({events, noEventsText = "There are no events in the list."}) => {

    if (events.length < 1) {
        return (
            <Message severity="info" text={noEventsText} style={{width: "100%"}}></Message>
        )
    }

    const eventItems = events.map(event => {
        return (
            <li className="list-group-item px-0" key={event.id}>
                {event.name}
            </li>
        )
    });

    return (
        <ul className="list-group list-group-flush">
            {eventItems}
        </ul>
    );
};

export default EventList;