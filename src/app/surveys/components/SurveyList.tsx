// surveys/components/SurveyList.tsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SurveyCard } from './SurveyCard';
import { Survey } from '@/app/types/survey';

export function SurveyList() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSurveys();
    }, []);

    const fetchSurveys = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/surveys');
            console.log('Backend response:', response.data); // Response'u kontrol edelim
            setSurveys(response.data);
        } catch (error) {
            console.error('Error fetching surveys:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8081/api/surveys/${id}`);
            // Refresh surveys after deletion
            fetchSurveys();
        } catch (error) {
            console.error('Error deleting survey:', error);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center">Loading surveys...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey) => (
                <SurveyCard
                    key={survey.id}
                    survey={survey}
                    onDelete={() => handleDelete(survey.id)}
                />
            ))}
        </div>
    );
}