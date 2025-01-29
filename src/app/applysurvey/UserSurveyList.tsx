'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserSurveyCard } from './UserSurveyCard';
import { Survey } from '@/app/types/survey';
import { useAuth } from '@/app/context/AuthContext';  // Auth context'inizi import edin

interface SurveyWithCompletionStatus extends Survey {
    isCompleted?: boolean;
}

export function UserSurveyList() {
    const [surveys, setSurveys] = useState<SurveyWithCompletionStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();  // Auth context'ten user'ı alın

    useEffect(() => {
        if (user) {
            fetchSurveysWithStatus();
        }
    }, [user]);

    const fetchSurveysWithStatus = async () => {
        try {
            const [surveysResponse, resultsResponse] = await Promise.all([
                axios.get('http://localhost:8081/api/surveys'),
                axios.get(`http://localhost:8081/api/surveys/results/user/${user?.id}`)
            ]);

            // Kullanıcının tamamladığı anketlerin ID'lerini al
            const completedSurveyIds = new Set(
                resultsResponse.data.map((result: any) => result.surveyId)
            );

            // Her ankete completion status'ü ekle
            const surveysWithStatus = surveysResponse.data.map((survey: Survey) => ({
                ...survey,
                isCompleted: completedSurveyIds.has(survey.id)
            }));

            setSurveys(surveysWithStatus);
        } catch (error) {
            console.error('Error fetching surveys:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {surveys.map((survey) => (
                <UserSurveyCard
                    key={survey.id}
                    survey={survey}
                    isCompleted={survey.isCompleted}
                />
            ))}
        </div>
    );
}