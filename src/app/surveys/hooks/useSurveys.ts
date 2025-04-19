// surveys/hooks/useSurveys.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';
import { Survey } from '@/app/types/survey';

export function useSurveys() {
    const queryClient = useQueryClient();

    const { data: surveys, isLoading } = useQuery<Survey[]>({
        queryKey: ['surveys'],
        queryFn: () => axiosInstance.get('/api/surveys').then(res => res.data)
    });

    const deleteSurvey = useMutation({
        mutationFn: (surveyId: number) =>
            axiosInstance.delete(`/api/surveys/${surveyId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['surveys'] });
        }
    });

    return { surveys, isLoading, deleteSurvey };
}