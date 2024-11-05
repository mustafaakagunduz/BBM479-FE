// types/survey.ts
export interface Option {
    id: number;
    level: number;
    description: string;
}

export interface Question {
    id: number;
    text: string;
    skillId: number;
    options: Option[];
}

export interface Survey {
    id: number;
    userId?: number;  // optional
    title: string;
    industryId?: number;  // optional
    selectedProfessions?: number[];  // optional
    questions?: Question[];  // optional
}