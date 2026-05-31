import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import RideCard from '../../components/home/RideCard';
import { Ride } from '../../types';

const mockElectricRide: Ride = {
    id: 1,
    vehicleType: 'Electric',
    eta: '3 mins',
    price: 7.5,
    co2Saved: 1.4,
};

const mockHybridRide: Ride = {
    id: 2,
    vehicleType: 'Hybrid',
    eta: '4 mins',
    price: 6.8,
    co2Saved: 0.8,
};

jest.mock('../../components/common/StatusBadge', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return ({ vehicleType }: { vehicleType: string }) => (
        <Text testID="status-badge">{vehicleType}</Text>
    );
});

describe('RideCard', () => {
    it('renders electric ride with correct vehicle type, price, and CO₂ savings', () => {
        render(<RideCard ride={mockElectricRide} onPress={jest.fn()} />);

        // getAllByText because the vehicle type appears in both the RideCard Text and the mocked StatusBadge
        expect(screen.getAllByText('Electric').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('$7.50')).toBeTruthy();
        expect(screen.getByText('🌱 Saves 1.4 kg CO₂')).toBeTruthy();
        expect(screen.getByText('3 mins away')).toBeTruthy();
    });

    it('renders hybrid ride with correct vehicle type and price', () => {
        render(<RideCard ride={mockHybridRide} onPress={jest.fn()} />);

        // getAllByText because the vehicle type appears in both the RideCard Text and the mocked StatusBadge
        expect(screen.getAllByText('Hybrid').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('$6.80')).toBeTruthy();
        expect(screen.getByText('🌱 Saves 0.8 kg CO₂')).toBeTruthy();
    });

    it('calls onPress with the ride when tapped', () => {
        const onPressMock = jest.fn();
        render(<RideCard ride={mockElectricRide} onPress={onPressMock} />);

        fireEvent.press(screen.getByRole('button'));
        expect(onPressMock).toHaveBeenCalledWith(mockElectricRide);
    });
});
