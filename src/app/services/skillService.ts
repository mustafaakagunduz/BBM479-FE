// services/skillService.ts
import axios from 'axios';
import API_URLS from '../../config/apiConfig';

export interface Skill {
    id: number;
    name: string;
    industryId: number;
    industryName: string;
}

interface DeleteResponse {
    success: boolean;
    error?: {
        type: string;
        message: string;
    };
}

export const skillService = {
    getAllSkills: async (): Promise<Skill[]> => {
        const response = await axios.get(API_URLS.skills);
        return response.data;
    },

    getSkillsByIndustry: async (industryId: number): Promise<Skill[]> => {
        const response = await axios.get(`${API_URLS.skills}/industry/${industryId}`);
        return response.data;
    },

    createSkill: async (skill: Omit<Skill, 'id' | 'industryName'>): Promise<Skill> => {
        const response = await axios.post(API_URLS.skills, skill);
        return response.data;
    },

    updateSkill: async (id: number, skill: Omit<Skill, 'id' | 'industryName'>): Promise<Skill> => {
        const response = await axios.put(`${API_URLS.skills}/${id}`, skill);
        return response.data;
    },

    deleteSkill: async (id: number): Promise<DeleteResponse> => {
        try {
            await axios.delete(`${API_URLS.skills}/${id}`);
            return { success: true };
        } catch (error: any) {
            console.log('API Error:', {
                error: error,
                response: error.response,
                data: error.response?.data
            });

            const errorMessage = error.response?.data?.toString() || '';

            // Meslek ile ilişkili skill silinmeye çalışıldığında
            if (errorMessage.includes('bir meslek ile ilişkili')) {
                return {
                    success: false,
                    error: {
                        type: 'PROFESSION_REFERENCE_ERROR',
                        message: 'This skill cannot be deleted because it is associated with a profession registered in the system.'
                    }
                };
            }

            // Survey ile ilişkili veya diğer kısıtlama hataları için
            if (error.response?.status === 500 &&
                (errorMessage.includes('foreign key constraint') ||
                    errorMessage.includes('skill_match'))) {
                return {
                    success: false,
                    error: {
                        type: 'REFERENCE_ERROR',
                        message: 'This skill cannot be deleted because it is associated with a survey registered in the system.'
                    }
                };
            }

            // Diğer hatalar için
            return {
                success: false,
                error: {
                    type: 'GENERAL_ERROR',
                    message: 'An error occurred while deleting the skill'
                }
            };
        }
    }
};