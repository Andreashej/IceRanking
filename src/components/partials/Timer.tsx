import React, { useEffect, useMemo, useRef, useState } from 'react';
import { zeroPad } from '../../tools';

type TimerProps = {
    endTime: Date;
    onTimerEnd?: () => void;
}

export const Timer: React.FC<TimerProps> = ({ endTime, onTimerEnd }) => {
    const interval = useRef<NodeJS.Timer>();
    const [secondsLeft, setSecondsLeft] = useState<number>(0);

    const deltaStart = useMemo(() => {
        const now = new Date();
        const delta = endTime.getTime() - now.getTime();
        return Math.floor(delta / 1000);
    }, [endTime])

    useEffect(() => {
        interval.current = setInterval(() => {
            const now = new Date();
            const delta = endTime.getTime() - now.getTime();
            
            if (delta <= 0 && interval.current) {
                clearInterval(interval.current)
                setSecondsLeft(0);
                if (delta > -500) onTimerEnd?.();
                return;
            }
            
            setSecondsLeft(Math.floor(delta / 1000));
        }, 500)
        
        return () => {
            if (interval.current) clearInterval(interval.current)
        }
    },[endTime, onTimerEnd]);

    const [minutes, seconds] = useMemo<[string, string]>(() => {
        return [
            zeroPad(Math.floor(Math.floor(secondsLeft / 60))),
            zeroPad(Math.floor(secondsLeft % 60))
        ]
    }, [secondsLeft])

    const strokeColor = useMemo(() => {
        if (secondsLeft < deltaStart / 3) return 'red';
        if (secondsLeft < deltaStart / 3 * 2) return 'yellow';
        return 'green';
    }, [secondsLeft, deltaStart])

    const strokeProgress = (deltaStart - secondsLeft) / deltaStart * 283;

    return(
        <div className="timer">
            <div className="time-left">
                <span className="digit">{minutes[0]}</span>
                <span className="digit">{minutes[1]}</span>
                <span className="divider">:</span>
                <span className="digit">{seconds[0]}</span>
                <span className="digit">{seconds[1]}</span>
            </div>
            <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g className="base-timer__circle">
                    <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45" />
                    <path
                        id="base-timer-path-remaining"
                        strokeDasharray={`${strokeProgress} 283`}
                        className={`base-timer__path-remaining ${strokeColor}`}
                        d="
                        M 50, 50
                        m -45, 0
                        a 45,45 0 1,0 90,0
                        a 45,45 0 1,0 -90,0
                        "
                  ></path>
                </g>
            </svg>
        </div>
    )
}