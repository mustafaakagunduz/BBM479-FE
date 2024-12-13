'use client';

import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

// Backend API URL'i
const BACKEND_API_BASE = 'http://localhost:8081/api'; // Backend URL'inizi buraya yazın
const GEMINI_API_KEY = 'AIzaSyDqPkde9-C_QySK4bNGhVM2cung_WGphmE';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface ProfessionMatch {
    id: number;
    professionId: number;
    professionName: string;
    matchPercentage: number;
}

interface GeminiAnalysis {
    id?: number;
    analysisText: string;
    recommendations: string[];
    createdAt?: string;
    updatedAt?: string;
}

// Önerileri metinden ayıklayan fonksiyon
function extractRecommendations(text: string): string[] {
    return text.split('\n')
        .filter(line => line.includes('•') || line.includes('-') || line.includes('.'))
        .map(line => line.replace(/^[•\-\d.]\s*/, '').trim())
        .filter(line => line.length > 0);
}

async function analyzeSurveyWithGemini(surveyResultId: number, professionMatches: ProfessionMatch[]): Promise<GeminiAnalysis> {
    try {
        // Önce mevcut analizi kontrol et
        const existingAnalysisResponse = await axios.get(
            `${BACKEND_API_BASE}/surveys/results/${surveyResultId}/analysis`
        );
        
        if (existingAnalysisResponse.data) {
            return existingAnalysisResponse.data;
        }
    } catch (error) {
        // Mevcut analiz yok, yeni analiz yap
        console.log('Mevcut analiz bulunamadı, yeni analiz yapılacak');
    }

    // Gemini API ile yeni analiz yap
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const surveyData = professionMatches.map(match => ({
        meslek: match.professionName,
        uyumOrani: match.matchPercentage
    }));

    const prompt = `
        Aşağıdaki kariyer yetenek testi sonuçlarını analiz et ve Türkçe detaylı bir rapor hazırla.
        Test sonuçları:
        ${JSON.stringify(surveyData, null, 2)}

        Lütfen şunları içeren bir analiz yap:
        1. En uyumlu 3 mesleği ve neden uyumlu olduklarını açıkla
        2. Bu mesleklerde başarılı olmak için geliştirilebilecek yetenekler
        3. Kariyer gelişimi için öneriler
        4. Eğitim tavsiyeleri
        
        Yanıtını profesyonel ve motive edici bir tonda ver.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const analysisData = {
            analysisText: text,
            recommendations: extractRecommendations(text)
        };

        // Analizi backend'e kaydet
        const savedAnalysisResponse = await axios.post(
            `${BACKEND_API_BASE}/surveys/${surveyResultId}/results/${surveyResultId}/analysis`,
            analysisData
        );

        return savedAnalysisResponse.data;
    } catch (error) {
        console.error('Analiz hatası:', error);
        throw new Error('Analiz yapılırken bir hata oluştu');
    }
}

const GeminiAnalysisSection: React.FC<{ 
    surveyResultId: number;
    professionMatches: ProfessionMatch[] 
}> = ({ surveyResultId, professionMatches }) => {
    const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExistingAnalysis = async () => {
            try {
                const response = await axios.get(
                    `${BACKEND_API_BASE}/surveys/results/${surveyResultId}/analysis`
                );
                if (response.data) {
                    setAnalysis(response.data);
                }
            } catch (error) {
                console.log('Mevcut analiz bulunamadı');
            }
        };

        fetchExistingAnalysis();
    }, [surveyResultId]);

    const handleAnalysisRequest = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await analyzeSurveyWithGemini(surveyResultId, professionMatches);
            setAnalysis(result);
        } catch (error: any) {
            setError(error.message || 'Analiz yapılırken bir hata oluştu');
            console.error('Analiz hatası:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Yapay Zeka Analizi</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="text-red-500 mb-4">
                        {error}
                    </div>
                )}
                
                {!analysis && !loading && (
                    <Button onClick={handleAnalysisRequest}>
                        Yapay Zeka Analizi İste
                    </Button>
                )}



                {loading && (
                    <div className="flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Analiz yapılıyor...</span>
                    </div>
                )}

                {analysis && (
                    <div className="space-y-4">
                        <div className="prose max-w-none">
                            <h3 className="text-xl font-semibold mb-3">Detaylı Analiz</h3>
                            <div className="whitespace-pre-wrap">{analysis.analysisText}</div>
                        </div>
                        
                        {analysis.recommendations && analysis.recommendations.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold mb-3">Öneriler</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    {analysis.recommendations.map((rec, index) => (
                                        <li key={index} className="text-gray-700">{rec}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {analysis.updatedAt && (
                            <div className="text-sm text-gray-500 mt-4">
                                Son güncelleme: {new Date(analysis.updatedAt).toLocaleDateString('tr-TR')}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export { GeminiAnalysisSection };