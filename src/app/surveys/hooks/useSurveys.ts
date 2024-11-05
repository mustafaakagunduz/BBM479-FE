
// surveys/hooks/useSurveys.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Survey } from '@/app/types/survey';

const API_URL = 'http://localhost:8081/api/surveys';

export function useSurveys() {
    const queryClient = useQueryClient();

    const { data: surveys, isLoading } = useQuery<Survey[]>({
        queryKey: ['surveys'],
        queryFn: () => axios.get(API_URL).then(res => res.data)
    });

    const deleteSurvey = useMutation({
        mutationFn: (surveyId: number) =>
            axios.delete(`${API_URL}/${surveyId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['surveys'] });
        }
    });

    return { surveys, isLoading, deleteSurvey };
}