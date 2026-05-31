import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHook';
import { resetBooking } from '../store/slices/bookingSlice';
import GradientButton from '../components/common/GradientButton';
import { Colors } from '../constants/colors';

const BookingSuccessScreen: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const selectedRide = useAppSelector(state => state.rides.selectedRide);
    const ecoPoints = useAppSelector(state => state.profile.ecoPoints);

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, [scaleAnim, opacityAnim]);

    const handleBackToHome = () => {
        dispatch(resetBooking());
        navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
        });
    };

    const ecoPointsEarned = selectedRide
        ? Math.round(selectedRide.co2Saved * 10)
        : 0;

    return (
        <SafeAreaView className="flex-1 scheme:bg-background">
            <View className="flex-1 items-center justify-center px-6">
                <Animated.View
                    style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}
                    className="items-center"
                >
                    <View
                        className="w-28 h-28 rounded-full items-center justify-center mb-6"
                        style={{ backgroundColor: Colors.co2Bg.light }}
                        accessibilityLabel="Booking confirmed"
                    >
                        <Text style={{ fontSize: 56 }}>✅</Text>
                    </View>

                    <Text
                        className="scheme:text-textPrimary font-bold text-3xl mb-2 text-center"
                        accessibilityRole="header"
                    >
                        Ride Booked!
                    </Text>

                    <Text className="scheme:text-textSecondary text-base text-center mb-8">
                        Your eco-friendly ride is on its way 🌿
                    </Text>

                    <View
                        className="scheme:bg-surface rounded-2xl px-8 py-5 items-center mb-8 w-full scheme:border-border border"
                        style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
                    >
                        <Text style={{ fontSize: 32 }}>🪙</Text>
                        <Text
                            className="font-bold text-2xl mt-2"
                            style={{ color: Colors.ecoPoints }}
                        >
                            +{ecoPointsEarned} EcoPoints
                        </Text>
                        <Text className="scheme:text-textSecondary text-sm mt-1">
                            Total: {ecoPoints} pts
                        </Text>
                        {selectedRide && (
                            <Text className="text-primary-light text-sm font-semibold mt-3">
                                🌱 {selectedRide.co2Saved} kg CO₂ saved
                            </Text>
                        )}
                    </View>
                </Animated.View>

                <GradientButton
                    title="Back to Home"
                    onPress={handleBackToHome}
                    accessibilityLabel="Return to home screen"
                />
            </View>
        </SafeAreaView>
    );
};

export default BookingSuccessScreen;
