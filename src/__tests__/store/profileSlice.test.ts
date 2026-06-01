import profileReducer, {
    addCompletedRide,
} from '../../store/slices/profileSlice';
import { RideHistoryItem } from '../../types';

const makeRideItem = (
    overrides: Partial<RideHistoryItem> = {}
): RideHistoryItem => ({
    id: '1',
    rideId: 1,
    vehicleType: 'Electric',
    co2Saved: 1.4,
    ecoPointsEarned: 14,
    price: 7.5,
    date: '2026-05-31T12:00:00.000Z',
    ...overrides,
});

describe('profileSlice', () => {
    it('starts with zero totals', () => {
        const state = profileReducer(undefined, { type: '@@INIT' });
        expect(state.totalRides).toBe(0);
        expect(state.totalCo2Saved).toBe(0);
        expect(state.ecoPoints).toBe(0);
        expect(state.rideHistory).toHaveLength(0);
    });

    it('increments totalRides by 1 when a ride is completed', () => {
        const state = profileReducer(
            undefined,
            addCompletedRide(makeRideItem())
        );
        expect(state.totalRides).toBe(1);
    });

    it('accumulates totalCo2Saved correctly across two rides', () => {
        let state = profileReducer(
            undefined,
            addCompletedRide(makeRideItem({ co2Saved: 1.4 }))
        );
        state = profileReducer(
            state,
            addCompletedRide(makeRideItem({ id: '2', co2Saved: 0.8 }))
        );
        expect(state.totalCo2Saved).toBe(2.2);
    });

    it('accumulates ecoPoints correctly', () => {
        let state = profileReducer(
            undefined,
            addCompletedRide(makeRideItem({ ecoPointsEarned: 14 }))
        );
        state = profileReducer(
            state,
            addCompletedRide(makeRideItem({ id: '2', ecoPointsEarned: 8 }))
        );
        expect(state.ecoPoints).toBe(22);
    });

    it('prepends new rides to rideHistory (newest first)', () => {
        let state = profileReducer(
            undefined,
            addCompletedRide(makeRideItem({ id: 'first' }))
        );
        state = profileReducer(
            state,
            addCompletedRide(makeRideItem({ id: 'second' }))
        );
        expect(state.rideHistory[0].id).toBe('second');
        expect(state.rideHistory[1].id).toBe('first');
    });
});
