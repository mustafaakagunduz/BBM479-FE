import axios from 'axios';
import { Industry, Skill, Profession, Survey, Question, Option } from '../types/index';

const API_URL = 'http://localhost:8081/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const surveyService = {

    updateSurvey: (id: number, survey: any) =>
        axiosInstance.put<Survey>(`/surveys/${id}`, survey),

    // Industry endpoints
    getIndustries: () => 
        axiosInstance.get<Industry[]>('/industries'),

    // Skills endpoints
    getSkillsByIndustry: (industryId: number) => 
        axiosInstance.get<Skill[]>(`/skills/industry/${industryId}`),

    // Professions endpoints
    getProfessions: () => 
        axiosInstance.get<Profession[]>('/professions'),

    getProfessionsByIndustry: (industryId: number) => 
        axiosInstance.get<Profession[]>(`/professions/industry/${industryId}`),

    // Survey endpoints
    createSurvey: (survey: Survey) => 
        axiosInstance.post<Survey>('/surveys', survey),

    getSurveyById: (id: number) => 
        axiosInstance.get<Survey>(`/surveys/${id}`),

    // Questions endpoints
    createQuestion: (surveyId: number, question: Question) =>
        axiosInstance.post<Question>(`/surveys/${surveyId}/questions`, question),

    // Options endpoints
    createOption: (questionId: number, option: Option) =>
        axiosInstance.post<Option>(`/questions/${questionId}/options`, option)
};

export type { Industry, Skill, Profession, Survey, Question, Option };