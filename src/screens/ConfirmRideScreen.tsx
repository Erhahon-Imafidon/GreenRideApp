import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHook';
import { setBookingStatus } from '../store/slices/bookingSlice';
import { addCompletedRide } from '../store/slices/profileSlice';
import ScreenHeader from '../components/common/ScreenHeader';
import Co2HeroCard from '../components/confirmation/Co2HeroCard';
import RideDetailRow from '../components/confirmation/RideDetailRow';
import GradientButton from '../components/common/GradientButton';
import { Colors } from '../constants/colors';
import { RideHistoryItem } from '../types';

type NavProp = NativeStackNavigationProp<{
    ConfirmRide: undefined;
    BookingSuccess: undefined;
}>;

const ConfirmRideScreen: React.FC = () => {
    const navigation = useNavigation<NavProp>();
    const dispatch = useAppDispatch();
    const selectedRide = useAppSelector(state => state.rides.selectedRide);
    const { origin, destination, status } = useAppSelector(state => state.booking);

    if (!selectedRide) {
        navigation.goBack();
        return null;
    }

    const ecoPointsEarned = Math.round(selectedRide.co2Saved * 10);

    const handleConfirm = () => {
        dispatch(setBookingStatus('loading'));

        setTimeout(() => {
            const historyItem: RideHistoryItem = {
                id: `${Date.now()}`,
                rideId: selectedRide.id,
                vehicleType: selectedRide.vehicleType,
                co2Saved: selectedRide.co2Saved,
                ecoPointsEarned,
                price: selectedRide.price,
                date: new Date().toISOString(),
            };

            dispatch(addCompletedRide(historyItem));
            dispatch(setBookingStatus('booked'));
            navigation.navigate('BookingSuccess');
        }, 1000);
    };

    return (
        <SafeAreaView className="flex-1 scheme:bg-background">
            <ScrollView showsVerticalScrollIndicator={false}>
                <ScreenHeader showBack onBack={() => navigation.goBack()}>
                    <Text
                        className="text-white font-bold text-xl"
                        accessibilityRole="header"
                    >
                        {selectedRide.vehicleType === 'Electric' ? '⚡' : '🔋'}{' '}
                        {selectedRide.vehicleType} Ride
                    </Text>
                    <Text className="text-white text-sm opacity-75 mt-1">
                        📍 {origin} → 🏁 {destination}
                    </Text>
                </ScreenHeader>

                <View className="px-4 pt-4">
                    <Co2HeroCard co2Saved={selectedRide.co2Saved} />

                    <View
                        className="scheme:bg-surface rounded-2xl px-4 mb-6 scheme:border-border border"
                        style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
                    >
                        <RideDetailRow label="Estimated Price" value={`$${selectedRide.price.toFixed(2)}`} />
                        <RideDetailRow label="ETA" value={selectedRide.eta} />
                        <RideDetailRow
                            label="EcoPoints Earned"
                            value={`+${ecoPointsEarned} pts 🪙`}
                            valueColor={Colors.ecoPoints}
                        />
                        <RideDetailRow label="Vehicle Type" value={selectedRide.vehicleType} isLast />
                    </View>

                    <GradientButton
                        title={status === 'loading' ? 'Confirming...' : '✅ Confirm Ride'}
                        onPress={handleConfirm}
                        disabled={status === 'loading'}
                        accessibilityLabel="Confirm your ride booking"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ConfirmRideScreen;
