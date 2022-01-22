import React, { FormEvent, ReactNode } from 'react';

type FormProps = {
    id: string;
    onSubmit: (e: FormEvent) => void;
    formElements: {
        label: string,
        input: ReactNode,
    }[]
    submitButton: ReactNode
}

export const Form: React.FC<FormProps> = ({ id, onSubmit, formElements, submitButton }) => {
    const elements = formElements.map((fe) => {
        return (
            <React.Fragment key={fe.label}>
                <div>{fe.label}</div>
                {fe.input}
            </React.Fragment>
        )
    })

    return (
        <form 
            id={id} 
            onSubmit={onSubmit} 
            style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', alignItems: 'center', gap: '1rem'}}
        >
            {elements}
            {submitButton}
        </form>
    )
}