import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';
import ridesReducer from './slices/ridesSlice';
import bookingReducer from './slices/bookingSlice';
import profileReducer from './slices/profileSlice';
import themeReducer, { setTheme, toggleTheme } from './slices/themeSlice';

const themeListener = createListenerMiddleware();

themeListener.startListening({
    actionCreator: setTheme,
    effect: action => {
        Appearance.setColorScheme(action.payload);
    },
});

themeListener.startListening({
    actionCreator: toggleTheme,
    effect: (_action, listenerApi) => {
        const { theme } = listenerApi.getState() as { theme: { mode: 'light' | 'dark' } };
        Appearance.setColorScheme(theme.mode);
    },
});

const store = configureStore({
    reducer: {
        rides: ridesReducer,
        booking: bookingReducer,
        profile: profileReducer,
        theme: themeReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ serializableCheck: false }).prepend(
            themeListener.middleware,
        ),
    devTools: __DEV__,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
