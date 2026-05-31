import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';

const SplashScreen: React.FC = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <LinearGradient
            colors={Colors.gradientGreen}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <View className="flex-1 items-center justify-center px-8">
                <View
                    className="w-20 h-20 rounded-2xl items-center justify-center mb-6"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    accessibilityLabel="GreenRide logo"
                >
                    <Text style={{ fontSize: 40 }}>🌿</Text>
                </View>

                <Text
                    className="text-white text-4xl font-bold mb-2"
                    accessibilityRole="header"
                >
                    GreenRide
                </Text>

                <Text className="text-white text-base text-center opacity-80">
                    Ride Green. Drive Change.
                </Text>

                <Text className="text-white text-sm text-center mt-2 opacity-60">
                    Eco-friendly rides for a better planet
                </Text>
            </View>
        </LinearGradient>
    );
};

export default SplashScreen;
