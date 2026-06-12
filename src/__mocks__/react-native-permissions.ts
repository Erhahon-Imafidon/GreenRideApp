export const PERMISSIONS = {
    ANDROID: {
        ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
        ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
    },
    IOS: {
        LOCATION_WHEN_IN_USE: 'ios.permission.LOCATION_WHEN_IN_USE',
    },
};

export const RESULTS = {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    GRANTED: 'granted',
    BLOCKED: 'blocked',
};

export const request = jest.fn().mockResolvedValue(RESULTS.GRANTED);
export const check = jest.fn().mockResolvedValue(RESULTS.GRANTED);
export const openSettings = jest.fn().mockResolvedValue(undefined);
