import React from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../constants/colors';

interface Props {
    points: number;
}

const EcoPointsCard: React.FC<Props> = ({ points }) => {
    return (
        <LinearGradient
            colors={Colors.gradientAmber}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: Colors.ecoPointsSecondary,
            }}
        >
            <View
                className="flex-row items-center justify-between px-5 py-4"
                accessibilityLabel={`EcoPoints balance: ${points} points`}
            >
                <View>
                    <Text
                        className="font-bold text-3xl"
                        style={{ color: Colors.ecoPoints }}
                    >
                        🪙 {points}
                    </Text>
                    <Text style={{ color: '#8D6E00', fontSize: 12, marginTop: 2 }}>
                        EcoPoints balance
                    </Text>
                </View>
                <Text style={{ fontSize: 36 }}>🏆</Text>
            </View>
        </LinearGradient>
    );
};

export default EcoPointsCard;
