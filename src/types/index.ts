export interface Ride {
    id: number;
    vehicleType: 'Electric' | 'Hybrid';
    eta: string;
    price: number;
    co2Saved: number;
}

export type BookingStatus = 'idle' | 'loading' | 'booked' | 'error';

export interface RideHistoryItem {
    id: string;
    rideId: number;
    vehicleType: 'Electric' | 'Hybrid';
    co2Saved: number;
    ecoPointsEarned: number;
    price: number;
    date: string;
}
