import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { PrimeIcons } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { io, Socket } from 'socket.io-client';
import { useFullscreen } from '../../App';
import { useCompetition } from '../../contexts/competition.context';
import { ScreenGroup } from '../../models/screengroup.model';
import { getScreenGroup, patchScreenGroup } from '../../services/v2/bigscreen.service';
import { Chip } from 'primereact/chip';
import { TestProvider } from '../../contexts/test.context';
import { Test } from '../../models/test.model';
import { ProgressSpinner } from 'primereact/progressspinner';
import { StartListController } from './controller-templates/StartListController';
import { Link } from 'react-router-dom';
import { StartListEntry } from '../../models/startlist.model';
import { Result } from '../../models/result.model';
import { InputText } from 'primereact/inputtext';

type TemplateSelectorItemProps = { 
    value: string, 
    label: string, 
    icon: FontAwesomeIconProps['icon'], 
    // state: "preview" | "program" | "",
    // onClick?: (value: string) => void
}

const TemplateSelectorItem: React.FC<TemplateSelectorItemProps> = ({ value, label, icon }) => {
    const [state, dispatch] = useControllerState();

    const isProgram = state.programTemplate === value;
    const isPreview = state.previewTemplate === value;

    const templateState = (isProgram && 'program') || (isPreview && 'preview')

    const setPreview = () => {
        dispatch({ type: 'setPreviewTemplate', payload: value });
    }

    return (
        <button className={`template-btn ${templateState}`} onClick={setPreview}>
            <FontAwesomeIcon icon={icon} />
            <div>{label}</div>
        </button>
    )
}

type ReducerAction = {
    type: string;
    payload: any;
}

type Template = {
    name: string;
    value: string;
    icon: FontAwesomeIconProps['icon'];
}

export type TestEntry = {
    id: number;
    startListEntry: StartListEntry;
    result?: Result;
}

type ControllerState = {
    templates: Template[];
    testEntries: TestEntry[];
    previewTemplate: string | null;
    programTemplate: string | null;
    previewEntries: number[];
    programEntries: number[];
    customData: {
        title: string;
        subtitle: string;
    }
}

const controllerReducer = (state: ControllerState, action: ReducerAction): ControllerState => {
    switch(action.type) {
        case 'setPreviewTemplate':
            return {
                ...state,
                previewTemplate: action.payload
            }
        case 'setProgramTemplate':
            return {
                ...state,
                programTemplate: action.payload
            }
        case 'setStartList':
            const startListEntries = action.payload.map((startListItem: StartListEntry) => {
                return {
                    id: startListItem.id,
                    startListEntry: startListItem,
                    result: undefined
                }
            })
            return {
                ...state,
                testEntries: startListEntries
            }
        case 'setResults':
            const testEntries = state.testEntries.map(testEntry => {
                return {
                    id: testEntry.id,
                    startListEntry: testEntry.startListEntry,
                    result: action.payload.find((result: Result) => result.id === testEntry.id)
                }
            });

            return {
                ...state,
                testEntries: testEntries
            }

        case 'setPreviewGroup':
            const groupEntries = state.testEntries.filter(testEntry => testEntry.startListEntry.startGroup === action.payload).map(testEntry => testEntry.id)

            return {
                ...state,
                previewEntries: groupEntries
            }
        
        case 'setPreviewEntry':

            return {
                ...state,
                previewEntries: [action.payload]
            }
        
        case 'setCustomData':
            return {
                ...state,
                customData: action.payload
            }
        default:
            return state;
    }

}

const initialControllerState: ControllerState = {
    templates: [
        {
            name: "StartList",
            value: "startlist",
            icon: 'list-ul',
        },
        {
            name: "Group Info",
            value: "groupinfo",
            icon: 'address-card',
        },
        {
            name: "Equipage Info",
            value: "equipageinfo",
            icon: 'user',
        },
        {
            name: "Equipage Result",
            value: "equipageresult",
            icon: 'user',
        },
        {
            name: "Result List",
            value: "resultlist",
            icon: 'list-ol',
        },
        {
            name: "Collecting Ring",
            value: "collectingring",
            icon: 'bullhorn',
        },
        {
            name: "Custom",
            value: "custom",
            icon: 'pen',
        },
    ],
    testEntries: [],
    previewTemplate: null,
    programTemplate: null,
    previewEntries: [],
    programEntries: [],
    customData: {
        title: '',
        subtitle: '',
    }
}

const ControllerStateContext = createContext<{state: ControllerState, dispatch: React.Dispatch<ReducerAction>}>({
    state: initialControllerState, 
    dispatch: (action) => void {}
});

export const BigScreenController: React.FC = () => {
    const { screenGroupId } = useParams<{ screenGroupId: string }>();
    const [competition] = useCompetition();
    const [fullscreen, setFullscreen] = useFullscreen();
    const [screenGroup, setScreenGroup] = useState<ScreenGroup>();
    const [testId, setTestId] = useState<Test['id']>();
    const socket = useRef<Socket>();
    const [controllerState, dispatch] = useReducer(controllerReducer, initialControllerState);

    const cut = useCallback(() => {
        let templateData;

        switch(controllerState.previewTemplate) {
            case 'groupinfo':
            case 'equipageinfo':
                templateData = controllerState.testEntries.filter((testEntry) => controllerState.previewEntries.includes(testEntry.id)).map(testEntry => testEntry.startListEntry)
                break;
            case 'equipageresult':
                templateData = controllerState.testEntries.filter((testEntry => controllerState.previewEntries.includes(testEntry.id))).map((testEntry) => {
                    const result = testEntry.result
                    if (!result) return undefined;

                    result.rider = testEntry.startListEntry.rider;
                    result.horse = testEntry.startListEntry.horse;

                    return result;
                });
                break;
            case 'collectingring':
                templateData = {
                    currentGroup: controllerState.testEntries.filter((testEntry) => controllerState.previewEntries.includes(testEntry.id)).map(testEntry => testEntry.startListEntry),
                    endTime: new Date(Date.now() + 60000 * 3).toISOString()
                }
                break;
            case 'startlist':
                templateData = controllerState.testEntries.map((testEntry) => testEntry.startListEntry);
                break;
            case 'resultlist':
                templateData = controllerState.testEntries.map((testEntry) => {
                    const result = testEntry.result
                    if (!result) return undefined;

                    result.rider = testEntry.startListEntry.rider;
                    result.horse = testEntry.startListEntry.horse;

                    return result;
                }).filter(testEntry => testEntry !== undefined);
                break;
            case 'custom':
                templateData = controllerState.customData
                break;
        }

        socket.current?.emit('ScreenGroup.SetTemplate', { ...screenGroup, template: controllerState.previewTemplate, templateData});

        dispatch({ type: 'setProgramTemplate', payload: controllerState.previewTemplate });
    }, [controllerState, screenGroup])

    const hide = () => {
        socket.current?.emit('ScreenGroup.HideAll', screenGroup?.id);
    }

    const handleKeyEvent = useCallback((event: KeyboardEvent) => {
        console.log(event.key);
        switch (event.key) {
            case '1':
                dispatch({ type: 'setPreviewTemplate', payload: 'startlist' });
                break;
            case '2':
                dispatch({ type: 'setPreviewTemplate', payload: 'groupinfo' });
                break;
            case '3':
                dispatch({ type: 'setPreviewTemplate', payload: 'equipageinfo' });
                break;
            case '4':
                dispatch({ type: 'setPreviewTemplate', payload: 'equipageresult' });
                break;
            case '5':
                dispatch({ type: 'setPreviewTemplate', payload: 'resultlist' });
                break;
            case '6':
                dispatch({ type: 'setPreviewTemplate', payload: 'collectingring' });
                break;
            case 'Enter':
                cut();
                break;
        }
    
    }, [cut]);

    useEffect(() => {
        setFullscreen(true);

        socket.current = io(`${process.env.REACT_APP_API_URL}/bigscreen`);

        socket.current.on('ScreenGroup.TemplateChanged', ({template}) => {
            console.log("TemplateChanged", template);
            setScreenGroup((prev) => {
                return {
                    ...prev as ScreenGroup,
                    template: template
                }
            });
            dispatch({ type: 'setProgramTemplate', payload: template })
        });

        return () => {
            setFullscreen(false);
            socket.current?.disconnect();
        }
    }, [setFullscreen, handleKeyEvent])

    useEffect(() => {
        document.addEventListener('keyup', handleKeyEvent, false);

        return () => {
            document.removeEventListener('keyup', handleKeyEvent, false);
        }
    }, [handleKeyEvent])

    useEffect(() => {
        if (!fullscreen) return;

        getScreenGroup(parseInt(screenGroupId)).then((sg) => {
            socket.current?.emit('ScreenGroup.Joined', sg)
            setScreenGroup(sg);
            dispatch({ type: 'setProgramTemplate', payload: sg.template });
            setTestId(sg.testId);
        });
    }, [screenGroupId, fullscreen]);

    const changeScreenGroupTest = (testId: number) => {
        setTestId(testId)
        if (testId && screenGroup) {
                patchScreenGroup({...screenGroup, testId});
        }
    }

    const testOptions = competition?.tests.map((test) => {
        return {
            label: test.testName ?? test.testcode,
            value: test.id
        }
    })

    return (
        <ControllerStateContext.Provider value={{ state: controllerState, dispatch }}>
            <div className="bigscreen-controller">
                <div className="header">
                    <div className="left">
                        <img className="logo" src="/assets/img/iceranking_tiny_notext.png" alt="logo" />
                        <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Bigscreen Controller</span>
                    </div>
                    <div className="right">
                        <div>
                            <span>Select test:</span> <Dropdown id="current-test" options={testOptions} optionLabel="label" optionValue="value" value={testId} onChange={(e) => changeScreenGroupTest(e.value)} />
                        </div>
                        <div className="status">
                            <Chip 
                                icon={PrimeIcons.WIFI}
                                className={socket.current?.connected ? 'success' : 'error' }
                                label={socket.current?.connected ? 'Connected' : 'Disconnected'} />
                        </div>
                        <span>{competition?.name}</span>
                        <Link to={`/competition/${competition?.id}/screengroups`}>&times;</Link>
                    </div>
                </div>
                {testId && <TestProvider testId={testId}>
                    <div className="main">
                        <h1>{screenGroup?.name}</h1>
                            
                            <StartListController />
                        {!testId && <ProgressSpinner />}
                        {controllerState.previewTemplate === 'custom' && <div className="mt-4">
                            <div className="mt-4">
                                <span className="p-float-label">
                                    <InputText 
                                        value={controllerState.customData.title} 
                                        name="custom-title" 
                                        onChange={(event) => dispatch({ 
                                            type: 'setCustomData', 
                                            payload: { 
                                                title: event.target.value, 
                                                subtitle: controllerState.customData.subtitle 
                                            }
                                        })} />
                                    <label htmlFor="custom-title">Custom header</label>
                                </span>
                            </div>
                            <div className="mt-4">
                                <span className="p-float-label">
                                    <InputText 
                                        value={controllerState.customData.subtitle} 
                                        name="custom-title" 
                                        onChange={(event) => dispatch({ 
                                            type: 'setCustomData', 
                                            payload: { 
                                                title: controllerState.customData.title, 
                                                subtitle: event.target.value 
                                            }
                                    })} />
                                    <label htmlFor="custom-title">Custom subheader</label>
                                </span>
                            </div>
                        </div>}
                    </div>
                </TestProvider>}
                <div className="actions" style={{ gridArea: "actions" }}>
                    <div>
                        {controllerState.templates.map((template) => (
                            <TemplateSelectorItem 
                                key={template.value}
                                label={template.name} 
                                value={template.value} 
                                icon={template.icon as FontAwesomeIconProps['icon']} 
                            />
                        ))}
                    </div>
                    <div>
                        <button className="template-btn" onClick={hide}>Hide</button>
                        <button className="template-btn" onClick={cut}>Show</button>
                    </div>
                </div>
            </div>
        </ControllerStateContext.Provider>
    )
}

export const useControllerState = (): [ControllerState, React.Dispatch<ReducerAction>] => {
    const ctx = useContext(ControllerStateContext);

    if (ctx === undefined) {
        throw new Error("Missing ControllerState Provider");
    }

    return [ctx.state, ctx.dispatch];
}