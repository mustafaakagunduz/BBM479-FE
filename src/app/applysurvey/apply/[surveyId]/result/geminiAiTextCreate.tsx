// GeminiAnalysisSection.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    AlertCircle,
    CheckCircle2,
    BookOpen,
    Target,
    Lightbulb,
    ArrowUpRight
} from "lucide-react";
import AnalysisPDFExport from "./AnalysisPDFExport";

const BACKEND_API_BASE = "http://localhost:8081/api";
// OpenAI API Key
const OPENAI_API_KEY = "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";

// Interfaces
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

interface GeminiAnalysisSectionProps {
    surveyResultId: number;
    professionMatches: ProfessionMatch[];
}

type TabType = "overview" | "recommendations" | "details";

// Yardımcı fonksiyonlar
function cleanMarkdownFormatting(text: string): string {
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1')     // Remove italic
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Remove links
        .replace(/#{1,6}\s?/g, '')      // Remove headings
        .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Remove code blocks
        .replace(/~~(.*?)~~/g, '$1')    // Remove strikethrough
        .trim();
}

function parseRecommendation(text: string): { title: string | null; content: string } {
    // Check for "**Title:**" pattern
    const titlePattern = /^\*\*([^:]+):\*\*/;
    const match = text.match(titlePattern);

    if (match) {
        // Extract the title and clean the content
        const title = match[1].trim();
        const content = text.replace(titlePattern, '').trim();
        return { title, content };
    } else {
        // Clean regular recommendations without the title pattern
        const cleanedText = text
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1')     // Remove italic
            .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Remove links
            .replace(/#{1,6}\s?/g, '')      // Remove headings
            .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Remove code blocks
            .replace(/~~(.*?)~~/g, '$1')    // Remove strikethrough
            .trim();
        return { title: null, content: cleanedText };
    }
}

function extractRecommendations(text: string): string[] {
    const recommendations: string[] = [];
    const devPlanMatch = text.match(/DEVELOPMENT PLAN([\s\S]*?)(?=CAREER PATH|$)/i);
    const careerPathMatch = text.match(/CAREER PATH([\s\S]*?)(?=$)/i);

    let combinedText = "";
    if (devPlanMatch?.[1]) combinedText += devPlanMatch[1];
    if (careerPathMatch?.[1]) combinedText += careerPathMatch[1];

    const lines = combinedText.split("\n");
    let currentRecommendation = "";

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.toUpperCase() === trimmedLine) {
            if (currentRecommendation) {
                recommendations.push(cleanMarkdownFormatting(currentRecommendation.trim()));
                currentRecommendation = "";
            }
            continue;
        }

        const listItemMatch = trimmedLine.match(/^(\d+\.|[•\-\*>]|\(\d+\))\s*(.+)$/);
        if (listItemMatch) {
            if (currentRecommendation) recommendations.push(cleanMarkdownFormatting(currentRecommendation.trim()));
            currentRecommendation = listItemMatch[2];
        } else if (trimmedLine.length > 5) {
            if (currentRecommendation) currentRecommendation += " " + trimmedLine;
        }
    }

    if (currentRecommendation) recommendations.push(cleanMarkdownFormatting(currentRecommendation.trim()));

    return recommendations
        .map((rec) => rec.trim())
        .filter(
            (rec) =>
                rec.length > 10 &&
                !rec.toUpperCase().includes("INTRODUCTION") &&
                !rec.toUpperCase().includes("ANALYSIS") &&
                !rec.toUpperCase().includes("CAREER PATH") &&
                !rec.toUpperCase().includes("DEVELOPMENT PLAN")
        )
        .filter((rec, index, self) => self.indexOf(rec) === index);
}

// OpenAI ile analiz yapma fonksiyonu
const analyzeWithOpenAI = async (professionMatches: ProfessionMatch[]): Promise<string> => {
    try {
        const surveyData = professionMatches.map((match) => ({
            profession: match.professionName,
            matchPercentage: match.matchPercentage
        }));

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a career counselor analyzing test results. Provide a professional report analyzing the survey results."
                    },
                    {
                        role: "user",
                        content: `Please prepare a professional report analyzing the following career test results in English.
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
              
              Use professional tone and structure with clear formatting.`
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to generate analysis with OpenAI');
    }
};

// Main analysis logic
const analyzeSurveyWithAI = async (
    surveyResultId: number,
    professionMatches: ProfessionMatch[]
): Promise<GeminiAnalysis> => {
    try {
        // Önce mevcut analizi kontrol et
        try {
            const existing = await axios.get<GeminiAnalysis>(
                `${BACKEND_API_BASE}/surveys/results/${surveyResultId}/analysis`
            );
            if (existing.data) return existing.data;
        } catch {
            console.log("Mevcut analiz bulunamadı, yeni analiz yapılacak");
        }

        // OpenAI ile analiz yap
        const text = await analyzeWithOpenAI(professionMatches);

        // Önerileri çıkar
        const recommendations = extractRecommendations(text);

        // Analiz verisini hazırla
        const analysisData: GeminiAnalysis = {
            analysisText: text,
            recommendations: recommendations
        };

        // Backend API hatası durumunda retry mekanizması
        const saveWithRetry = async (retryCount = 0): Promise<GeminiAnalysis> => {
            try {
                const saved = await axios.post<GeminiAnalysis>(
                    `${BACKEND_API_BASE}/surveys/${surveyResultId}/results/${surveyResultId}/analysis`,
                    analysisData
                );
                return saved.data;
            } catch (error) {
                console.error(`Kaydetme hatası (deneme ${retryCount + 1}/3):`, error);

                if (retryCount < 2) {
                    console.log(`${retryCount + 1}. deneme başarısız, tekrar deneniyor...`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekle
                    return saveWithRetry(retryCount + 1);
                }

                // Tüm denemeler başarısız olursa yine de analiz sonucunu döndür
                console.log("Tüm kaydetme denemeleri başarısız oldu. Veritabanına kaydedilmemiş analiz sonucu döndürülüyor.");
                return analysisData;
            }
        };

        return await saveWithRetry();
    } catch (error) {
        console.error("Analiz hatası:", error);
        throw new Error("Analiz yapılırken bir hata oluştu");
    }
};

// Component
const GeminiAnalysisSection: React.FC<GeminiAnalysisSectionProps> = ({
                                                                         surveyResultId,
                                                                         professionMatches
                                                                     }) => {
    const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>("overview");

    useEffect(() => {
        const fetchExistingAnalysis = async () => {
            try {
                const response = await axios.get<GeminiAnalysis>(
                    `${BACKEND_API_BASE}/surveys/results/${surveyResultId}/analysis`
                );
                if (response.data) setAnalysis(response.data);
            } catch {
                console.log("Mevcut analiz bulunamadı");
            }
        };

        fetchExistingAnalysis();
    }, [surveyResultId]);

    const handleAnalysisRequest = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await analyzeSurveyWithAI(surveyResultId, professionMatches);
            setAnalysis(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Analiz yapılırken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const formatAnalysisText = (text: string) => {
        return text
            .replace(/[*#]/g, '') // Clear special characters for clean formatting
            .replace(/p\d+/g, (match) => { // Match and replace profession codes with names
                const professionMatch = professionMatches.find(p =>
                    p.professionName.toLowerCase().includes(match.toLowerCase()));
                return professionMatch ? `✅ ${professionMatch.professionName} 🎯` : match; // Profession result short & clear
            })
            .replace(/error|fail/gi, '⚠️ Oops! Something went wrong.') // Modern, simple error messages
            .replace(/success/gi, '🎉 Success! All good.') // Add a positive success message
            .trim();
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
                    <Button onClick={handleAnalysisRequest} className="mt-4">
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
                                    analysis.recommendations.map((rec, index) => {
                                        const { title, content } = parseRecommendation(rec);
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                                                    <ArrowUpRight className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    {title ? (
                                                        <p className="text-gray-700 leading-relaxed">
                                                            <span className="font-semibold text-gray-900">{title}:</span> {content}
                                                        </p>
                                                    ) : (
                                                        <p className="text-gray-700 leading-relaxed">{content}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
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
                                            // Normal paragraflarrr
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