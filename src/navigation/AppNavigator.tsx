import React from 'react';
import { Text, View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import ConfirmRideScreen from '../screens/ConfirmRideScreen';
import BookingSuccessScreen from '../screens/BookingSuccessScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { navigationRef } from './navigationRef';

const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => (
    <View
        style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: focused ? '#E8F5EE' : 'transparent',
            width: 56,
            height: 28,
            borderRadius: 14,
        }}
    >
        <Text style={{ fontSize: 20 }}>{emoji}</Text>
    </View>
);

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
            borderTopWidth: 0,
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
                tabBarIcon: ({ focused }) => (
                    <TabIcon emoji="🏠" focused={focused} />
                ),
            },
        },
        Profile: {
            screen: ProfileScreen,
            options: {
                tabBarLabel: 'Profile',
                tabBarIcon: ({ focused }) => (
                    <TabIcon emoji="👤" focused={focused} />
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

const AppNavigator = () => <Navigation ref={navigationRef} />;

export default AppNavigator;
