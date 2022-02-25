import { STATUS_CODES } from 'http';
import { Button } from 'primereact/button';
import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, VoidFunctionComponent } from 'react';
import { io, Socket } from 'socket.io-client';
import { useFullscreen } from '../../App';
import useResizeObserver from '../../hooks/useResizeObserver';
import { BigScreen } from '../../models/bigscreen.model';
import { Competition } from '../../models/competition.model';
import { ScreenGroup } from '../../models/screengroup.model';
import { Test } from '../../models/test.model';
import { CollectingRingTemplate } from './templates/CollectingRingTemplate';
import { CurrentEquipage } from './templates/CurrentEquipage';
import { CurrentGroup } from './templates/CurrentGroup';
import { Custom } from './templates/Custom';
import { DefaultTemplate } from './templates/DefaultTemplate';
import { ResultList } from './templates/ResultList';
import { StartList } from './templates/StartList';

type ReducerAction = {
    type: string;
    payload?: TemplateProps;
}

type TemplateProps = {
    template: string;
    templateData: any | null;
}

type TemplateState = {
    nextTemplate?: TemplateProps;
    currentTemplate?: TemplateProps;
    show: boolean
}

const initialTemplateState = { 
    nextTemplate: undefined,
    currentTemplate: {
        template: 'default', 
        templateData: null,
    },
    show: true
}

const templateReducer = (state: TemplateState, action: ReducerAction) => {
    console.log(state, action);
    switch(action.type) {
        case 'setTemplate':
            if (state.currentTemplate) {
                return {
                    ...state,
                    nextTemplate: action.payload,
                    show: false
                };
            } else {
                return {
                    ...state,
                    currentTemplate: action.payload,
                    show: true,
                }
            }
        case 'swapTemplates':
            return {
                ...state,
                currentTemplate: state.nextTemplate,
                nextTemplate: undefined,
                show: true
            }
        case 'hide':
            return {
                ...state,
                show: false
            }
        case 'show':
            return {
                ...state,
                show: true
            }
        default:
            return initialTemplateState;
    }
}

export type ScreenContext = {
    screen?: BigScreen;
    screenGroup?: ScreenGroup;
    competition?: Competition;
    test?: Test;
    socket?: Socket;
    onTemplateHidden?: () => void;
    show?: boolean;
}

const ScreenContext = createContext<ScreenContext>({});

type BigScreenPageProps = {
    screenGroupId?: ScreenGroup['id'];
}

export const BigScreenPage: React.FC<BigScreenPageProps> = ({ screenGroupId }) => {
    const socket = useRef<Socket>();
    const [screen, setScreen] = useState<BigScreen>();
    const [screenGroup, setScreenGroup] = useState<ScreenGroup>();
    // const [nextScreenGroup, setNextScreenGroup] = useState<ScreenGroup>();
    const [_, setFullscreen] = useFullscreen();
    const screenRef = useRef<HTMLDivElement>(null);
    const [templateState, dispatch] = useReducer(templateReducer, initialTemplateState)

    useEffect(() => {
        setFullscreen(true);
        document.documentElement.classList.add("bigscreen");
        socket.current = io(`${process.env.REACT_APP_API_URL}/bigscreen`);

        return () => {
            socket.current?.disconnect();
            setFullscreen(false);
            document.documentElement.classList.remove("bigscreen");
        }
    }, [setFullscreen])

    useEffect(() => {
        if(!socket.current) return;

        const onConnect = () => {
            console.log('connected')
            if (!screenGroupId) {
                socket.current?.emit('Screen.Connected', { screenId: localStorage.getItem('bigscreenId') })
            }
        }

        const onScreenCreated = (screen: BigScreen) => {
            if (screen.id) localStorage.setItem('bigscreenId', screen.id.toString());
            setScreen(screen);
        }

        const onScreenGroupChanged = (screenGroup: ScreenGroup) => {
            console.log(screenGroup)
            setScreenGroup(screenGroup);
        }

        const onTemplateChanged = (template: TemplateProps) => {
            dispatch({
                type: 'setTemplate',
                payload: template
            })
        }

        const onTestChanged = (test: Test) => {
            setScreenGroup({
                ...screenGroup as ScreenGroup,
                test
            });
        };

        const onHide = () => {
            dispatch({ type: 'hide' })
        };
        
        socket.current.on('connect', onConnect);
        socket.current.on('Screen.Created', onScreenCreated);
        socket.current.on('Screen.ScreenGroupChanged', onScreenGroupChanged)
        socket.current.on('ScreenGroup.TemplateChanged', onTemplateChanged);
        socket.current.on('ScreenGroup.TestChanged', onTestChanged);
        socket.current.on('ScreenGroup.HideAll', onHide);

        return () => {
            socket.current?.off('connect', onConnect);
            socket.current?.off('Screen.Created', onScreenCreated);
            socket.current?.off('Screen.ScreenGroupChanged', onScreenGroupChanged)
            socket.current?.off('ScreenGroup.TemplateChanged', onTemplateChanged);
            socket.current?.off('ScreenGroup.TestChanged', onTestChanged);
            socket.current?.off('ScreenGroup.HideAll', onHide);
        }
    },[setFullscreen, screenGroupId, screenGroup, templateState.currentTemplate])


    const onTemplateHidden = () => {
        if (templateState.nextTemplate) {
            setTimeout(() => {
                dispatch({ type: 'swapTemplates' })
            }, 500)
        }
    };

    const renderTemplate = useMemo(() => {
        switch (templateState.currentTemplate?.template) {
            case 'collectingring':
                return <CollectingRingTemplate currentGroup={templateState.currentTemplate.templateData.currentGroup} test={screenGroup?.test} endTime={new Date(templateState.currentTemplate.templateData.endTime)} />;
            case 'startlist':
                return <StartList startList={templateState.currentTemplate.templateData} />;
            case 'resultlist':
                return <ResultList results={templateState.currentTemplate.templateData} />;
            case 'groupinfo':
                return <CurrentGroup currentGroup={templateState.currentTemplate.templateData} />;
            case 'equipageinfo':
                return <CurrentEquipage type='info' currentGroup={templateState.currentTemplate.templateData} />;
            case 'equipageresult':
                return <CurrentEquipage type='result' currentGroup={templateState.currentTemplate.templateData} />;
            case 'custom':
                return <Custom title={templateState.currentTemplate.templateData.title} subtitle={templateState.currentTemplate.templateData.subtitle} />
            
            default:
                return <DefaultTemplate />;
        }
    }, [templateState, screenGroup?.test]);

    return (
        <ScreenContext.Provider value={{ 
            screen, 
            screenGroup, 
            socket: socket?.current, 
            competition: screenGroup?.competition, 
            test: screenGroup?.test,
            onTemplateHidden,
            show: templateState.show
        }}>
            <div className={`template ${templateState.show ? 'show' : 'hide'} ${templateState.currentTemplate?.template}`} ref={screenRef}>
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