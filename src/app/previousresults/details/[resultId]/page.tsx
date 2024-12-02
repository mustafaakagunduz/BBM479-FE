'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SurveySpiderChart from "@/app/components/charts/SurveySpiderChart";
import Navbar from "@/app/components/navbar/Navbar";
import {useAuth} from "@/app/context/AuthContext";

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
    const { user } = useAuth();
    useEffect(() => {
        const fetchResult = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const API_BASE = 'http://localhost:8081/api/surveys';
                const allResultsResponse = await axios.get(`${API_BASE}/results/user/${user.id}`);

                if (allResultsResponse.data) {
                    const targetResult = allResultsResponse.data.find(
                        (r: SurveyResult) => r.id === parseInt(resolvedParams.resultId)
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
    }, [resolvedParams.resultId, user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">

                <Navbar></Navbar>

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

                            {/* <div>Result ID: #{result.id}</div> */}
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
                    <CardContent className="p-6">
                        {result.professionMatches && result.professionMatches.length > 0 && (
                            <div className="h-[500px] w-full flex items-center justify-center">
                                <SurveySpiderChart professionMatches={result.professionMatches} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}