    // src/services/industryService.ts
import axiosInstance from "@/utils/axiosInstance";

import API_URL from '../../config/apiConfig';

export interface Industry {
    id: number;
    name: string;
}

export const industryService = {
    getAllIndustries: async (): Promise<Industry[]> => {
        const response = await axiosInstance.get(API_URL.industries);
        return response.data;
    },

    createIndustry: async (industry: Omit<Industry, 'id'>): Promise<Industry> => {
        const response = await axiosInstance.post(API_URL.industries, industry);
        return response.data;
    },

    updateIndustry: async (id: number, industry: Omit<Industry, 'id'>): Promise<Industry> => {
        const response = await axiosInstance.put(`${API_URL.industries}/${id}`, industry);
        return response.data;
    },

    deleteIndustry: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${API_URL.industries}/${id}`);
    }
};