// app/components/surveys/UserSurveyList.tsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserSurveyCard } from './UserSurveyCard';
import { Survey } from '@/app/types/survey';

export function UserSurveyList() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSurveys();
    }, []);

    const fetchSurveys = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/surveys');
            setSurveys(response.data);
        } catch (error) {
            console.error('Error fetching surveys:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center">Loading surveys...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {surveys.map((survey) => (
                <UserSurveyCard key={survey.id} survey={survey} />
            ))}
        </div>
    );
}