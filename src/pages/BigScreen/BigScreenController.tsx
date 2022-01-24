import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { io, Socket } from 'socket.io-client';
import { useFullscreen } from '../../App';
import { useCompetition } from '../../contexts/competition.context';
import useResizeObserver from '../../hooks/useResizeObserver';
import { ScreenGroup } from '../../models/screengroup.model';
import { getScreenGroup, getScreenGroups } from '../../services/v2/bigscreen.service';
import { cancellablePromise } from '../../tools/cancellablePromise';
import { BigScreenPage } from './BigScreen';

type ScreenGroupSwitchProps = {
    screenGroups: ScreenGroup[];
    activeScreenGroup?: ScreenGroup['id'];
    onSetActiveScreenGroup: (screenGroup: ScreenGroup) => void;
}

const ScreenGroupSwitch: React.FC<ScreenGroupSwitchProps> = ({screenGroups, activeScreenGroup, onSetActiveScreenGroup}) => {
    return (
        <div className="screen-group-switch">
            {screenGroups.map((screenGroup) => {
                return (
                    <button 
                        key={screenGroup.id}
                        className={screenGroup.id === activeScreenGroup ? 'active' : '' }
                        onClick={() => onSetActiveScreenGroup(screenGroup)}
                    >{screenGroup.id}</button>
                )
            })}
        </div>
    )
}

export const BigScreenController: React.FC = () => {
    const { screenGroupId } = useParams<{ screenGroupId: string }>();
    const [competition] = useCompetition();
    const [fullscreen, setFullscreen] = useFullscreen();
    const [screenGroup, setScreenGroup] = useState<ScreenGroup>();
    const [previewTemplate, setPreviewTemplate] = useState<ScreenGroup['template']>('default');
    const socket = useRef<Socket>();
    const history = useHistory();

    useEffect(() => {
        setFullscreen(true);

        socket.current = io(`${process.env.REACT_APP_API_URL}/bigscreen`);

        socket.current.on('ScreenGroup.SetPreview', (screenGroup: ScreenGroup) => {
            setPreviewTemplate(screenGroup.template);
        });

        return () => {
            setFullscreen(false);
            socket.current?.disconnect();
        }
    }, [setFullscreen])

    useEffect(() => {
        if (!fullscreen) return;

        getScreenGroup(parseInt(screenGroupId)).then((sg) => {
            socket.current?.emit('ScreenGroup.Joined', sg)
            socket.current?.emit('ScreenGroup.SetTemplate', sg);
            setScreenGroup(sg);
        });
    }, [screenGroupId, fullscreen]);

    const cut = () => {
        socket.current?.emit('ScreenGroup.SetTemplate', { ...screenGroup, template: previewTemplate});
    }

    return (
        <div className="bigscreen-controller">
            <Button
                style={{ position: "absolute", top: "2vmin", right: "2vmin" }}
                icon={PrimeIcons.TIMES} 
                onClick={() => history.push(`/competition/${competition?.id}`)} 
                className="p-button-text p-button-info"
             />
            <div className="displays">
                <div className="preview">
                    <BigScreenPage template={previewTemplate} embedded />
                    <span className="label">Preview</span>
                </div>
                <div className="program">
                    <BigScreenPage embedded parentSocket={socket.current} screenGroupId={parseInt(screenGroupId)} />
                    <span className="label">Program</span>
                </div>
                <button onClick={() => setPreviewTemplate('default')}>
                    <span className="label">Default</span>
                </button>
                <button onClick={() => setPreviewTemplate('collectingring')}>
                    <span className="label">Collecting Ring</span>
                </button>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className="controls">
                <div className="control-group">
                    {socket.current?.connected ? 'Connected' : 'Disconnected'}
                </div>
                <div className="control-group">
                    <button onClick={cut}>Cut</button>

                </div>
            </div>
        </div>
    )
}