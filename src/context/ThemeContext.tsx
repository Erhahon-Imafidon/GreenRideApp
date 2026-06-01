import React, { createContext, useContext, useState } from 'react';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
    mode: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    mode: 'light',
    toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [mode, setMode] = useState<ThemeMode>(
        () => (Appearance.getColorScheme() ?? 'light') as ThemeMode
    );

    const toggleTheme = () => {
        const next: ThemeMode = mode === 'light' ? 'dark' : 'light';
        setMode(next);
        Appearance.setColorScheme(next);
    };

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
