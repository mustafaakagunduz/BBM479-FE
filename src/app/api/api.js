import axiosInstance from "@/utils/axiosInstance";

export const createSurvey = async (surveyData) => {
  try {
    const response = await axiosInstance.post('/api/surveys', surveyData);
    return response.data; // Başarılı yanıtı döndür
  } catch (error) {
    console.error('Error creating survey:', error);
    throw error; // Hata durumunda hata fırlat
  }
};