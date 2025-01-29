export interface Option {
    id: number;
    level: number;
    description: string;
  }
  
  export interface Question {
    id: number;
    text: string;  // HTML içerik olarak gelecek
    options: Option[];
    skillId: number;
  }
  
  export interface Survey {
    id: number;
    title: string;
    userId: number;
    industryId: number;
    questions: Question[];
    selectedProfessions: number[];
  }