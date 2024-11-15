'use client';

import React, { useEffect, useState, use } from 'react';
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
    id: number;
    professionId: number;
    professionName: string;
    matchPercentage: number;
}

interface SurveyResult {
    id: number;
    userId: number;
    surveyId: number;
    attemptNumber: number;
    professionMatches: ProfessionMatch[];
    createdAt: string;
}

interface PageProps {
    params: Promise<{ resultId: string }>;
}

export default function ResultDetails({ params }: PageProps) {
    const resolvedParams = use(params); // params'ı çözümlüyoruz
    const router = useRouter();
    const [result, setResult] = useState<SurveyResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                setLoading(true);
                const API_BASE = 'http://localhost:8081/api/surveys';
                const allResultsResponse = await axios.get(`${API_BASE}/results/user/1`);

                if (allResultsResponse.data) {
                    const targetResult = allResultsResponse.data.find(
                        (r: SurveyResult) => r.id === parseInt(resolvedParams.resultId) // params.resultId yerine resolvedParams.resultId kullanıyoruz
                    );

                    if (targetResult) {
                        setResult(targetResult);
                    } else {
                        setError('Result not found');
                    }
                }
            } catch (err) {
                console.error('Error fetching result:', err);
                setError('Failed to fetch result details');
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [resolvedParams.resultId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <NavbarUser />
                <div className="container mx-auto p-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Loading result details...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <NavbarUser />
                <div className="container mx-auto p-6">
                    <Card className="bg-red-50">
                        <CardContent className="p-6">
                            <div className="text-red-600">{error || 'Result not found'}</div>
                            <Button
                                onClick={() => router.push('/previousresults')}
                                className="mt-4"
                            >
                                Return to Previous Results
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
                    onClick={() => router.push('/previousresults')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Results
                </Button>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Your Professional Match Results
                            </CardTitle>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div>Result ID: #{result.id}</div>
                            <div>Completed on: {new Date(result.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            })}</div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Grafik */}
                            {result.professionMatches && result.professionMatches.length > 0 && (
                                <div className="h-96 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={Array.from(
                                                new Map(
                                                    result.professionMatches
                                                        .map(match => [match.professionId, match])
                                                ).values()
                                            ).sort((a, b) => b.matchPercentage - a.matchPercentage)}
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
                            )}

                            {/* Detaylı sonuçlar */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Detailed Results
                                </h3>
                                <div className="grid gap-4">
                                    {result.professionMatches &&
                                        Array.from(
                                            new Map(
                                                result.professionMatches
                                                    .map(match => [match.professionId, match])
                                            ).values()
                                        )
                                            .sort((a, b) => b.matchPercentage - a.matchPercentage)
                                            .map((match) => (
                                                <Card key={match.professionId}>
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h4 className="font-semibold text-black">{match.professionName}</h4>
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