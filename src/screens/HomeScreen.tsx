import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import {
    request,
    PERMISSIONS,
    RESULTS,
    openSettings,
} from 'react-native-permissions';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHook';
import {
    setRides,
    setSelectedRide,
    setLoading,
    setError,
} from '../store/slices/ridesSlice';
import { setDestination } from '../store/slices/bookingSlice';
import { getRides } from '../api/ridesService';
import RideList from '../components/home/RideList';
import RideMap from '../components/map/RideMap';
import { Ride } from '../types';
import fallbackRides from '../data/rides.json';
import { MAPS_API_KEY } from '../constants/maps';

interface Coordinate {
    latitude: number;
    longitude: number;
}

// Hoisted so the object reference is stable across renders — otherwise the
// memoized RideMap would re-render on every HomeScreen render.
const MAP_STYLE = { height: 220 };

// Use `src/data/rides.json` as the local fallback dataset when the server
// is unreachable. This keeps the data authoritative and avoids duplicating
// the mock rides inline in this file.
const MOCK_RIDES: Ride[] = fallbackRides as unknown as Ride[];

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<
        NavigationProp<{
            HomeMain: undefined;
            ConfirmRide: undefined;
            BookingSuccess: undefined;
        }>
    >();
    const dispatch = useAppDispatch();
    const { rides, loading } = useAppSelector((state) => state.rides);
    const { destination } = useAppSelector((state) => state.booking);
    const [destinationInput, setDestinationInput] = useState('');
    const [destinationCoords, setDestinationCoords] = useState<
        Coordinate | undefined
    >();
    const [geocodeError, setGeocodeError] = useState<string | undefined>();
    const [hasSearched, setHasSearched] = useState(false);

    const requestLocationPermission = async () => {
        const permission = Platform.select({
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        });

        if (!permission) return;

        const result = await request(permission);

        if (result === RESULTS.GRANTED) {
            if (Platform.OS === 'android') {
                await promptForEnableLocationIfNeeded({
                    interval: 10000,
                });
            }
        } else if (result === RESULTS.BLOCKED) {
            Alert.alert(
                'Location Required',
                'Please enable location in Settings so GreenRide can show nearby rides.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => openSettings() },
                ]
            );
        }
    };

    const geocodeDestination = useCallback(async (address: string) => {
        if (!address.trim()) {
            setDestinationCoords(undefined);
            setGeocodeError(undefined);
            return;
        }
        setGeocodeError(undefined);
        try {
            const query = encodeURIComponent(address);
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${MAPS_API_KEY}`;
            const response = await fetch(url);
            const json = await response.json();
            if (json.status === 'OK' && json.results.length > 0) {
                const { lat, lng } = json.results[0].geometry.location;
                setDestinationCoords({ latitude: lat, longitude: lng });
            } else {
                setGeocodeError('Address not found. Try a different search.');
                if (__DEV__) {
                    console.log('[GreenRide] Geocoding failed:', json.status);
                }
            }
        } catch (e) {
            setGeocodeError('Could not search. Check your connection.');
            if (__DEV__) {
                console.log('[GreenRide] Geocoding error:', e);
            }
        }
    }, []);

    const fetchRides = useCallback(async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await getRides();
            dispatch(setRides(data));
            console.log('[GreenRide] Fetched rides:', data);
        } catch {
            if (__DEV__) {
                console.log(
                    '[GreenRide] Server unreachable — using mock rides'
                );
            }
            dispatch(setRides(MOCK_RIDES));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Triggered when the user submits a destination — only then do we hit the
    // rides API (and geocode for the map pin). This is also why a JSON server
    // started after app launch now works: the request is made on demand.
    const handleSearch = useCallback(() => {
        const trimmed = destinationInput.trim();
        if (!trimmed) {
            return;
        }
        setHasSearched(true);
        geocodeDestination(trimmed);
        fetchRides();
    }, [destinationInput, geocodeDestination, fetchRides]);

    useEffect(() => {
        requestLocationPermission();
    }, []);

    // Clear destination coords + search state when booking resets
    useEffect(() => {
        if (!destination) {
            setDestinationCoords(undefined);
            setHasSearched(false);
        }
    }, [destination]);

    const handleSelectRide = useCallback(
        (ride: Ride) => {
            dispatch(setSelectedRide(ride));
            dispatch(setDestination(destinationInput || 'Destination'));
            navigation.navigate('ConfirmRide');
        },
        [dispatch, destinationInput, navigation]
    );

    return (
        <SafeAreaView className="flex-1 scheme:bg-background">
            <RideMap style={MAP_STYLE} destination={destinationCoords} />

            <KeyboardAvoidingView
                className="flex-1 px-4 pt-4"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View
                    className="scheme:bg-surface rounded-xl px-4 py-3 mb-4 scheme:border-border border flex-row items-center gap-2"
                    style={{
                        shadowColor: '#000',
                        shadowOpacity: 0.06,
                        shadowRadius: 8,
                        elevation: 3,
                    }}
                >
                    <Text>🔍</Text>
                    <TextInput
                        value={destinationInput}
                        onChangeText={(text) => {
                            setDestinationInput(text);
                            if (geocodeError) {
                                setGeocodeError(undefined);
                            }
                        }}
                        onSubmitEditing={handleSearch}
                        placeholder="Where are you going?"
                        placeholderTextColor="#8DB8AE"
                        className="flex-1 scheme:text-textPrimary text-sm"
                        accessibilityLabel="Destination input"
                        returnKeyType="search"
                    />
                </View>

                {geocodeError && (
                    <Text className="text-red-500 text-xs mb-3 -mt-2 px-1">
                        {geocodeError}
                    </Text>
                )}

                <Text className="scheme:text-textPrimary font-bold text-lg mb-3">
                    Available Rides
                </Text>

                <RideList
                    rides={rides}
                    loading={loading}
                    searched={hasSearched}
                    onSelectRide={handleSelectRide}
                    onRefresh={fetchRides}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default HomeScreen;
