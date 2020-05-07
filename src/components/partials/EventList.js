import React from 'react';
import Alert from './Alert';

const EventList = ({events}) => {

    if (events.length < 1) {
        return (
            <Alert type="primary" className="py-2">
                There are no events in the list.
            </Alert>
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