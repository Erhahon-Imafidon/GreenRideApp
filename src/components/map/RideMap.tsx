import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface Props {
    userLocation?: Coordinate;
    destination?: Coordinate;
    style?: object;
}

const DEFAULT_REGION = {
    latitude: 51.5074,
    longitude: -0.1278,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

const RideMap: React.FC<Props> = ({ userLocation, destination, style }) => {
    const region = userLocation
        ? {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
          }
        : DEFAULT_REGION;

    return (
        <View style={[styles.container, style]}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                showsUserLocation
                showsMyLocationButton={false}
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
