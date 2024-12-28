'use client';

import { useEffect, useState, use, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios, { AxiosResponse } from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ResultDropdownMenu from '@/app/components/survey/ResultDropdownMenu';
import SurveySpiderChart from "@/app/components/charts/SurveySpiderChart";
import { GeminiAnalysisSection } from './geminiAiTextCreate';
import { useAuth } from '@/app/context/AuthContext';


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
    const { user } = useAuth();
    const [allResults, setAllResults] = useState<SurveyResult[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);  // Yeni state ekledik

    const fetchAllResults = useCallback(async () => {
        if (!user) return;

        try {
            const API_BASE = 'http://localhost:8081/api/surveys';
            const response = await axios.get(
                `${API_BASE}/${resolvedParams.surveyId}/results/${user.id}/all`
            );

            if (response.data) {
                setAllResults(response.data);
            }
        } catch (err) {
            console.error('Error fetching all results:', err);
        }
    }, [resolvedParams.surveyId, user]);

    const fetchResult = useCallback(async () => {
        if (loading || !user) return;
    
        const isNewCalculation = searchParams.get('new') === 'true'; // Buraya taşıdık
    
        try {
            setLoading(true);
            setError(null);
    
            const API_BASE = 'http://localhost:8081/api/surveys';
    
            const makeRequest = async (retryCount = 0): Promise<AxiosResponse<SurveyResult>> => {
                try {
                    let response: AxiosResponse<SurveyResult>;
                    if (isNewCalculation) { // Artık burada kullanılabilir
                        response = await axios.post<SurveyResult>(
                            `${API_BASE}/${resolvedParams.surveyId}/results/${user.id}/calculate?force=true`
                        );
    
                        if (response.data) {
                            await router.replace(`/applysurvey/apply/${resolvedParams.surveyId}/result`, { scroll: false });
                            await fetchAllResults();
                        }
                    } else {
                        response = await axios.get<SurveyResult>(
                            `${API_BASE}/${resolvedParams.surveyId}/results/${user.id}/latest`
                        );
                    }
    
                    if (response.data) {
                        setResult(response.data);
                    }
                    return response;
                } catch (err) {
                    if (axios.isAxiosError(err) && err.response?.status === 429 && retryCount < 3) {
                        const delay = Math.pow(2, retryCount) * 1000;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        return makeRequest(retryCount + 1);
                    }
                    throw err;
                }
            };
    
            await makeRequest();
    
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to fetch survey result');
    
            if (!isNewCalculation) { // Ve burada
                setTimeout(() => {
                    router.push('/applysurvey');
                }, 3000);
            }
        } finally {
            setLoading(false);
        }
    }, [resolvedParams.surveyId, searchParams, router, loading, fetchAllResults, user]);
    useEffect(() => {
        if (!isInitialized && user) {
            const isNewCalculation = searchParams.get('new') === 'true';
            
            if (!isNewCalculation && result) {
                return;
            }

            setIsInitialized(true);
            fetchResult();
            fetchAllResults();
        }
    }, [fetchResult, searchParams, result, user, isInitialized, fetchAllResults]);

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
                            <GeminiAnalysisSection
                                surveyResultId={result.id}
                                professionMatches={result.professionMatches}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}