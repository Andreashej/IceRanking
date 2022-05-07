import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from 'primereact/inputswitch';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useState } from 'react';
import { useCompetition } from '../../../contexts/competition.context';
import { useToast } from '../../../contexts/toast.context';
import { BigScreen } from '../../../models/bigscreen.model';
import { getScreens, patchScreen, patchScreenGroup, postScreen } from '../../../services/v2/bigscreen.service';
import { ScreenEditor } from './ScreenEditor';
import { ScreenGroupProps  } from './ScreenGroupSetup';

export const ScreenGroupEditor: React.FC<ScreenGroupProps> = ({ screenGroup }) => {
    const [competition] = useCompetition();
    const [osd, setOsd] = useState<boolean>(screenGroup.showOsd);
    const [screens, setScreens] = useState<BigScreen[]>(screenGroup.screens ?? []);
    const showToast = useToast();
    const [claimDialogShown, setClaimDialogShown] = useState<boolean>(false);
    const [unassignedScreens, setUnassignedScreens] = useState<BigScreen[]>([]);

    useEffect(() => {
        setScreens(screenGroup.screens ?? []);
    }, [screenGroup])

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

        console.log(draggedElementId);
        const addNewButton = document.querySelector(`#${element.id} .add-screen`)

        console.log(addNewButton);

        if (addNewButton) element.insertBefore(draggedElement, addNewButton);
        else element.appendChild(draggedElement);
    }

    const onScreenDelete = (deletedScreenId: number) => {
        setScreens((screens) => {
            return screens.filter((screen) => screen.id !== deletedScreenId);
        })
    }

    useEffect(() => {
        if (!claimDialogShown) return;

        const params = new URLSearchParams({
            'filter[]': 'competitionId == null'
        })
        getScreens(params).then(([screens]) => setUnassignedScreens(screens));
    }, [claimDialogShown])

    const claim = async (screen: BigScreen): Promise<void> => {
        if (!competition) return;

        const elementRef = document.getElementById(`screen-claim-${screen.id}`);

        elementRef?.classList.add("claiming");

        try {
            const updatedScreen = await patchScreen({ id: screen.id, competitionId: competition.id, screenGroupId: screenGroup.id});

            setScreens((prevScreens) => {
                const screensBefore = prevScreens.filter((s) => s.id < screen.id);
                const screensAfter = prevScreens.filter((s) => s.id > screen.id);
                
                return [
                    ...screensBefore,
                    updatedScreen,
                    ...screensAfter
                ]
            })

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
    
    const createScreen = async (): Promise<void> => {
        try {
            const newScreen = await postScreen({ screenGroupId: screenGroup.id });

            setScreens((prevScreens) => {
                const screensBefore = prevScreens.filter((s) => s.id < newScreen.id);
                const screensAfter = prevScreens.filter((s) => s.id > newScreen.id);
                
                return [
                    ...screensBefore,
                    newScreen,
                    ...screensAfter
                ]
            });

            setClaimDialogShown(false);
        } catch (error) {
            showToast({
                'summary': "Could not claim screen",
                'detail': error as string,
                'severity': 'error'
            });
        }
    }

    return (
        <>
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
                {screens?.map((screen) => <ScreenEditor key={screen.id} screenId={screen.id} onDelete={onScreenDelete} />)}
                <button className="screen-editor button add-screen" onClick={() => setClaimDialogShown(true)}>
                    <div className="content">
                        <FontAwesomeIcon className="icon" icon="plus" />
                    </div>
                </button>
            </div>
        </div>
        <Dialog header="Claim screens" visible={claimDialogShown} onHide={() => setClaimDialogShown(false)} style={{width: "50%"}}>
            <p>Click on one of the screens to add it or click the green plus to add a manual screen.</p>
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
                        <div className="content">
                            ID: {screen.id}
                        </div>
                    </div>
                })}
            </div>
            <Button 
                className="fab p-button-rounded p-button-raised p-button-success" 
                style={{ position: "absolute", bottom: ".5rem", right: ".5rem" }}
                onClick={createScreen}
            >
                <FontAwesomeIcon icon="plus" />
            </Button>
        </Dialog>
        </>
    )
}