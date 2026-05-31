import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHook';
import { setRides, setSelectedRide, setLoading, setError } from '../store/slices/ridesSlice';
import { setDestination } from '../store/slices/bookingSlice';
import { getRides } from '../api/ridesService';
import RideList from '../components/home/RideList';
import RideMap from '../components/map/RideMap';
import { Ride } from '../types';

const MOCK_RIDES: Ride[] = [
    { id: 1, vehicleType: 'Electric', eta: '3 mins', price: 7.5, co2Saved: 1.4 },
    { id: 2, vehicleType: 'Hybrid', eta: '4 mins', price: 6.8, co2Saved: 0.8 },
];

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<{ HomeMain: undefined; ConfirmRide: undefined; BookingSuccess: undefined }>>();
    const dispatch = useAppDispatch();
    const { rides, loading } = useAppSelector(state => state.rides);
    const { destination } = useAppSelector(state => state.booking);
    const [destinationInput, setDestinationInput] = useState('');

    const fetchRides = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await getRides();
            dispatch(setRides(data));
        } catch {
            dispatch(setRides(MOCK_RIDES));
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchRides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectRide = (ride: Ride) => {
        dispatch(setSelectedRide(ride));
        dispatch(setDestination(destinationInput || 'Destination'));
        navigation.navigate('ConfirmRide');
    };

    return (
        <SafeAreaView className="flex-1 scheme:bg-background">
            <RideMap
                style={{ height: 220 }}
                destination={
                    destination
                        ? { latitude: 51.515, longitude: -0.09 }
                        : undefined
                }
            />

            <KeyboardAvoidingView
                className="flex-1 px-4 pt-4"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View
                    className="scheme:bg-surface rounded-xl px-4 py-3 mb-4 scheme:border-border border flex-row items-center gap-2"
                    style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}
                >
                    <Text>🔍</Text>
                    <TextInput
                        value={destinationInput}
                        onChangeText={setDestinationInput}
                        placeholder="Where are you going?"
                        placeholderTextColor="#8DB8AE"
                        className="flex-1 scheme:text-textPrimary text-sm"
                        accessibilityLabel="Destination input"
                        returnKeyType="search"
                    />
                </View>

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
