import { Toast, ToastMessageType } from "primereact/toast";
import { createContext, useContext, useRef } from "react";
import React from 'react';

interface ToastContext {
    show: (message: ToastMessageType) => void
}

const ToastContext = createContext<ToastContext | undefined>(undefined);

export const ToastProvider: React.FC = ({ children }) => {
    const ref = useRef<Toast>(null);

    const show = (message: ToastMessageType) => {
        ref?.current?.show(message);
    }

    return (
        <ToastContext.Provider value={{show}}>
            <Toast ref={ref} />
            {children}
        </ToastContext.Provider>
    )
}

export const useToast = (): ToastContext['show'] => {
    const context = useContext(ToastContext);

    if (context === undefined) {
        throw new Error('Missing RiderContext');
    }

    return context.show;
}