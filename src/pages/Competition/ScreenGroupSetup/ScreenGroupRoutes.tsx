import { PrimeIcons } from 'primereact/api';
import { AutoComplete, AutoCompleteCompleteMethodParams } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useCompetition } from '../../../contexts/competition.context';
import { useToast } from '../../../contexts/toast.context';
import { BigScreenRoute } from '../../../models/bigscreen-route.model';
import { ScreenGroup } from '../../../models/screengroup.model';
import { Test } from '../../../models/test.model';
import { getScreenGroups, getScreenRoutes, patchScreenRoute, postScreenRoute } from '../../../services/v2/bigscreen.service';

type BigScreenRouteRowProps = {
    route: BigScreenRoute;
    screenGroups: ScreenGroup[];
    tests: Test[];
    onChange: (route: BigScreenRoute) => void;
}

const TEMPLATES = [
    'startlist',
    'resultlist',
    'groupinfo',
    'equipageinfo',
    'equipageresult',
    'collectingring',
    'sectionmarks',
]

const BigScreenRouteRow: React.FC<BigScreenRouteRowProps> = ({route: initialRoute, screenGroups, tests, onChange}) => {
    const [route, setRoute] = useState<BigScreenRoute>(initialRoute);
    const [testSuggestions, setTestSuggestions] = useState<Test[]>([]);
    const [templateSuggestions, setTemplateSuggestions] = useState<string[]>([]);

    const searchTests = (event: AutoCompleteCompleteMethodParams) => {
        const existing = route.tests?.map((test) => test.testName) ?? [];

        const filteredTests = tests.filter((test) =>  !existing.includes(test.testName) && test.testName.includes(event.query));

        setTestSuggestions(filteredTests);
    }

    const searchTemplates = (event: AutoCompleteCompleteMethodParams) => {
        const filteredTemplates = TEMPLATES.filter((template) =>  !route.templates.includes(template) && template.includes(event.query));

        setTemplateSuggestions(filteredTemplates);
    }

    useEffect(() => {
        onChange(route);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route])

    return (
        <tr>
            <td>
                <InputNumber 
                    min={100} 
                    max={999} 
                    size={3} 
                    value={route.priority} 
                    onChange={(e) => setRoute((prev) => {
                        return {
                            ...prev,
                            priority: e.value
                        }
                    })} 
                />
            </td>
            <td>
                <AutoComplete
                    multiple 
                    value={route.templates} 
                    onChange={(e) => setRoute((prev) => {
                        return {
                            ...prev,
                            templates: e.value
                        }
                    })}
                    style={{ height: "100%" }}
                    completeMethod={searchTemplates}
                    suggestions={templateSuggestions}
                    placeholder={route.templates.length === 0 ? "Any" : ""}
                />
            </td>
            <td>
                <AutoComplete 
                    multiple 
                    value={route.tests} 
                    field="testName" 
                    suggestions={testSuggestions} 
                    completeMethod={searchTests} 
                    onChange={(e) => setRoute((prev) => {
                        return {
                            ...prev,
                            tests: e.value
                        }
                    })}
                    placeholder={route.tests?.length === 0 ? "Any" : ""}
                />
            </td>
            <td>
                <Dropdown 
                    value={route.screenGroupId} 
                    options={screenGroups} 
                    itemTemplate={(sg) => sg.name} 
                    optionLabel="name" 
                    optionValue='id' 
                    onChange={(e) => setRoute((prev) => {
                        return {
                            ...prev,
                            screenGroupId: e.value
                        }
                    })} 
                    style={{ width: "max(10rem, 15vw)" }}
                />
            </td>
        </tr>
    )
}

export const ScreenGroupRoutes: React.FC = () => {
    const [competition] = useCompetition();
    const history = useHistory();
    const [routes, setRoutes] = useState<BigScreenRoute[]>([])
    const [screenGroups, setScreenGroups] = useState<ScreenGroup[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const showToast = useToast();

    useEffect(() => {
        if (competition == null) return;

        const params = new URLSearchParams({
            'order': 'priority asc',
            'expand': 'tests,screenGroup'
        })

        getScreenRoutes(competition, params)
            .then(([screenRoutes]) => {
                setRoutes(screenRoutes);
            })
        
        const sgParams = new URLSearchParams({
            'filter[]': `competitionId == ${competition.id}`
        })
        getScreenGroups(sgParams)
            .then(([sg]) => setScreenGroups(sg))
    }, [competition])

    const updateRoutes = (updatedRoute: BigScreenRoute) => {
        setRoutes((prev) => prev.map((route) => {
            if (route.id === updatedRoute.id) {
                return updatedRoute;
            }

            return route;
        }));
    }

    const addRoute = () => {
        if (!competition) return;

        const emptyRoute: BigScreenRoute = {
            id: Number.MAX_SAFE_INTEGER,
            priority: 100,
            screenGroupId: 0,
            competitionId: competition?.id,
            templates: [],
            tests: []
        }
        setRoutes((prev) => {
            return [
                ...prev,
                emptyRoute
            ]
        })
    }

    const save = async () => {
        if (!competition) return;

        setLoading(true);

        const promises = routes.map((route) => {
            if (route.id === Number.MAX_SAFE_INTEGER) {
                return postScreenRoute(competition, route)
            }

            return patchScreenRoute(competition, route);
        })

        try {
            const savedRoutes = await Promise.all(promises)
            setRoutes((prev) => {
                return prev.map((route) => {
                    const updatedRoute = savedRoutes.find((r) => r.id === route.id);

                    if (!updatedRoute) return route;

                    updatedRoute.tests = route.tests;

                    return updatedRoute;
                })
            });
            showToast({
                severity: 'success',
                summary: "Routes saved"
            })
        } catch (err) {
            showToast({
                severity: 'error',
                summary: "Could not save routes",
                detail: err as string
            });
        } finally {
            setLoading(false)
        }
    }

    return <>
        <h2 className="subtitle">Screen Group Routes</h2>
        <div>
            <Button 
                label="Back to screen group setup"
                icon={PrimeIcons.ARROW_LEFT}
                className="p-button-secondary p-button-text"
                onClick={() => {
                    history.push(`/competition/${competition?.id}/screengroups`)
                }}
            />
        </div>
        <p>Routes are applied top to bottom, first match is applied, ordered by priority in ascending order.</p>
        <table className='table' style={{ display: "block" }}>
            <thead>
                <tr>
                    <th>Priority</th>
                    <th>Templates</th>
                    <th>Tests</th>
                    <th style={{ whiteSpace: "nowrap" }}>Screen Group</th>
                </tr>
            </thead>
            <tbody>
                {routes.map((route) => <BigScreenRouteRow key={route.id} route={route} screenGroups={screenGroups} tests={competition?.tests ?? []} onChange={updateRoutes} />)}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={4}>
                        <Button 
                            label="Add route" 
                            className='p-button-rounded p-button-raised'
                            icon={PrimeIcons.PLUS}
                            onClick={addRoute}
                        />
                    </td>
                </tr>
            </tfoot>
        </table>
        <div>
            <Button
                label='Save'
                className='p-button-rounded p-button-success p-button-raised'
                icon={PrimeIcons.SAVE}
                onClick={save}
                disabled={loading}
            />
            {loading && <ProgressSpinner style={{ marginLeft: ".5rem", height: "2em", width: "2em" }} strokeWidth=".5rem" />}
        </div>
    </>
}