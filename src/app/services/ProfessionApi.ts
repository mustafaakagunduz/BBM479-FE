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
            return response.data;
        } catch (error: any) {
            console.log('API Error:', {
                error: error,
                response: error.response,
                data: error.response?.data
            });

            // Eğer error constraint violation içeriyorsa
            if (error.response?.status === 500 ||
                error.response?.data?.toString().includes('foreign key constraint') ||
                error.response?.data?.toString().includes('profession_match')) {
                throw { type: 'REFERENCE_ERROR' };  // Özel bir hata objesi fırlatıyoruz
            }
            throw error;
        }
    }
};