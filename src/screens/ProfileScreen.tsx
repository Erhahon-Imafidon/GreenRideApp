import React from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHook';
import { toggleTheme } from '../store/slices/themeSlice';
import StatCard from '../components/profile/StatCard';
import EcoPointsCard from '../components/profile/EcoPointsCard';
import AchievementBadge, { Achievement } from '../components/profile/AchievementBadge';
import { Colors } from '../constants/colors';

const ACHIEVEMENTS: Achievement[] = [
    { id: '1', emoji: '🌱', label: 'First Eco Ride', unlocked: true },
    { id: '2', emoji: '⚡', label: 'Electric Rider', unlocked: true },
    { id: '3', emoji: '🚗', label: '10 Rides', unlocked: false },
    { id: '4', emoji: '🌍', label: '10kg CO₂ Saved', unlocked: false },
];

const ProfileScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { totalRides, totalCo2Saved, ecoPoints } = useAppSelector(state => state.profile);
    const { mode } = useAppSelector(state => state.theme);
    const isDark = mode === 'dark';

    return (
        <SafeAreaView className="flex-1 scheme:bg-background">
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={Colors.gradientGreen}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32 }}
                >
                    <View className="items-center">
                        <View
                            className="w-16 h-16 rounded-full items-center justify-center mb-3"
                            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                            accessibilityLabel="User avatar"
                        >
                            <Text style={{ fontSize: 32 }}>👤</Text>
                        </View>
                        <Text className="text-white font-bold text-xl" accessibilityRole="header">
                            Eco Rider
                        </Text>
                        <Text className="text-white text-sm opacity-75 mt-1">
                            🌿 Green Champion · Level{' '}
                            {Math.max(1, Math.floor(totalRides / 3) + 1)}
                        </Text>
                    </View>
                </LinearGradient>

                <View className="px-4 -mt-4">
                    <View className="flex-row gap-3 mb-4">
                        <StatCard
                            value={String(totalRides)}
                            label="Total Rides"
                            accessibilityLabel={`Total rides: ${totalRides}`}
                        />
                        <StatCard
                            value={`${totalCo2Saved} kg`}
                            label="CO₂ Saved"
                            accessibilityLabel={`${totalCo2Saved} kilograms of CO2 saved`}
                        />
                    </View>

                    <View className="mb-4">
                        <EcoPointsCard points={ecoPoints} />
                    </View>

                    <Text className="scheme:text-textPrimary font-bold text-base mb-3">
                        Achievements
                    </Text>
                    <View className="flex-row gap-3 mb-6 flex-wrap">
                        {ACHIEVEMENTS.map(a => (
                            <AchievementBadge key={a.id} achievement={a} />
                        ))}
                    </View>

                    <View
                        className="scheme:bg-surface rounded-2xl px-4 py-4 flex-row items-center justify-between scheme:border-border border mb-6"
                        style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}
                        accessibilityLabel={`Dark mode is ${isDark ? 'on' : 'off'}`}
                    >
                        <View>
                            <Text className="scheme:text-textPrimary font-semibold">
                                {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                            </Text>
                            <Text className="scheme:text-textSecondary text-xs mt-0.5">
                                Change app appearance
                            </Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={() => { dispatch(toggleTheme()); }}
                            trackColor={{ false: '#E0EDE8', true: Colors.primary }}
                            thumbColor="#FFFFFF"
                            accessibilityRole="switch"
                            accessibilityLabel="Toggle dark mode"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;
