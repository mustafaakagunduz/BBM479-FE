// services/ProfessionApi.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

export const professionApi = {
    // Mevcut metodlar
    getAllIndustries: () => axios.get(`${BASE_URL}/industries`),

    getSkillsByIndustry: (industryId: number) =>
        axios.get(`${BASE_URL}/skills/industry/${industryId}`),

    createProfession: (professionData: {
        name: string;
        industryId: number;
        requiredSkills: {
            skillId: number;
            requiredLevel: number;
        }[];
    }) => axios.post(`${BASE_URL}/professions`, professionData),

    // Yeni eklenen metodlar
    getAllProfessions: () =>
        axios.get(`${BASE_URL}/professions`),

    getProfessionById: (id: number) =>
        axios.get(`${BASE_URL}/professions/${id}`),

    updateProfession: (id: number, professionData: {
        name: string;
        industryId: number;
        requiredSkills: {
            skillId: number;
            requiredLevel: number;
        }[];
    }) => axios.put(`${BASE_URL}/professions/${id}`, professionData),

    deleteProfession: async (id: number) => {
        try {
            const response = await axios.delete(`http://localhost:8081/api/professions/${id}`);
            return { success: true };
        } catch (error: any) {
            console.log('API Error:', {
                error: error,
                response: error.response,
                data: error.response?.data
            });

            // Anket ile ilişkili profession silinmeye çalışıldığında
            const errorMessage = error.response?.data?.toString() || '';
            if (errorMessage.includes('bir anket ile ilişkili')) {
                return {
                    success: false,
                    error: {
                        type: 'SURVEY_REFERENCE_ERROR',
                        message: 'This profession cannot be deleted because it is associated with a survey registered in the system.'
                    }
                };
            }

            // Diğer hatalar için
            return {
                success: false,
                error: {
                    type: 'GENERAL_ERROR',
                    message: 'An error occurred while deleting the profession'
                }
            };
        }
    }

};