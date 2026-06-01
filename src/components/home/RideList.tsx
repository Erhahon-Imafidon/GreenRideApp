import React from 'react';
import {
    FlatList,
    View,
    Text,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Ride } from '../../types';
import RideCard from './RideCard';

interface Props {
    rides: Ride[];
    loading: boolean;
    onSelectRide: (ride: Ride) => void;
    onRefresh: () => void;
}

const RideList: React.FC<Props> = ({
    rides,
    loading,
    onSelectRide,
    onRefresh,
}) => {
    if (loading && rides.length === 0) {
        return (
            <View className="flex-1 items-center justify-center py-12">
                <ActivityIndicator size="large" color="#1A7A4A" />
                <Text className="scheme:text-textSecondary mt-3 text-sm">
                    Finding rides near you...
                </Text>
            </View>
        );
    }

    if (!loading && rides.length === 0) {
        return (
            <View className="flex-1 items-center justify-center py-12">
                <Text style={{ fontSize: 40 }}>🌿</Text>
                <Text className="scheme:text-textPrimary font-semibold text-base mt-3">
                    No rides available
                </Text>
                <Text className="scheme:text-textSecondary text-sm mt-1">
                    Pull down to refresh
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={rides}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
                <RideCard ride={item} onPress={onSelectRide} />
            )}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={onRefresh}
                    tintColor="#1A7A4A"
                    colors={['#1A7A4A']}
                />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
        />
    );
};

export default RideList;
