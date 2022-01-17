import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useCompetitionContext, useTest } from '../../contexts/competition.context';
import { useToast } from '../../contexts/toast.context';
import { Test } from '../../models/test.model';
import { patchTest } from '../../services/v2/test.service';

export const TestEdit: React.FC = () => {
    const { resource: competition, fetch: fetchCompetition } = useCompetitionContext();
    const showToast = useToast();
    const { testcode } = useParams<{ testcode: string; }>()
    const history = useHistory();
    
    const initialTest = useTest(testcode);

    const [test, setTest] = useState<Partial<Test>>(initialTest ?? { });

    useEffect(() => {
        if (!testcode) setTest({
            testcode: "",
            order: 'asc',
            markType: 'mark',
            roundingPrecision: 2,
        });
    }, [testcode])

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (test) {
            try {
                if (test.id) {
                    const updated = await patchTest(test as Test);
                    
                    fetchCompetition();
                }


                showToast({
                    severity: 'success',
                    summary: 'Ranking saved'
                });

                if (test.testcode !== testcode) history.push(`/competition/${competition?.id}/test/${test.testcode}/edit`)
            } catch (error: unknown) {
                if (typeof error === 'string') {
                    showToast({
                        severity: 'error',
                        summary: 'Error',
                        detail: error
                    });
                }
            }

        }
    }

    const isNew = test?.id === undefined;

    const header = isNew ? 'Create test' : `Edit test: ${test?.testcode}`;

    return (
        <>
            <h2 className="subheader">{header}</h2>
           {!isNew &&  <div>
                <Button 
                    label="Back to test"
                    icon={PrimeIcons.ARROW_LEFT}
                    className="p-button-secondary p-button-text"
                    onClick={() => {
                        history.push(`/competition/${competition?.id}/test/${testcode}`)
                    }}
                />
            </div>}
            <form id="editTest" onSubmit={submit}>
            <div className="p-inputgroup mb-2">
                    <span className="p-inputgroup-addon">Testcode</span>
                    <InputText id="testcode" value={test?.testcode} onChange={(e) => setTest((prev) => {
                        return {
                            ...prev as Test,
                            testcode: e.target.value
                        }
                    })} />
                </div>
                <div className="p-inputgroup mb-2">
                    <span className="p-inputgroup-addon">Ordering</span>
                    <SelectButton
                        id="order"
                        value={test?.order}
                        options={[
                            {
                                label: "Descending",
                                value: "desc"
                            },
                            {
                                label: "Ascending",
                                value: "asc"
                            },
                        ]}
                        onChange={(e) => setTest((prev) => {
                            return {
                                ...prev as Test,
                                order: e.value
                            }
                        })}
                    />
                </div>
                <div className="p-inputgroup mb-2">
                    <span className="p-inputgroup-addon">Mark type</span>
                    <SelectButton
                        id="marktype"
                        value={test?.markType}
                        options={[
                            {
                                label: "Mark",
                                value: "mark"
                            },
                            {
                                label: "Time",
                                value: "time"
                            },
                        ]}
                        onChange={(e) => setTest((prev) => {
                            return {
                                ...prev as Test,
                                markType: e.value
                            }
                        })}
                    />
                </div>
                <div className="p-inputgroup mb-2">
                    <span className="p-inputgroup-addon">Rounding precision</span>
                    <InputNumber
                        value={test?.roundingPrecision}
                        onChange={(e) => setTest((prev) => {
                            return {
                                ...prev as Test,
                                roundingPrecision: e.value
                            }
                        })}
                    />
                </div>
                <Button type="submit" label={test?.id ? 'Save' : 'Create'} className="p-button-success p-button-raised p-button-rounded" icon="pi pi-save" />
            </form>
        </>
    )
}