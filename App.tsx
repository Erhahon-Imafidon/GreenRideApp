import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import store from './src/store';
import { loadProfileFromStorage } from './src/store';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

function AppContent() {
    const { mode } = useTheme();

    useEffect(() => {
        loadProfileFromStorage(store.dispatch);
    }, []);

    return (
        <SafeAreaProvider>
            <StatusBar
                barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
            />
            <AppNavigator />
        </SafeAreaProvider>
    );
}

const App = () => {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </Provider>
    );
};

export default App;
