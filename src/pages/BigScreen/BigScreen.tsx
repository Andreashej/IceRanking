import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useFullscreen } from '../../App';
import { BigScreen } from '../../models/bigscreen.model';
import { Competition } from '../../models/competition.model';
import { ScreenGroup } from '../../models/screengroup.model';
import { CollectingRingTemplate } from './templates/CollectingRingTemplate';
import { CurrentEquipage } from './templates/CurrentEquipage';
import { CurrentGroup } from './templates/CurrentGroup';
import { Custom } from './templates/Custom';
import { DefaultTemplate } from './templates/DefaultTemplate';
import { ResultList } from './templates/ResultList';
import { SectionMarks } from './templates/SectionMarks';
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
            console.log(state.nextTemplate);
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
            document.body.classList.add(screen.role);
        }

        const onScreenGroupChanged = (screenGroup: ScreenGroup) => {
            setScreenGroup(screenGroup);
        }

        const onTemplateChanged = (template: TemplateProps) => {
            dispatch({
                type: 'setTemplate',
                payload: template
            })
        }

        const onHide = () => {
            dispatch({ type: 'hide' })
        };

        const onScreenUpdated = (screen: BigScreen) => {
            console.log(screen);
            document.body.classList.remove('overlay', 'default')
            document.body.classList.add(screen.role)
            setScreen(screen);
            setScreenGroup(screen.screenGroup);
        }
        
        socket.current.on('connect', onConnect);
        socket.current.on('Screen.Created', onScreenCreated);
        socket.current.on('Screen.Updated', onScreenUpdated);
        socket.current.on('Screen.ScreenGroupChanged', onScreenGroupChanged)
        socket.current.on('ScreenGroup.TemplateChanged', onTemplateChanged);
        socket.current.on('ScreenGroup.HideAll', onHide);
        socket.current.on('ScreenGroup.Updated', onScreenGroupChanged)

        return () => {
            socket.current?.off('connect', onConnect);
            socket.current?.off('Screen.Created', onScreenCreated);
            socket.current?.off('Screen.Updated', onScreenUpdated);
            socket.current?.off('Screen.ScreenGroupChanged', onScreenGroupChanged)
            socket.current?.off('ScreenGroup.TemplateChanged', onTemplateChanged);
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
                return (
                    <CollectingRingTemplate 
                        currentGroup={templateState.currentTemplate.templateData.group} 
                        test={templateState.currentTemplate.templateData.test} 
                        endTime={new Date(templateState.currentTemplate.templateData.endTime)} 
                    />
                );
            case 'startlist':
                return (
                    <StartList 
                        test={templateState.currentTemplate.templateData.test} 
                        startList={templateState.currentTemplate.templateData.startList} 
                        phase={templateState.currentTemplate.templateData.phase}
                    />
                );
            case 'resultlist':
                return (
                    <ResultList 
                        test={templateState.currentTemplate.templateData.test} 
                        results={templateState.currentTemplate.templateData.resultList} 
                        phase={templateState.currentTemplate.templateData.phase}
                    />
                );
            case 'groupinfo':
                return (
                    <CurrentGroup 
                        currentGroup={templateState.currentTemplate.templateData.group} 
                    />
                );
            case 'equipageinfo':
                return (
                    <CurrentEquipage 
                        test={templateState.currentTemplate.templateData.test} 
                        type='info' 
                        currentGroup={templateState.currentTemplate.templateData.group} 
                    />
                );
            case 'equipageresult':
                return (
                    <CurrentEquipage 
                        test={templateState.currentTemplate.templateData.test} 
                        type='result' 
                        currentGroup={templateState.currentTemplate.templateData.group} 
                    />
                );
            case 'sectionmarks':
                return (
                    <SectionMarks 
                        section={templateState.currentTemplate.templateData.section}
                        group={templateState.currentTemplate.templateData.group}
                    />
                )
            case 'custom':
                return (
                    <Custom 
                        title={templateState.currentTemplate.templateData.title} 
                        subtitle={templateState.currentTemplate.templateData.subtitle} 
                    />
                );
            
            default:
                return <DefaultTemplate />;
        }
    }, [templateState]);

    return (
        <ScreenContext.Provider value={{ 
            screen, 
            screenGroup, 
            socket: socket?.current, 
            competition: screenGroup?.competition, 
            onTemplateHidden,
            show: templateState.show
        }}>
            <div className={`template ${templateState.show ? 'show' : 'hide'} ${templateState.currentTemplate?.template}`} ref={screenRef}>
                {renderTemplate}
            </div>
            {screenGroup?.showOsd && <div className="osd">
                <div>Screen ID: {screen?.id}</div>
                <div>Screen Group: {screenGroup.name}</div>
            </div>}
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