import React from 'react';
import { View, Text } from 'react-native';

interface Props {
    co2Saved: number;
}

const Co2HeroCard: React.FC<Props> = ({ co2Saved }) => {
    return (
        <View
            className="scheme:bg-co2Bg rounded-2xl p-5 items-center mb-4"
            accessibilityLabel={`You save ${co2Saved} kilograms of CO2 compared to a petrol car`}
        >
            <Text className="text-primary-light font-bold text-4xl mb-1">
                {co2Saved} kg
            </Text>
            <Text className="text-primary-light text-sm opacity-80 text-center">
                CO₂ saved vs. a petrol car 🌍
            </Text>
            <Text className="scheme:text-textSecondary text-xs mt-2">
                You're helping fight climate change!
            </Text>
        </View>
    );
};

export default Co2HeroCard;
