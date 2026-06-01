import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../constants/colors';

interface Props {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    accessibilityLabel?: string;
}

const GradientButton: React.FC<Props> = ({
    title,
    onPress,
    disabled = false,
    accessibilityLabel,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? title}
            accessibilityState={{ disabled }}
        >
            <LinearGradient
                colors={
                    disabled ? ['#8DB8AE', '#8DB8AE'] : Colors.gradientGreen
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 12 }}
            >
                <Text className="text-white font-bold text-base text-center py-4 px-6">
                    {title}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default GradientButton;
