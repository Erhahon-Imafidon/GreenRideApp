import React from 'react';
import { View, Text } from 'react-native';

interface Props {
    value: string;
    label: string;
    accessibilityLabel?: string;
}

const StatCard: React.FC<Props> = ({ value, label, accessibilityLabel }) => {
    return (
        <View
            className="flex-1 scheme:bg-surface rounded-2xl p-4 items-center scheme:border-border border"
            style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}
            accessibilityLabel={accessibilityLabel ?? `${value} ${label}`}
        >
            <Text className="text-primary-light font-bold text-2xl">{value}</Text>
            <Text className="scheme:text-textSecondary text-xs mt-1 text-center">{label}</Text>
        </View>
    );
};

export default StatCard;
