// services/industryService.ts
import axiosInstance from "@/utils/axiosInstance";
import API_URL from '../../config/apiConfig';

export interface Industry {
    id: number;
    name: string;
}


interface DeleteResponse {
    success: boolean;
    error?: {
        type: string;
        message: string;
    };
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

    deleteIndustry: async (id: number): Promise<DeleteResponse> => {
        try {
            await axiosInstance.delete(`${API_URL.industries}/${id}`);
            return { success: true };
        } catch (error: any) {
            console.log('API Error:', {
                error: error,
                response: error.response,
                data: error.response?.data
            });

            const errorMessage = error.response?.data?.toString() || '';

            // Meslek ile ilişkili industry silinmeye çalışıldığında
            if (errorMessage.includes('bir meslek ile ilişkili')) {
                return {
                    success: false,
                    error: {
                        type: 'PROFESSION_REFERENCE_ERROR',
                        message: 'This industry cannot be deleted because it is associated with a profession registered in the system.'
                    }
                };
            }

            // Survey ile ilişkili veya diğer kısıtlama hataları için
            if (error.response?.status === 500 &&
                (errorMessage.includes('foreign key constraint') ||
                    errorMessage.includes('industry_match'))) {
                return {
                    success: false,
                    error: {
                        type: 'REFERENCE_ERROR',
                        message: 'This industry cannot be deleted because it is associated with a survey registered in the system.'
                    }
                };
            }

            // Diğer hatalar için
            return {
                success: false,
                error: {
                    type: 'GENERAL_ERROR',
                    message: 'An error occurred while deleting the industry'
                }
            };
        }
    }
};