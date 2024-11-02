// src/services/skillService.ts
import axios from 'axios';
import API_URLS from '../../config/apiConfig';

export interface Skill {
    id: number;
    name: string;
    industryId: number;
    industryName: string;
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

    deleteSkill: async (id: number): Promise<void> => {
        await axios.delete(`${API_URLS.skills}/${id}`);
    }
};
