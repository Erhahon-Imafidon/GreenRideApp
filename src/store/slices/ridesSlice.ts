import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ride } from '../../types';

interface RidesState {
    rides: Ride[];
    selectedRide: Ride | null;
    loading: boolean;
    error: string | null;
}

const initialState: RidesState = {
    rides: [],
    selectedRide: null,
    loading: false,
    error: null,
};

const ridesSlice = createSlice({
    name: 'rides',
    initialState,
    reducers: {
        setRides(state, action: PayloadAction<Ride[]>) {
            state.rides = action.payload;
        },
        setSelectedRide(state, action: PayloadAction<Ride | null>) {
            state.selectedRide = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const { setRides, setSelectedRide, setLoading, setError } = ridesSlice.actions;
export default ridesSlice.reducer;
