import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import ConfirmRideScreen from '../screens/ConfirmRideScreen';
import BookingSuccessScreen from '../screens/BookingSuccessScreen';
import ProfileScreen from '../screens/ProfileScreen';

const TabIcon = ({ emoji }: { emoji: string }) => (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
    </View>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TabButton = (props: any) => {
    const isSelected = props.accessibilityState?.selected;
    return (
        <Pressable
            {...props}
            style={[
                props.style,
                { borderTopWidth: 2, borderTopColor: isSelected ? '#1A7A4A' : 'transparent' },
            ]}
        />
    );
};

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
                tabBarButton: TabButton,
                tabBarIcon: () => <TabIcon emoji="🏠" />,
            },
        },
        Profile: {
            screen: ProfileScreen,
            options: {
                tabBarLabel: 'Profile',
                tabBarButton: TabButton,
                tabBarIcon: () => <TabIcon emoji="👤" />,
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
