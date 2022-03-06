import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { ScreenGroup } from '../../models/screengroup.model';
import { useCompetition } from '../../contexts/competition.context';
import { createScreenGroup, deleteScreen, getScreen, getScreenGroups, getScreens, patchScreen, patchScreenGroup } from '../../services/v2/bigscreen.service';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { BigScreen } from '../../models/bigscreen.model';
import { useToast } from '../../contexts/toast.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputSwitch } from 'primereact/inputswitch';

type ScreenGroupProps = {
    screenGroup: ScreenGroup;
}

type ScreenProps = {
    screenId: BigScreen['id'];
}

const ScreenEditor: React.FC<ScreenProps> = ({screenId}) => {
    const [screen, setScreen] = useState<BigScreen>();
    const elementId = `screen-${screenId}`;

    useEffect(() => {
        getScreen(screenId).then((screen) => setScreen(screen));
    }, [screenId])

    const dragStart: React.DragEventHandler<HTMLDivElement> = (event) => {
        // const element = event.target as HTMLDivElement;

        // element.style.visibility = 'hidden';

        event.dataTransfer.setData("text", elementId);
    } 

    const dragEnd: React.DragEventHandler<HTMLDivElement> = (event) => {
        // event.preventDefault();
        // const element = event.target as HTMLDivElement;
        // element.style.visibility = 'visible';
    } 

    const toggleScreenRole = async () => {
        const patchedScreen = await patchScreen({id: screen?.id, role: screen?.role === 'overlay' ? 'default' : 'overlay' });

        console.log(patchedScreen);

        setScreen(patchedScreen);
    }

    const unClaim = async () => {
        if (!screen) return;

        await deleteScreen(screen);

        const element = document.getElementById(elementId)
        element?.remove();
    }

    if (!screen) return null;

    return (
        <div 
            id={elementId} 
            className={`screen-editor ${screen.role}`}
            draggable
            onDragStart={dragStart} 
            onDragEnd={dragEnd}
            data-screen-id={screen.id}
            data-screen-source-group={screen.screenGroupId}
        >
            <div className="actions">
                <button><FontAwesomeIcon icon="sync" onClick={toggleScreenRole} /></button>
                <button><FontAwesomeIcon icon="times" onClick={unClaim} /></button>
            </div>
            <div>
                ID: {screen.id}
            </div>
            <div>
                Role: {screen.role}
            </div>
        </div>
    )
}

const ScreenGroupEditor: React.FC<ScreenGroupProps> = ({screenGroup}) => {
    const [osd, setOsd] = useState<boolean>(screenGroup.showOsd);
    const showToast = useToast();

    useEffect(() => {
        patchScreenGroup({ id: screenGroup.id, showOsd: osd })
    }, [screenGroup.id, osd])

    const onDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();
    }

    const onDragEnter: React.DragEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault()
        const element = event.target as HTMLDivElement;

        element.classList.add("drag-target");
    }

    const onDragLeave: React.DragEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault()
        const element = event.target as HTMLDivElement;

        element.classList.remove("drag-target")
    }

    const onDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();

        const element = event.target as HTMLDivElement
        const draggedElementId = event.dataTransfer.getData("text")

        const draggedElement = document.getElementById(draggedElementId) as HTMLDivElement

        patchScreen({ id: parseInt(draggedElement.dataset.screenId as string), screenGroupId: screenGroup.id })
            .catch((err) => {
                showToast({
                    severity: 'error',
                    summary: "Failed to move screen",
                    detail: err as string
                });

                const sourceGroup = document.getElementById(`drag-target-${draggedElement.dataset.screenSourceGroup}`);
                sourceGroup?.appendChild(draggedElement);
            })
            .finally(() => {
                element.classList.remove("drag-target")
            });


        element.appendChild(draggedElement);
    }

    return (
        <div className='card screen-group-editor'>
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 className='mb-0'>{screenGroup.name} (ID: {screenGroup.id})</h3>
                <div className="d-flex align-items-center"><span className="mr-2">Show OSD</span><InputSwitch checked={osd} onChange={(e) => setOsd(e.value)} /></div>
            </div>
            <div 
                id={`drag-target-${screenGroup.id}`} 
                className='card-body screen-container' 
                style={{ display: "grid", minHeight: "6rem" }} 
                draggable={false}
                onDrop={onDrop} 
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
            >
                {screenGroup.screens?.map((screen) => <ScreenEditor key={screen.id} screenId={screen.id} />)}
            </div>
        </div>
    )
}

export const ScreenGroupSetup: React.FC = () => {
    const [competition] = useCompetition();
    const [screenGroups, setScreenGroups] = useState<ScreenGroup[]>([]);
    const [newScreenGroupName, setNewName] = useState<string>('');
    const [claimDialogShown, setClaimDialogShown] = useState<boolean>(false);
    const [unassignedScreens, setUnassignedScreens] = useState<BigScreen[]>([]);
    const showToast = useToast();

    const getScreenGroupsForCompetitions = useCallback(async () => {
        return getScreenGroups(new URLSearchParams({
            'filter[]': `competitionId == ${competition?.id}`,
            'expand': 'screens'
        }));
    }, [competition])

    useEffect(() => {
        if (!competition) return;

        
    }, [competition])

    useEffect(() => {
        getScreenGroupsForCompetitions().then(([sgs]) => setScreenGroups(sgs))
    }, [getScreenGroupsForCompetitions])

    useEffect(() => {
        if (!claimDialogShown) return;

        const params = new URLSearchParams({
            'filter[]': 'competitionId == null'
        })
        getScreens(params).then(([screens]) => setUnassignedScreens(screens));
    }, [claimDialogShown])

    const createNew = (e: FormEvent) => {
        e.preventDefault();

        if (!competition) return;

        createScreenGroup({ name: newScreenGroupName, competitionId: competition.id }).then((newGroup) => {
            setScreenGroups((prev) => {
                return [
                    ...prev as ScreenGroup[],
                    newGroup
                ]
            });
            setNewName("");
        })
    }

    const claim = async (screen: BigScreen): Promise<void> => {
        if (!competition) return;

        const elementRef = document.getElementById(`screen-claim-${screen.id}`);

        elementRef?.classList.add("claiming");

        try {
            await patchScreen({ id: screen.id, competitionId: competition.id});

            const [screenGroups] = await getScreenGroupsForCompetitions()
            setScreenGroups(screenGroups)

            elementRef?.classList.add("claimed");
        } catch (error) {
            showToast({
                'summary': "Could not claim screen",
                'detail': error as string,
                'severity': 'error'
            })
        } finally {
            elementRef?.classList.remove("claiming");
        }

    }

    return (
        <>
            <div className="grid-col-2">
                <h2 className="subtitle">Setup Screens</h2>
                <div style={{ textAlign: "right"}}>
                    <Button label='Claim screens' icon={PrimeIcons.DESKTOP} className="p-button-rounded p-button-raised p-button-success" onClick={() => setClaimDialogShown(true)} />
                </div>
            </div>
            {screenGroups.map((screenGroup) => <ScreenGroupEditor key={screenGroup.id} screenGroup={screenGroup} />)}
            <form onSubmit={createNew}>
                <div className="p-float-label">
                    <InputText id="new-group" value={newScreenGroupName} onChange={(e) => setNewName(e.target.value)} />
                    <label htmlFor="new-group">Screen Group name</label>
                </div>
                <Button label="Create" icon={PrimeIcons.PLUS} className="p-button-success p-button-rounded p-button-raised" />
            </form>
            <Dialog header="Claim screens" visible={claimDialogShown} onHide={() => setClaimDialogShown(false)} style={{width: "50%"}}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(100px, 1fr))", gap: ".5rem"}}>
                    {unassignedScreens.map((screen) => {
                        return <div 
                            key={screen.id}
                            id={`screen-claim-${screen.id}`} 
                            className="screen-editor add" 
                            onClick={() => claim(screen)}
                        >
                                <div className="loading"><ProgressSpinner style={{ width: "2.5rem", height: "2.5rem"}} /></div>
                                <div className='check'><FontAwesomeIcon icon="check-circle" /></div>
                            ID: {screen.id}
                        </div>
                    })}
                </div>
            </Dialog>
        </>
    )
}