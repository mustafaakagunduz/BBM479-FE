// src/types/index.ts

export interface Profession {
    id: number;
    name: string;
    industryId: number;
    industryName: string;
    requiredSkills: RequiredSkill[];
}

export interface RequiredSkill {
    id: number;
    skillId: number;
    skillName: string;
    requiredLevel: number;
}

export interface Industry {
    id: number;
    name: string;
}

export interface Skill {
    id: number;
    name: string;
}
export interface Option {
    id?: number;
    level: number;
    description: string;
}
export interface Question {
    id?: number;
    text: string;
    skillId: number;
    options: Option[];
}

export interface Survey {
    id?: number;
    userId: number;
    title: string;
    industryId: number;
    selectedProfessions: number[];
    questions: Question[];
}
 

export interface QuestionResponse {
    questionId: number;
    optionId: number;
    selectedLevel: number;
}

export interface SurveyResponse {
    userId: number;
    surveyId: number;
    responses: QuestionResponse[];
}