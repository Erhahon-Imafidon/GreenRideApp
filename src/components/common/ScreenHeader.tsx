import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../constants/colors';

interface Props {
    children: React.ReactNode;
    showBack?: boolean;
    onBack?: () => void;
}

const ScreenHeader: React.FC<Props> = ({ children, showBack = false, onBack }) => {
    return (
        <LinearGradient
            colors={Colors.gradientGreen}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
        >
            {showBack && (
                <TouchableOpacity
                    onPress={onBack}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                    className="mb-3"
                >
                    <Text className="text-white text-sm font-semibold">← Back</Text>
                </TouchableOpacity>
            )}
            {children}
        </LinearGradient>
    );
};

export default ScreenHeader;
