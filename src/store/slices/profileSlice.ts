import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RideHistoryItem } from '../../types';

export interface ProfileState {
    totalRides: number;
    totalCo2Saved: number;
    ecoPoints: number;
    rideHistory: RideHistoryItem[];
}

const initialState: ProfileState = {
    totalRides: 0,
    totalCo2Saved: 0,
    ecoPoints: 0,
    rideHistory: [],
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        addCompletedRide(state, action: PayloadAction<RideHistoryItem>) {
            state.totalRides += 1;
            state.totalCo2Saved = parseFloat(
                (state.totalCo2Saved + action.payload.co2Saved).toFixed(2)
            );
            state.ecoPoints += action.payload.ecoPointsEarned;
            state.rideHistory.unshift(action.payload);
        },
        loadProfile(_state, action: PayloadAction<ProfileState>) {
            return action.payload;
        },
    },
});

export const { addCompletedRide, loadProfile } = profileSlice.actions;
export default profileSlice.reducer;
