import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, BookOpen, Target, Lightbulb, ArrowUpRight } from 'lucide-react';
import AnalysisPDFExport from './AnalysisPDFExport';

const BACKEND_API_BASE = 'http://localhost:8081/api';
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

function extractRecommendations(text: string): string[] {
    const recommendations: string[] = [];
    
    // Find Development Plan and Career Path sections
    const devPlanMatch = text.match(/DEVELOPMENT PLAN([\s\S]*?)(?=CAREER PATH|$)/i);
    const careerPathMatch = text.match(/CAREER PATH([\s\S]*?)(?=$)/i);
    
    let combinedText = '';
    if (devPlanMatch && devPlanMatch[1]) combinedText += devPlanMatch[1];
    if (careerPathMatch && careerPathMatch[1]) combinedText += careerPathMatch[1];

    // Split into lines and process
    const lines = combinedText.split('\n');
    let currentRecommendation = '';

    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip empty lines and section headers
        if (!trimmedLine || trimmedLine.toUpperCase() === trimmedLine) {
            if (currentRecommendation) {
                recommendations.push(currentRecommendation.trim());
                currentRecommendation = '';
            }
            continue;
        }

        // Check for numbered or bulleted items
        const listItemMatch = trimmedLine.match(/^(\d+\.|[•\-\*>]|\(\d+\))\s*(.+)$/);
        
        if (listItemMatch) {
            if (currentRecommendation) {
                recommendations.push(currentRecommendation.trim());
            }
            currentRecommendation = listItemMatch[2];
        } else if (trimmedLine.length > 5) {
            // Continue previous recommendation if it exists
            if (currentRecommendation) {
                currentRecommendation += ' ' + trimmedLine;
            }
        }
    }

    // Add the last recommendation if exists
    if (currentRecommendation) {
        recommendations.push(currentRecommendation.trim());
    }

    // Clean and filter recommendations
    return recommendations
        .map(rec => rec.trim())
        .filter(rec => 
            rec.length > 10 && // Remove very short items
            !rec.toUpperCase().includes('INTRODUCTION') &&
            !rec.toUpperCase().includes('ANALYSIS') &&
            !rec.toUpperCase().includes('CAREER PATH') &&
            !rec.toUpperCase().includes('DEVELOPMENT PLAN')
        )
        .filter((rec, index, self) => self.indexOf(rec) === index); // Remove duplicates
}

const analyzeSurveyWithGemini = async (
    surveyResultId: number, 
    professionMatches: ProfessionMatch[]
): Promise<GeminiAnalysis> => {
    try {
        const existingAnalysisResponse = await axios.get<GeminiAnalysis>(
            `${BACKEND_API_BASE}/surveys/results/${surveyResultId}/analysis`
        );
        
        if (existingAnalysisResponse.data) {
            return existingAnalysisResponse.data;
        }
    } catch (error) {
        console.log('Mevcut analiz bulunamadı, yeni analiz yapılacak');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const surveyData = professionMatches.map(match => ({
        meslek: match.professionName,
        uyumOrani: match.matchPercentage
    }));

    const prompt = `
    Please prepare a professional report analyzing the following career test results in English.
    Test results:
    ${JSON.stringify(surveyData, null, 2)}

    Please analyze under the following sections:

    INTRODUCTION
    - General evaluation of test results
    - Notable strengths

    CAREER ANALYSIS
    - Top three professions and compatibility percentages
    - For each profession:
      1. Why it's suitable
      2. Required skills
      3. Opportunities offered
      4. Areas for development

    DEVELOPMENT PLAN
    1. Current strong abilities
    2. Areas for improvement
    3. Recommended steps:
      - Educational recommendations
      - Certificate programs
      - Practical development methods

    CAREER PATH
    1. Short-term goals (0-1 year)
    2. Medium-term goals (1-3 years)
    3. Long-term goals (3+ years)
    
    Writing format:
    - Write each section in clear paragraphs
    - Use numbering for lists (1., 2., 3., etc.)
    - Include specific recommendations in the Development Plan and Career Path sections
    - Keep responses concise but informative
    - Use a professional tone
    - Format headings in UPPERCASE
`;



    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const analysisData: GeminiAnalysis = {
            analysisText: text,
            recommendations: extractRecommendations(text)
        };

        const savedAnalysisResponse = await axios.post<GeminiAnalysis>(
            `${BACKEND_API_BASE}/surveys/${surveyResultId}/results/${surveyResultId}/analysis`,
            analysisData
        );

        return savedAnalysisResponse.data;
    } catch (error) {
        console.error('Analiz hatası:', error);
        throw new Error('Analiz yapılırken bir hata oluştu');
    }
};

interface GeminiAnalysisSectionProps {
    surveyResultId: number;
    professionMatches: ProfessionMatch[];
}

type TabType = 'overview' | 'recommendations' | 'details';

const GeminiAnalysisSection: React.FC<GeminiAnalysisSectionProps> = ({ surveyResultId, professionMatches }) => {
    const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    useEffect(() => {
        const fetchExistingAnalysis = async () => {
            try {
                const response = await axios.get<GeminiAnalysis>(
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
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Analiz yapılırken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (error) {
            return (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <h3 className="text-red-800 font-semibold">Hata</h3>
                    </div>
                    <p className="text-red-600 mt-1">{error}</p>
                </div>
            );
        }

        if (!analysis && !loading) {
            return (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-700">AI Analysis Not Ready</h3>
                    <p className="text-gray-500 text-center max-w-md">
                        Start an analysis to see a detailed analysis of your skill test results.
                    </p>
                    <Button 
                        onClick={handleAnalysisRequest}
                        className="mt-4"
                    >
                        <Target className="mr-2 h-4 w-4" />
                        Request AI Analysis
                    </Button>
                </div>
            );
        }

        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Your AI analysis is being prepared...</p>
                </div>
            );
        }
      
        function formatAnalysisText(analysisText: string) {
            return analysisText
                .replace(/[*#]/g, '') // Clear special characters for clean formatting
                .replace(/p\d+/g, (match) => { // Match and replace profession codes with names
                    const professionMatch = professionMatches.find(p => 
                        p.professionName.toLowerCase().includes(match.toLowerCase()));
                    return professionMatch ? `✅ ${professionMatch.professionName} 🎯` : match; // Profession result short & clear
                })
                .replace(/error|fail/gi, '⚠️ Oops! Something went wrong.') // Modern, simple error messages
                .replace(/success/gi, '🎉 Success! All good.') // Add a positive success message
                .trim();
        }
        
        return (
            <div className="space-y-6">
                {/* Tab Buttons */}
                <div className="flex space-x-2 border-b border-gray-200">
                    {[
                        { id: 'overview' as TabType, label: 'Overview' },
                        { id: 'recommendations' as TabType, label: 'Suggestions' },
                        { id: 'details' as TabType, label: 'Detailed Analysis' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 font-medium text-sm transition-colors duration-200
                                ${activeTab === tab.id 
                                    ? 'text-blue-600 border-b-2 border-blue-600' 
                                    : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Contents */}
                <div className="mt-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                                    <p className="text-green-800">Analysis Completed</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center mb-4">
                                    <Target className="h-5 w-5 text-blue-600 mr-2" />
                                    <h3 className="text-lg font-semibold">Most Compatible Professions</h3>
                                </div>
                                <div className="space-y-3">
                                    {professionMatches
                                        .sort((a, b) => b.matchPercentage - a.matchPercentage)
                                        .slice(0, 3)
                                        .map((match, index) => (
                                            <div 
                                                key={index} 
                                                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                                            >
                                                <span className="font-medium">{match.professionName}</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium
                                                    ${index === 0 
                                                        ? 'bg-blue-100 text-blue-800' 
                                                        : 'bg-gray-200 text-gray-700'}`}>
                                                    {match.matchPercentage.toFixed(1)}% Compatible
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}
            {activeTab === 'recommendations' && analysis && analysis.recommendations && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-6">
                        <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                        <h3 className="text-lg font-semibold">Career Recommendations</h3>
                    </div>
                    <div className="space-y-4">
                        {Array.isArray(analysis.recommendations) && analysis.recommendations.length > 0 ? (
                            analysis.recommendations.map((rec, index) => (
                                <div 
                                    key={index}
                                    className="flex items-start p-4 bg-gray-50 rounded-lg"
                                >
                                    <ArrowUpRight className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                                    <p className="text-gray-700">{rec}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 text-center py-4">
                                No recommendations found
                            </div>
                        )}
                    </div>
                </div>
            )}
{activeTab === 'details' && analysis && (
    <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Kariyer Analiz Raporu
                </h1>
                <div className="h-1 w-20 bg-blue-500 rounded"></div>
            </div>
            <AnalysisPDFExport 
                    analysis={analysis}
                    professionMatches={professionMatches}
                />
            
        <div className="prose max-w-none">
    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
        {analysis && formatAnalysisText(analysis.analysisText).split('\n\n').map((paragraph, index) => {
            // Başlıkları tespit et
            if (paragraph.toUpperCase() === paragraph && paragraph.length > 3) {
                return (
                    <h2 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-4">
                        {paragraph}
                    </h2>
                );
            }
            // Normal paragraflar
            return (
                <p key={index} className="mb-4 text-gray-700">
                    {paragraph}
                </p>
            );
        })}
    </div>
</div>
        </div>
    </div>
)}
                </div>
            </div>
        );
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    AI Analysis
                </CardTitle>
            </CardHeader>
            <CardContent>
                {renderContent()}
                
                {analysis?.updatedAt && (
                    <div className="text-sm text-gray-500 mt-4 text-right">
                        Last Update: {new Date(analysis.updatedAt).toLocaleDateString('tr-TR')}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export { GeminiAnalysisSection };