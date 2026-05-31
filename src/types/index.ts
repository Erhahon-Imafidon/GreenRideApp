export interface Ride {
    id: number;
    vehicleType: 'Electric' | 'Hybrid';
    /** Display string from API, e.g. "3 mins" */
    eta: string;
    price: number;
    co2Saved: number;
}

export type BookingStatus = 'idle' | 'loading' | 'booked' | 'error';

export interface RideHistoryItem {
    /** Locally generated string ID (e.g. Date.now()). Different type from Ride.id (server number) — intentional. */
    id: string;
    rideId: number;
    vehicleType: 'Electric' | 'Hybrid';
    co2Saved: number;
    ecoPointsEarned: number;
    price: number;
    /** ISO 8601 date-time string, e.g. "2026-05-31T12:00:00.000Z" */
    date: string;
}
