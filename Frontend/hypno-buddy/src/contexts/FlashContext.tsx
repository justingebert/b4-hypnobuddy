import React, { createContext, useState, ReactNode } from 'react';

type FlashContextType = {
    flash: (msg: string) => void;
};

const defaultFlashContext: FlashContextType = {
    flash: () => console.warn('Default FlashContext provider - this is a bug'),
};

export const FlashContext = createContext<FlashContextType>(defaultFlashContext);

interface FlashProviderProps {
    children: ReactNode;
}

export function FlashProvider({ children }: FlashProviderProps) {
    const [message, setMessage] = useState<string | null>(null);

    const flash = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 5000); // Hide the message after 3 seconds
    };

    return (
        <FlashContext.Provider value={{ flash }}>
            {children}
            {message && <div className="flash-message">{message}</div>}
        </FlashContext.Provider>
    );
}
