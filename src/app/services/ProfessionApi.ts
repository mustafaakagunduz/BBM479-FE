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
            const response = await axios.delete(`${BASE_URL}/professions/${id}`);
            return response;
        } catch (error: any) {
            if (error.response?.status === 500) {
                throw new Error('Profession cannot be deleted. It might be referenced by other entities.');
            }
            throw new Error('An error occurred while deleting the profession.');
        }
    }
};