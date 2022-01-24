import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useFullscreen } from '../../App';
import useResizeObserver from '../../hooks/useResizeObserver';
import { BigScreen } from '../../models/bigscreen.model';
import { ScreenGroup } from '../../models/screengroup.model';
import { CollectingRingTemplate } from './templates/CollectingRingTemplate';
import { DefaultTemplate } from './templates/DefaultTemplate';

export type ScreenContext = {
    screen?: BigScreen;
    screenGroup?: ScreenGroup;
}

const ScreenContext = createContext<ScreenContext>({});

type BigScreenPageProps = {
    screenGroupId?: ScreenGroup['id'];
    template?: ScreenGroup['template'];
    embedded: boolean;
    parentSocket?: Socket;
}

export const BigScreenPage: React.FC<BigScreenPageProps> = ({ screenGroupId, template, embedded = false, parentSocket }) => {
    const socket = useRef<Socket>();
    const [screen, setScreen] = useState<BigScreen>();
    const [screenGroup, setScreenGroup] = useState<ScreenGroup>();
    const [_, setFullscreen] = useFullscreen();
    const screenRef = useRef<HTMLDivElement>(null);
    const { height } = useResizeObserver(screenRef);

    useEffect(() => {
        if (template) return; // If component template is controlled from parent, don't attach events!
        
        if (!embedded) setFullscreen(true);

        socket.current = parentSocket ?? io(`${process.env.REACT_APP_API_URL}/bigscreen`)

        
        socket.current.on('connect', () => {
            console.log('connected')
            if (!screenGroupId) {
                socket.current?.emit('Screen.Connected', { screenId: localStorage.getItem('bigscreenId') })
            }
        });

        socket.current.on('Screen.Created', (screen: BigScreen) => {
            if (screen.id) localStorage.setItem('bigscreenId', screen.id.toString());
            setScreen(screen);
        });
        
        socket.current.on('Screen.ScreenGroupChanged', (screenGroup: ScreenGroup) => {
            setScreenGroup(screenGroup);
        })

        socket.current.on('ScreenGroup.TemplateChanged', (template: string) => {
            setScreenGroup((prev) => {
                return {
                    ...prev as ScreenGroup,
                    template
                }
            });
        });

        return () => {
            if (!embedded) setFullscreen(false);
            if (!parentSocket) socket.current?.disconnect();
        }
    },[setFullscreen, template, embedded, parentSocket, screenGroupId])

    const renderTemplate = useMemo(() => {
        switch (screenGroup?.template ?? template) {
            case 'collectingring':
                return <CollectingRingTemplate />;
            default:
                return <DefaultTemplate />;
        }
    }, [screenGroup?.template, template])

    const size = embedded ? {} : { height: '100vh', width: '100vw'};

    return (
        <ScreenContext.Provider value={{ screen, screenGroup }}>
            <div className="bigscreen" style={{...size, fontSize: `${height}px`}} ref={screenRef}>
                {renderTemplate}
            </div>
        </ScreenContext.Provider>
    )
}

export const useScreenContext = (): ScreenContext => {
    const context = useContext(ScreenContext);

    if (context === undefined) {
        throw new Error('Missing ScreenContext');
    }

    return context;
}