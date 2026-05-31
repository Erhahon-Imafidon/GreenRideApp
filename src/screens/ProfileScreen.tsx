import React from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useAppSelector } from '../hooks/reduxHook';
import { useTheme } from '../context/ThemeContext';
import StatCard from '../components/profile/StatCard';
import EcoPointsCard from '../components/profile/EcoPointsCard';
import AchievementBadge, { Achievement } from '../components/profile/AchievementBadge';
import { Colors } from '../constants/colors';
import { RideHistoryItem } from '../types';

const ACHIEVEMENTS: Achievement[] = [
    { id: '1', emoji: '🌱', label: 'First Eco Ride', unlocked: true },
    { id: '2', emoji: '⚡', label: 'Electric Rider', unlocked: true },
    { id: '3', emoji: '🚗', label: '10 Rides', unlocked: false },
    { id: '4', emoji: '🌍', label: '10kg CO₂ Saved', unlocked: false },
];

const formatRideDate = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
        ' · ' +
        d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const RideHistoryRow: React.FC<{ item: RideHistoryItem; isLast: boolean }> = ({ item, isLast }) => (
    <View
        className={`py-3 flex-row items-center justify-between${isLast ? '' : ' border-b scheme:border-border'}`}
    >
        <View className="flex-1 mr-3">
            <Text className="scheme:text-textPrimary font-semibold text-sm">
                {item.vehicleType === 'Electric' ? '⚡' : '🔋'} {item.vehicleType} Ride
            </Text>
            <Text className="scheme:text-textSecondary text-xs mt-0.5">
                🌿 {item.co2Saved} kg CO₂ · {formatRideDate(item.date)}
            </Text>
        </View>
        <View className="items-end">
            <Text className="scheme:text-textPrimary font-bold text-sm">
                ₦{item.price.toLocaleString()}
            </Text>
            <Text className="text-xs mt-0.5" style={{ color: Colors.ecoPoints }}>
                +{item.ecoPointsEarned} pts
            </Text>
        </View>
    </View>
);

const ProfileScreen: React.FC = () => {
    const { mode, toggleTheme } = useTheme();
    const { totalRides, totalCo2Saved, ecoPoints, rideHistory } = useAppSelector(state => state.profile);
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

                    <Text className="scheme:text-textPrimary font-bold text-base mb-3">
                        Recent Rides
                    </Text>
                    <View
                        className="scheme:bg-surface rounded-2xl px-4 mb-6 scheme:border-border border"
                        style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
                    >
                        {rideHistory.length === 0 ? (
                            <View className="py-6 items-center">
                                <Text className="scheme:text-textSecondary text-sm">
                                    No rides yet — book your first green ride!
                                </Text>
                            </View>
                        ) : (
                            rideHistory.map((item, index) => (
                                <RideHistoryRow
                                    key={item.id}
                                    item={item}
                                    isLast={index === rideHistory.length - 1}
                                />
                            ))
                        )}
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
                            onValueChange={toggleTheme}
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
