import React, { useCallback } from 'react';
import {
    FlatList,
    View,
    Text,
    ActivityIndicator,
    RefreshControl,
    ListRenderItemInfo,
} from 'react-native';
import { Ride } from '../../types';
import RideCard from './RideCard';

interface Props {
    rides: Ride[];
    loading: boolean;
    searched: boolean;
    onSelectRide: (ride: Ride) => void;
    onRefresh: () => void;
}

const RideList: React.FC<Props> = ({
    rides,
    loading,
    searched,
    onSelectRide,
    onRefresh,
}) => {
    // Stable renderItem/keyExtractor so the memoized RideCard rows don't
    // re-render when RideList re-renders with the same data.
    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<Ride>) => (
            <RideCard ride={item} onPress={onSelectRide} />
        ),
        [onSelectRide]
    );

    const keyExtractor = useCallback((item: Ride) => String(item.id), []);

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
        // Differentiate "no search yet" from "searched but empty".
        return (
            <View className="flex-1 items-center justify-center py-12">
                <Text style={{ fontSize: 40 }}>🌿</Text>
                <Text className="scheme:text-textPrimary font-semibold text-base mt-3">
                    {searched ? 'No rides available' : 'Where to?'}
                </Text>
                <Text className="scheme:text-textSecondary text-sm mt-1">
                    {searched
                        ? 'Pull down to refresh'
                        : 'Enter a destination to see available rides'}
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={rides}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
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

export default React.memo(RideList);
