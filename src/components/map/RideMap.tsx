import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, UserLocationChangeEvent } from 'react-native-maps';

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface Props {
    destination?: Coordinate;
    style?: object;
}

const DEFAULT_REGION = {
    latitude: 6.5244,
    longitude: 3.3792,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

const RideMap: React.FC<Props> = ({ destination, style }) => {
    const mapRef = useRef<MapView>(null);
    const [centeredOnUser, setCenteredOnUser] = useState(false);

    const handleUserLocationChange = (event: UserLocationChangeEvent) => {
        if (!centeredOnUser) {
            const coordinate = event.nativeEvent.coordinate;
            if (!coordinate) { return; }
            mapRef.current?.animateToRegion(
                {
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                },
                1000,
            );
            setCenteredOnUser(true);
        }
    };

    useEffect(() => {
        if (destination) {
            mapRef.current?.animateToRegion(
                {
                    ...destination,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                },
                1000,
            );
        }
    }, [destination]);

    return (
        <View style={[styles.container, style]}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={DEFAULT_REGION}
                showsUserLocation
                showsMyLocationButton={false}
                onUserLocationChange={handleUserLocationChange}
                accessibilityLabel="Map showing nearby eco-friendly rides"
            >
                {destination && (
                    <Marker
                        coordinate={destination}
                        title="Destination"
                        pinColor="#1A7A4A"
                        accessibilityLabel="Destination marker"
                    />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { overflow: 'hidden', borderRadius: 0 },
    map: { width: '100%', height: '100%' },
});

export default RideMap;
