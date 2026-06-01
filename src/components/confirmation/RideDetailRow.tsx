import React from 'react';
import { View, Text } from 'react-native';

interface Props {
    label: string;
    value: string;
    valueColor?: string;
    isLast?: boolean;
}

const RideDetailRow: React.FC<Props> = ({
    label,
    value,
    valueColor,
    isLast = false,
}) => {
    return (
        <View
            className={`flex-row items-center justify-between py-3 ${
                !isLast ? 'scheme:border-border border-b' : ''
            }`}
        >
            <Text className="scheme:text-textSecondary text-sm">{label}</Text>
            <Text
                className="font-semibold text-sm scheme:text-textPrimary"
                style={valueColor ? { color: valueColor } : undefined}
            >
                {value}
            </Text>
        </View>
    );
};

export default RideDetailRow;
