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