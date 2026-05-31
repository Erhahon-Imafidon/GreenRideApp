import React from 'react';
import { Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import ConfirmRideScreen from '../screens/ConfirmRideScreen';
import BookingSuccessScreen from '../screens/BookingSuccessScreen';
import ProfileScreen from '../screens/ProfileScreen';

const HomeStack = createNativeStackNavigator({
    screenOptions: { headerShown: false },
    screens: {
        HomeMain: HomeScreen,
        ConfirmRide: ConfirmRideScreen,
        BookingSuccess: BookingSuccessScreen,
    },
});

const MainTabs = createBottomTabNavigator({
    screenOptions: {
        headerShown: false,
        tabBarActiveTintColor: '#1A7A4A',
        tabBarInactiveTintColor: '#8DB8AE',
        tabBarStyle: {
            borderTopWidth: 1,
        },
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
        },
    },
    screens: {
        Home: {
            screen: HomeStack,
            options: {
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                    <Text style={{ fontSize: size, color }}>🏠</Text>
                ),
            },
        },
        Profile: {
            screen: ProfileScreen,
            options: {
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                    <Text style={{ fontSize: size, color }}>👤</Text>
                ),
            },
        },
    },
});

const RootStack = createNativeStackNavigator({
    screenOptions: { headerShown: false },
    screens: {
        Splash: SplashScreen,
        Main: MainTabs,
    },
});

type RootStackType = typeof RootStack;

declare module '@react-navigation/core' {
    interface RootNavigator extends RootStackType {}
}

const Navigation = createStaticNavigation(RootStack);

const AppNavigator = () => <Navigation />;

export default AppNavigator;
