import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ride } from '../../types';
import StatusBadge from '../common/StatusBadge';

interface Props {
    ride: Ride;
    onPress: (ride: Ride) => void;
}

const RideCard: React.FC<Props> = ({ ride, onPress }) => {
    const isElectric = ride.vehicleType === 'Electric';

    return (
        <TouchableOpacity
            onPress={() => onPress(ride)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`${ride.vehicleType} ride, ${ride.eta}, $${ride.price.toFixed(2)}, saves ${ride.co2Saved} kg CO2`}
            className="scheme:bg-surface rounded-2xl p-4 mb-3 scheme:border-border border"
            style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
        >
            <View className="flex-row items-center gap-3">
                <View
                    className={`w-12 h-12 rounded-xl items-center justify-center ${isElectric ? 'scheme:bg-electricBadge' : 'scheme:bg-hybridBadge'}`}
                >
                    <Text style={{ fontSize: 22 }}>{isElectric ? '⚡' : '🔋'}</Text>
                </View>

                <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                        <Text className="scheme:text-textPrimary font-bold text-base">
                            {ride.vehicleType}
                        </Text>
                        <StatusBadge vehicleType={ride.vehicleType} />
                    </View>
                    <Text className="scheme:text-textSecondary text-sm">
                        {ride.eta} away
                    </Text>
                    <Text className="text-primary-light text-xs font-semibold mt-1">
                        🌱 Saves {ride.co2Saved} kg CO₂
                    </Text>
                </View>

                <Text className="scheme:text-textPrimary font-bold text-lg">
                    ${ride.price.toFixed(2)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default RideCard;
