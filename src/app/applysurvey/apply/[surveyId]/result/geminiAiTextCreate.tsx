import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, BookOpen, Target, Lightbulb, ArrowUpRight } from 'lucide-react';

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
    
    // Öneriler bölümlerini bul
    const sections: string[] = text.split(/\d+\.\s*/);
    
    // Her bölümü kontrol et
    sections.forEach((section: string) => {
        if (section.includes('Öneriler') || 
            section.includes('tavsiye') || 
            section.includes('öneril') ||
            section.includes('geliştir')) {
            
            // Madde işaretli satırları bul
            const lines = section.split('\n')
                .filter((line: string) => line.trim().match(/^[•\-\*\+]\s*(.+)$/))
                .map((line: string) => line.replace(/^[•\-\*\+]\s*/, '').trim())
                .filter((line: string) => line.length > 0);
                
            recommendations.push(...lines);
        }
    });

    return recommendations;
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
    cevaplar alt alt cümleler olsun ve de kısa olsun
    Aşağıdaki kariyer testi sonuçlarını analiz ederek profesyonel bir rapor hazırla.
    Test sonuçları:
    ${JSON.stringify(surveyData, null, 2)}

    Lütfen aşağıdaki başlıklar altında analiz yap, ancak başlıkları '#' veya '*' gibi özel karakterler KULLANMADAN yaz:

    GİRİŞ
    - Test sonuçlarının genel değerlendirmesi
    - Öne çıkan güçlü yönler

    MESLEK ANALİZİ
    [İlk üç mesleği sıralarken "p1, p2" gibi kodlar yerine tam meslek isimlerini kullan]
    - İlk üç meslek ve uyum yüzdeleri
    - Her meslek için:
      > Neden uygun olduğu
      > Gerektirdiği yetenekler
      > Sunduğu fırsatlar
      > Gelişim alanları

    GELİŞİM PLANI
    - Mevcut güçlü yetenekler
    - Geliştirilebilecek alanlar
    - Önerilen adımlar:
      > Eğitim önerileri
      > Sertifika programları
      > Pratik geliştirme yöntemleri

    KARİYER YOLU
    - Kısa vadeli hedefler (0-1 yıl)
    - Orta vadeli hedefler (1-3 yıl)
    - Uzun vadeli hedefler (3+ yıl)
    
    Her bölümü paragraflar halinde, açık ve anlaşılır bir dille yaz. 
    Özel karakterler (*,#,-) kullanma, bunun yerine numaralandırma ve düz metin kullan.
    Meslek isimlerini "p1, p2" gibi kodlar yerine tam isimleriyle belirt.
    
    Yazım formatı:
    - Profesyonel ve pozitif bir ton kullan
    - Her bölüm için açık başlıklar kullan (kalın veya büyük harflerle)
    - Paragraflar arasında uygun boşluklar bırak
    - Madde işaretleri yerine numaralandırma kullan
    - Önemli noktaları paragraf içinde vurgula
`;

// Ayrıca DetailedAnalysis component'inde çıktıyı düzenleyelim:


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
                    <h3 className="text-lg font-semibold text-gray-700">Yapay Zeka Analizi Hazır Değil</h3>
                    <p className="text-gray-500 text-center max-w-md">
                        Yetenek testi sonuçlarınızın detaylı analizini görmek için analiz başlatın.
                    </p>
                    <Button 
                        onClick={handleAnalysisRequest}
                        className="mt-4"
                    >
                        <Target className="mr-2 h-4 w-4" />
                        Yapay Zeka Analizi İste
                    </Button>
                </div>
            );
        }

        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Yapay zeka analiziniz hazırlanıyor...</p>
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
                        { id: 'overview' as TabType, label: 'Genel Bakış' },
                        { id: 'recommendations' as TabType, label: 'Öneriler' },
                        { id: 'details' as TabType, label: 'Detaylı Analiz' }
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
                                    <p className="text-green-800">Analiz Tamamlandı</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center mb-4">
                                    <Target className="h-5 w-5 text-blue-600 mr-2" />
                                    <h3 className="text-lg font-semibold">En Uyumlu Meslekler</h3>
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
                                                    {match.matchPercentage.toFixed(1)}% Uyum
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
                                <h3 className="text-lg font-semibold">Kariyer Önerileri</h3>
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
                                        Henüz öneri bulunmuyor
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
                    Yapay Zeka Analizi
                </CardTitle>
            </CardHeader>
            <CardContent>
                {renderContent()}
                
                {analysis?.updatedAt && (
                    <div className="text-sm text-gray-500 mt-4 text-right">
                        Son güncelleme: {new Date(analysis.updatedAt).toLocaleDateString('tr-TR')}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export { GeminiAnalysisSection };