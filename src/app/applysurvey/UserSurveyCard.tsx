// app/components/surveys/UserSurveyCard.tsx
import { Survey } from '@/app/types/survey';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/app/components/ui/card';
import { FileText } from 'lucide-react';

interface UserSurveyCardProps {
    survey: Survey;
}

export function UserSurveyCard({ survey }: UserSurveyCardProps) {
    const router = useRouter();

    return (
        <Card
            className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer bg-white/90 backdrop-blur-sm border-purple-100"
            onClick={() => router.push(`/applysurvey/apply/${survey.id}`)}
        >
            <div className="p-6 flex flex-col items-center text-center">
                <FileText className="w-12 h-12 text-purple-500 mb-4" />
                <CardHeader className="p-0">
                    <CardTitle className="text-xl font-semibold text-gray-800">
                        {survey.title || 'Untitled Survey'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="mt-4 p-0">
                    <p className="text-gray-600 text-sm">
                        Questions: {survey.questions?.length || 0}
                    </p>
                </CardContent>
            </div>
        </Card>
    );
}