'use client';

import { useEffect, useState, use, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ResultDropdownMenu from '@/app/components/survey/ResultDropdownMenu';
import SurveySpiderChart from "@/app/components/charts/SurveySpiderChart";
import { GeminiAnalysisSection } from './geminiAiTextCreate';

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
    params: Promise<{ surveyId: string }>;
}

export default function SurveyResultPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [result, setResult] = useState<SurveyResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const calculationInProgress = useRef(false);
    const userId = 8;
    const [allResults, setAllResults] = useState<SurveyResult[]>([]);

    const fetchAllResults = useCallback(async () => {
        try {
            const API_BASE = 'http://localhost:8081/api/surveys';
            const response = await axios.get(
                `${API_BASE}/${resolvedParams.surveyId}/results/${userId}/all`
            );

            if (response.data) {
                setAllResults(response.data);
            }
        } catch (err) {
            console.error('Error fetching all results:', err);
        }
    }, [resolvedParams.surveyId, userId]);

    useEffect(() => {
        fetchAllResults();
    }, [fetchAllResults]);

    const fetchResult = useCallback(async () => {
        if (loading || calculationInProgress.current) return;

        try {
            calculationInProgress.current = true;
            setLoading(true);
            setError(null);

            const API_BASE = 'http://localhost:8081/api/surveys';
            const isNewCalculation = searchParams.get('new') === 'true';

            let response;
            if (isNewCalculation) {
                response = await axios.post(
                    `${API_BASE}/${resolvedParams.surveyId}/results/${userId}/calculate?force=true`,
                    {},
                    {
                        headers: { 'Cache-Control': 'no-cache' },
                    }
                );

                if (response.data) {
                    await router.replace(`/applysurvey/apply/${resolvedParams.surveyId}/result`, { scroll: false });
                    await fetchAllResults();
                }
            } else {
                response = await axios.get(
                    `${API_BASE}/${resolvedParams.surveyId}/results/${userId}/latest`
                );
            }

            if (response.data) {
                setResult(response.data);
            } else {
                throw new Error('No result found');
            }
        } catch (err: any) {
            console.error('Error:', err);
            setError('Failed to fetch survey result');

            setTimeout(() => {
                router.push('/applysurvey');
            }, 3000);
        } finally {
            setLoading(false);
            calculationInProgress.current = false;
        }
    }, [resolvedParams.surveyId, searchParams, router, loading, fetchAllResults]);

    useEffect(() => {
        const isNewCalculation = searchParams.get('new') === 'true';

        if (!isNewCalculation && result) {
            return;
        }

        fetchResult();
    }, [fetchResult, searchParams, result]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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

    if (!result) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="container mx-auto p-6">
                    <div className="text-center">No results available</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Your Professional Match Results
                            </CardTitle>
                            <ResultDropdownMenu
                                currentResult={result}
                                allResults={allResults}
                                onResultSelect={setResult}
                            />
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div>Completed on: {new Date(result.createdAt).toLocaleDateString()}</div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {result.professionMatches && result.professionMatches.length > 0 && (
                            <div className="h-[500px] w-full flex items-center justify-center">
                                <SurveySpiderChart professionMatches={result.professionMatches} />
                            </div>
                        )}
                    </CardContent>
                    <CardContent className="p-6">
                        {result.professionMatches && result.professionMatches.length > 0 && (
                            <>
                                <div className="h-[500px] w-full flex items-center justify-center">
                                    <SurveySpiderChart professionMatches={result.professionMatches} />
                                </div>
                                <GeminiAnalysisSection 
                                    surveyResultId={result.id} 
                                    professionMatches={result.professionMatches} 
                                />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}