import { Industry, Skill, Profession, Survey, Question, Option } from '../types/index';
import axiosInstance from "@/utils/axiosInstance";

export const surveyService = {

    updateSurvey: (id: number, survey: any) =>
        axiosInstance.put<Survey>(`/api/surveys/${id}`, survey),

    // Industry endpoints
    getIndustries: () =>
        axiosInstance.get<Industry[]>('/api/industries'),

    // Skills endpoints
    getSkillsByIndustry: (industryId: number) =>
        axiosInstance.get<Skill[]>(`/api/skills/industry/${industryId}`),

    // Professions endpoints
    getProfessions: () =>
        axiosInstance.get<Profession[]>('/api/professions'),

    getProfessionsByIndustry: (industryId: number) =>
        axiosInstance.get<Profession[]>(`/api/professions/industry/${industryId}`),

    // Survey endpoints
    createSurvey: (survey: Survey) =>
        axiosInstance.post<Survey>('/api/surveys', survey),

    getSurveyById: (id: number) =>
        axiosInstance.get<Survey>(`/api/surveys/${id}`),

    // Questions endpoints
    createQuestion: (surveyId: number, question: Question) =>
        axiosInstance.post<Question>(`/api/surveys/${surveyId}/questions`, question),

    // Options endpoints
    createOption: (questionId: number, option: Option) =>
        axiosInstance.post<Option>(`/api/questions/${questionId}/options`, option)
};

export type { Industry, Skill, Profession, Survey, Question, Option };