import React from 'react';
import { View, Text } from 'react-native';

interface Props {
    vehicleType: 'Electric' | 'Hybrid';
}

const StatusBadge: React.FC<Props> = ({ vehicleType }) => {
    const isElectric = vehicleType === 'Electric';

    return (
        <View
            className={`px-3 py-1 rounded-full ${isElectric ? 'scheme:bg-electricBadge' : 'scheme:bg-hybridBadge'}`}
            accessibilityLabel={`${vehicleType} vehicle`}
        >
            <Text
                className={`text-xs font-bold ${isElectric ? 'text-accent-light' : 'text-ecoPoints-light'}`}
            >
                {isElectric ? '⚡ Electric' : '🔋 Hybrid'}
            </Text>
        </View>
    );
};

export default StatusBadge;
