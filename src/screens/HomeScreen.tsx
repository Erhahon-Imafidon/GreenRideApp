import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    PermissionsAndroid,
} from 'react-native';
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
import { MAPS_API_KEY } from '../constants/maps';

interface Coordinate {
    latitude: number;
    longitude: number;
}

const MOCK_RIDES: Ride[] = [
    {
        id: 1,
        vehicleType: 'Electric',
        eta: '3 mins',
        price: 2500,
        co2Saved: 1.4,
    },
    { id: 2, vehicleType: 'Hybrid', eta: '4 mins', price: 1800, co2Saved: 0.8 },
];

const HomeScreen: React.FC = () => {
    const navigation =
        useNavigation<
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

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message:
                        'GreenRide needs your location to show nearby rides.',
                    buttonPositive: 'Allow',
                    buttonNegative: 'Deny',
                }
            );
        }
    };

    const geocodeDestination = async (address: string) => {
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
    };

    const fetchRides = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await getRides();
            dispatch(setRides(data));
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
    };

    useEffect(() => {
        requestLocationPermission();
        fetchRides();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Clear destination coords when booking resets
    useEffect(() => {
        if (!destination) {
            setDestinationCoords(undefined);
        }
    }, [destination]);

    const handleSelectRide = (ride: Ride) => {
        dispatch(setSelectedRide(ride));
        dispatch(setDestination(destinationInput || 'Destination'));
        navigation.navigate('ConfirmRide');
    };

    return (
        <SafeAreaView className="flex-1 scheme:bg-background">
            <RideMap style={{ height: 220 }} destination={destinationCoords} />

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
                            if (geocodeError) { setGeocodeError(undefined); }
                        }}
                        onSubmitEditing={() =>
                            geocodeDestination(destinationInput)
                        }
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
                    onSelectRide={handleSelectRide}
                    onRefresh={fetchRides}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default HomeScreen;
