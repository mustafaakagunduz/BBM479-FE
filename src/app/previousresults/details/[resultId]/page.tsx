'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/app/context/AuthContext";
import axiosInstance from "@/utils/axiosInstance";

interface PageProps {
    params: Promise<{ resultId: string }>;
}

export default function ResultDetailsRedirect({ params }: PageProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const redirectToSurveyResult = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const allResultsResponse = await axiosInstance.get(`/api/surveys/results/user/${user.id}`);

                if (allResultsResponse.data) {
                    const targetResult = allResultsResponse.data.find(
                        (r: any) => r.id === parseInt(resolvedParams.resultId)
                    );

                    if (targetResult) {
                        // İlgili surveyId'yi alıp doğru URL'ye yönlendirme yapıyoruz
                        router.replace(`/applysurvey/apply/${targetResult.surveyId}/result`);
                    } else {
                        setError('Result not found');
                        setLoading(false);
                    }
                }
            } catch (err) {
                console.error('Error fetching result:', err);
                setError('Failed to fetch result details');
                setLoading(false);
            }
        };

        redirectToSurveyResult();
    }, [resolvedParams.resultId, user, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="container mx-auto p-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Redirecting...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="container mx-auto p-6">
                    <div className="bg-red-50 p-6 rounded-lg shadow">
                        <div className="text-red-600">{error || 'Result not found'}</div>
                        <button
                            onClick={() => router.push('/previousresults')}
                            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            Return to Previous Results
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}