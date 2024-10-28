import axios from 'axios';

const API_URL = 'http://localhost:8081/api/surveys'; // Arka uç URL'sini buraya koyun

export const createSurvey = async (surveyData) => {
  try {
    const response = await axios.post(API_URL, surveyData);
    return response.data; // Başarılı yanıtı döndür
  } catch (error) {
    console.error('Error creating survey:', error);
    throw error; // Hata durumunda hata fırlat
  }
};
