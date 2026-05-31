import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ridesReducer from './slices/ridesSlice';
import bookingReducer from './slices/bookingSlice';
import profileReducer, { addCompletedRide, loadProfile, ProfileState } from './slices/profileSlice';

export const PROFILE_STORAGE_KEY = '@greenride_profile';

export const loadProfileFromStorage = async (dispatch: (action: ReturnType<typeof loadProfile>) => void) => {
    try {
        const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (raw) {
            dispatch(loadProfile(JSON.parse(raw) as ProfileState));
        }
    } catch (e) {
        if (__DEV__) { console.warn('[AsyncStorage] Failed to load profile:', e); }
    }
};

const profileListener = createListenerMiddleware();

profileListener.startListening({
    actionCreator: addCompletedRide,
    effect: (_action, listenerApi) => {
        const { profile } = listenerApi.getState() as { profile: ProfileState };
        AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile)).catch(e => {
            if (__DEV__) { console.warn('[AsyncStorage] Failed to save profile:', e); }
        });
    },
});

const store = configureStore({
    reducer: {
        rides: ridesReducer,
        booking: bookingReducer,
        profile: profileReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ serializableCheck: false }).prepend(
            profileListener.middleware,
        ),
    devTools: __DEV__,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
