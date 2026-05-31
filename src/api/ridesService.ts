import axiosInstance from './axiosInstance';
import { Ride } from '../types';

export const getRides = async (): Promise<Ride[]> => {
    const response = await axiosInstance.get<Ride[]>('/rides');
    return response.data;
};

export const getRideById = async (id: number): Promise<Ride> => {
    const response = await axiosInstance.get<Ride>(`/rides/${id}`);
    return response.data;
};
