import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { ScreenGroup } from '../../models/screengroup.model';
import { useCompetition } from '../../contexts/competition.context';
import { createScreenGroup, getScreenGroups, patchScreen } from '../../services/v2/bigscreen.service';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { BigScreen } from '../../models/bigscreen.model';
import { Tree, TreeDragDropParams, TreeNodeTemplateType } from 'primereact/tree';
import TreeNode from 'primereact/treenode';
import { useToast } from '../../contexts/toast.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useHistory } from 'react-router-dom';

export const ScreenGroupSetup: React.FC = () => {
    const [competition] = useCompetition();
    const [screenGroups, setScreenGroups] = useState<ScreenGroup[]>([]);
    const [newScreenGroupName, setNewName] = useState<string>('');
    const showToast = useToast();
    const history = useHistory();

    const getScreenGroupsForCompetitions = useCallback(async () => {
        return getScreenGroups(new URLSearchParams({
            'filter[]': `competitionId == ${competition?.id}`,
            'expand': 'screens'
        }));
    }, [competition])

    useEffect(() => {
        getScreenGroupsForCompetitions().then(([sgs]) => setScreenGroups(sgs));
    }, [getScreenGroupsForCompetitions])

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

    const screenGroupTreeItems = screenGroups.map<TreeNode>((sg) => {
        return {
            key: sg.id,
            label: sg.name,
            droppable: true,
            icon: 'tachometer-alt',
            className: "screen-group",
            children: sg.screens?.map<TreeNode>((s) => {
                return {
                    key: s.id !== null ? s.id : 0,
                    label: `Screen ID: ${s.id.toString()}`,
                    droppable: false,
                    draggable: true,
                    icon: 'desktop'
                }
            })
        }
    });

    const screenTreeNode: TreeNodeTemplateType = (node, options) => {
        
        return (
            <div className={options.className} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: "flex", alignItems: 'center' }}>
                    {node.icon && <FontAwesomeIcon icon={node.icon as IconProp} style={{ height: "2em", width: "2em", marginRight: ".5rem" }} />}
                    <span>{node.label}</span>
                </div>
                {node.className?.includes('screen-group') && <div>
                    <Button className="p-button-text p-button-info" icon={PrimeIcons.EXTERNAL_LINK} label="Open Control Panel" onClick={() => {
                        history.push(`/competition/1452/bigscreencontroller/${node.key}`)
                    }} />
                </div>}
            </div>
        )
    }

    const changeScreenGroup = (event: TreeDragDropParams) => {
        if (!event.dragNode.key || !event.dropNode.key) return;

        const screenToUpdate: Partial<BigScreen> = { id: event.dragNode.key as number, screenGroupId: event.dropNode.key as number };

        patchScreen(screenToUpdate).then((updatedScreen) => {
            showToast({
                severity: 'success',
                summary: "Screen Group Changed",
                detail: `Screen ${updatedScreen.id} was moved to group ${screenGroups[event.dropIndex].name}`
            });
            getScreenGroupsForCompetitions().then(([sgs]) => setScreenGroups(sgs));
        }).catch((err) => {
            showToast({
                severity: 'error',
                summary: "Failed to move screen",
                detail: err as string
            })
        });
    }

    return (
        <>
            <h2 className="subtitle">Setup Screens</h2>
            <Tree 
                value={screenGroupTreeItems} 
                dragdropScope="screenGroups" 
                onDragDrop={changeScreenGroup}
                nodeTemplate={screenTreeNode} 
            />
            <form onSubmit={createNew}>
                <div className="p-float-label">
                    <InputText id="new-group" value={newScreenGroupName} onChange={(e) => setNewName(e.target.value)} />
                    <label htmlFor="new-group">Screen Group name</label>
                </div>
                <Button label="Create" icon={PrimeIcons.PLUS} className="p-button-success p-button-rounded p-button-raised" />
            </form>
        </>
    )
}