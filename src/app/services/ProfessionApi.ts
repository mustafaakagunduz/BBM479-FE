// services/ProfessionApi.ts
import axiosInstance from "@/utils/axiosInstance";

export const professionApi = {
    // Mevcut metodlar
    getAllIndustries: () => axiosInstance.get('/api/industries'),

    getSkillsByIndustry: (industryId: number) =>
        axiosInstance.get(`/api/skills/industry/${industryId}`),

    createProfession: (professionData: {
        name: string;
        industryId: number;
        requiredSkills: {
            skillId: number;
            requiredLevel: number;
        }[];
    }) => axiosInstance.post('/api/professions', professionData),

    // Yeni eklenen metodlar
    getAllProfessions: () =>
        axiosInstance.get('/api/professions'),

    getProfessionById: (id: number) =>
        axiosInstance.get(`/api/professions/${id}`),

    updateProfession: (id: number, professionData: {
        name: string;
        industryId: number;
        requiredSkills: {
            skillId: number;
            requiredLevel: number;
        }[];
    }) => axiosInstance.put(`/api/professions/${id}`, professionData),

    deleteProfession: async (id: number) => {
        try {
            const response = await axiosInstance.delete(`/api/professions/${id}`);
            return { success: true };
        } catch (error: any) {
            console.log('API Error:', {
                error: error,
                response: error.response,
                data: error.response?.data
            });

            // Anket ile ilişkili profession silinmeye çalışıldığında
            const errorMessage = error.response?.data?.toString() || '';
            if (errorMessage.includes('bir anket ile ilişkili')) {
                return {
                    success: false,
                    error: {
                        type: 'SURVEY_REFERENCE_ERROR',
                        message: 'This profession cannot be deleted because it is associated with a survey registered in the system.'
                    }
                };
            }

            // Diğer hatalar için
            return {
                success: false,
                error: {
                    type: 'GENERAL_ERROR',
                    message: 'An error occurred while deleting the profession'
                }
            };
        }
    }
};