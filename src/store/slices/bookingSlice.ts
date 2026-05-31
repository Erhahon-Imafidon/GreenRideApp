import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BookingStatus } from '../../types';

interface BookingState {
    origin: string;
    destination: string;
    status: BookingStatus;
}

const initialState: BookingState = {
    origin: 'Current Location',
    destination: '',
    status: 'idle',
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setOrigin(state, action: PayloadAction<string>) {
            state.origin = action.payload;
        },
        setDestination(state, action: PayloadAction<string>) {
            state.destination = action.payload;
        },
        setBookingStatus(state, action: PayloadAction<BookingStatus>) {
            state.status = action.payload;
        },
        resetBooking(state) {
            state.destination = '';
            state.status = 'idle';
        },
    },
});

export const { setOrigin, setDestination, setBookingStatus, resetBooking } =
    bookingSlice.actions;
export default bookingSlice.reducer;
