// app/surveys/components/SurveyDetail.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Survey } from '@/app/types/survey';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface SurveyDetailProps {
    surveyId: number;
}

export function SurveyDetail({ surveyId }: SurveyDetailProps) {
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchSurveyDetails();
    }, [surveyId]);

    const fetchSurveyDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/surveys/${surveyId}`);
            setSurvey(response.data);
        } catch (error) {
            console.error('Error fetching survey details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center">Loading survey details...</div>;
    }

    if (!survey) {
        return <div className="flex justify-center">Survey not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Surveys
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{survey.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        {survey.questions?.map((question, index) => (
                            <div key={question.id} className="border rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Question {index + 1}: {question.text}
                                </h3>
                                <div className="ml-4 space-y-3">
                                    {question.options.map((option) => (
                                        <div
                                            key={option.id}
                                            className="flex items-center p-3 bg-white rounded-lg border"
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    Level {option.level}
                                                </div>
                                                <div className="text-gray-600">
                                                    {option.description}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )) ?? []}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}