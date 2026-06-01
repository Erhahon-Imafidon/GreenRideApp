import React from 'react';
import { View, Text } from 'react-native';

export interface Achievement {
    id: string;
    emoji: string;
    label: string;
    unlocked: boolean;
}

interface Props {
    achievement: Achievement;
}

const AchievementBadge: React.FC<Props> = ({ achievement }) => {
    return (
        <View
            className={`w-14 h-14 rounded-2xl items-center justify-center ${
                achievement.unlocked
                    ? 'scheme:bg-electricBadge'
                    : 'scheme:bg-surface opacity-40'
            }`}
            accessibilityLabel={
                achievement.unlocked
                    ? `${achievement.label} achievement unlocked`
                    : `${achievement.label} achievement locked`
            }
        >
            <Text style={{ fontSize: 24 }}>
                {achievement.unlocked ? achievement.emoji : '🔒'}
            </Text>
        </View>
    );
};

export default AchievementBadge;
