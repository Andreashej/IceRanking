import React, { AnimationEventHandler, useEffect, useRef, useState } from 'react'
import { Timer } from '../../../components/partials/Timer';
import { useScreenContext } from '../BigScreen'
import { ProgressSpinner } from 'primereact/progressspinner';
import { StartListEntry } from '../../../models/startlist.model';
import { AnimatedFlatList } from './components/AnimatedFlatList';
import { FlatListItem } from '../../../components/partials/FlatList';
import { Test } from '../../../models/test.model';


const GroupItem: React.FC<FlatListItem<StartListEntry, Test>> = ({ item: startListEntry, show = true, onHidden, onShown }) => {

    const animationEnd: AnimationEventHandler<HTMLLIElement> = (event) => {
        if (event.animationName === 'scaleOut') {
            console.log("Hidden!");
            onHidden?.();
        }

        if (event.animationName === 'scaleIn') {
            onShown?.();
        }
    }

    return (
        <li className={`flatlist-item ${show ? 'show' : 'hide'}`} onAnimationEnd={animationEnd}>
            <div className={`row-content ${startListEntry.color}`}  style={{ gridTemplateColumns: "1fr" }}>
                <div className="row-marker" style={{ backgroundColor: `var(--${startListEntry.color})` }}></div>
                {startListEntry.rider?.fullname}
            </div>
        </li>
    )
}

const CollectingRingHeader: React.FC<{ startGroup?: number, test?: Test }> = ({ startGroup, test }) => {
    const headerText = startGroup ? 'Please go to Collecting Ring' : 'Waiting for next call';

    return (
        <>
            <div className="header-text">
                {test?.testName} - <small>{headerText}</small>
            </div>
        </>
    )
}

type CollectingRingTemplateProps = {
    currentGroup: StartListEntry[];
    test?: Test;
    endTime: Date;
}

export const CollectingRingTemplate: React.FC<CollectingRingTemplateProps> = ({ currentGroup, test, endTime }) => {
    const { socket, screenGroup, show, onTemplateHidden } = useScreenContext();
    const [groupOnCall, setGroupOnCall] = useState<StartListEntry[]>([]);
    const [nextGroupOnCall, setNextGroupOnCall] = useState<StartListEntry[]>([]);
    const [timerEnded, setTimerEnded] = useState<boolean>(false);
    const [listHidden, setListHidden] = useState<boolean>(true);
    const timeout = useRef<NodeJS.Timer>();
    const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => {
            clearInterval(interval)
        }
    }, [])

    useEffect(() => {
        if (timeout.current) clearTimeout(timeout.current);

        setGroupOnCall([]);
        setTimerEnded(true);
        setNextGroupOnCall([]);
        setListHidden(true)
    }, [test])

    useEffect(() => {
        if (timeout.current) clearTimeout(timeout.current);

        setNextGroupOnCall(currentGroup);
        setTimerEnded(false);

        return () => {
            if (timeout.current) clearTimeout(timeout.current);
        }
    }, [currentGroup, timeout])

    useEffect(() => {

        if (!timerEnded && listHidden && nextGroupOnCall.length > 0) {
            setGroupOnCall(nextGroupOnCall);
            setNextGroupOnCall([]);
            setListHidden(false);
        }

    }, [nextGroupOnCall, listHidden, groupOnCall, timerEnded])

    useEffect(() => {
        if (!show) onTemplateHidden?.();
    }, [show, onTemplateHidden])

    const onTimerEnd = () => {
        timeout.current = setTimeout(() => {
            setTimerEnded(true)
        }, 180000);
    }

    return (
        <>
            <div className="screen-header" style={{ gridArea: "header" }}>
                <div>
                    <small>{screenGroup?.competition?.name}</small>
                    <h2>Collecting Ring</h2>
                </div>
                <div className="clock">{time}</div>
            </div>
            <div className="countdown" style={{ gridArea: "timer"}}><Timer endTime={endTime} onTimerEnd={onTimerEnd} /></div>
            <div style={{ gridArea: "group" }}>
                <div className="header" style={{ marginBottom: ".5rem" }}>
                    <CollectingRingHeader test={test} startGroup={(groupOnCall.length > 0) && !timerEnded ? groupOnCall[0].startGroup : undefined} />
                </div>
                <AnimatedFlatList
                    items={groupOnCall} 
                    RenderComponent={GroupItem} 
                    itemsPerPage={10} 
                    onHidden={() => setListHidden(true)} 
                    parentShow={show && nextGroupOnCall.length === 0 && !timerEnded}
                />
            </div>
            {!socket?.connected && 
            <div className="connection-lost">
                <div>
                    <h2>Connection lost</h2>
                    <div><ProgressSpinner style={{ height: "1em", width: "1em" }} /><span>Reconnecting...</span></div>
                </div>
            </div>}
        </>
    )
}