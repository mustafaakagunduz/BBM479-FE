import axios from 'axios';
import { Profession ,Industry,Skill} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
    getAllProfessions: async () => {
        const response = await axios.get<Profession[]>(`${API_BASE_URL}/professions`);
        return response.data;
    },

    getProfessionById: async (id: number) => {
        const response = await axios.get<Profession>(`${API_BASE_URL}/professions/${id}`);
        return response.data;
    },

    createProfession: async (profession: Partial<Profession>) => {
        const response = await axios.post<Profession>(`${API_BASE_URL}/professions`, profession);
        return response.data;
    },

    updateProfession: async (id: number, profession: Partial<Profession>) => {
        const response = await axios.put<Profession>(`${API_BASE_URL}/professions/${id}`, profession);
        return response.data;
    },

    deleteProfession: async (id: number) => {
        await axios.delete(`${API_BASE_URL}/professions/${id}`);
    },

    getAllIndustries: async () => {
        const response = await axios.get<Industry[]>(`${API_BASE_URL}/industries`);
        return response.data;
    },

    getAllSkills: async () => {
        const response = await axios.get<Skill[]>(`${API_BASE_URL}/skills`);
        return response.data;
    }
};