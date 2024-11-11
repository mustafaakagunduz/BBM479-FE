// app/applysurvey/apply/[surveyId]/result/page.tsx
'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import NavbarUser from "@/app/components/navbars/NavbarUser";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface ProfessionMatch {
    professionId: number;
    professionName: string;
    matchPercentage: number;
}

interface SurveyResult {
    id: number;
    userId: number;
    surveyId: number;
    professionMatches: ProfessionMatch[];
    createdAt: string;
}

interface PageProps {
    params: Promise<{ surveyId: string }>;
}

export default function SurveyResultPage({ params }: PageProps) {
    const resolvedParams = use(params); // params'ı Promise'dan çözümlüyoruz
    const router = useRouter();
    const [result, setResult] = useState<SurveyResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userId = 1; // Şimdilik sabit. Gerçek uygulamada auth sisteminden alınacak

    useEffect(() => {
        fetchResult();
    }, [resolvedParams.surveyId]);

    const fetchResult = async () => {
        try {
            setLoading(true);
            // Önce sonuçları hesapla
            await axios.post(`http://localhost:8081/api/surveys/${resolvedParams.surveyId}/results/${userId}/calculate`);
            
            // Sonra sonuçları getir
            const response = await axios.get(`http://localhost:8081/api/surveys/${resolvedParams.surveyId}/results/${userId}`);
            setResult(response.data);
        } catch (err: any) {
            console.error('Error:', err);
            setError(err.response?.data?.message || 'Failed to fetch survey result');
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <NavbarUser />
                <div className="container mx-auto p-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Loading results...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <NavbarUser />
                <div className="container mx-auto p-6">
                    <Card className="bg-red-50">
                        <CardContent className="p-6">
                            <div className="text-red-600">{error}</div>
                            <Button 
                                onClick={() => router.push('/applysurvey')}
                                className="mt-4"
                            >
                                Return to Surveys
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <NavbarUser />
            <div className="container mx-auto p-6 space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/applysurvey')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Surveys
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Your Professional Match Results
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Grafik Bölümü */}
                            <div className="h-96 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={result?.professionMatches.sort((a, b) => b.matchPercentage - a.matchPercentage)}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="professionName"
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis 
                                            domain={[0, 100]}
                                            label={{ 
                                                value: 'Match Percentage (%)', 
                                                angle: -90, 
                                                position: 'insideLeft',
                                                style: { textAnchor: 'middle' }
                                            }}
                                        />
                                        <Tooltip />
                                        <Bar
                                            dataKey="matchPercentage"
                                            fill="#8884d8"
                                            name="Match Percentage"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Detaylı Sonuçlar */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">Detailed Results</h3>
                                <div className="grid gap-4">
                                    {result?.professionMatches
                                        .sort((a, b) => b.matchPercentage - a.matchPercentage)
                                        .map((match) => (
                                            <Card key={match.professionId}>
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <h4 className="font-semibold">{match.professionName}</h4>
                                                            <p className="text-sm text-gray-600">
                                                                Match Score: {match.matchPercentage.toFixed(1)}%
                                                            </p>
                                                        </div>
                                                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-purple-600"
                                                                style={{ width: `${match.matchPercentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}