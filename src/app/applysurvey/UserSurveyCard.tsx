import { Survey } from '@/app/types/survey';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/app/components/ui/card';
import { FileText, CheckCircle } from 'lucide-react';

interface UserSurveyCardProps {
    survey: Survey;
    isCompleted?: boolean;
}

export function UserSurveyCard({ survey, isCompleted }: UserSurveyCardProps) {
    const router = useRouter();

    const handleCardClick = () => {
        if (isCompleted) {
            router.push(`/applysurvey/apply/${survey.id}/result`);
        } else {
            router.push(`/applysurvey/apply/${survey.id}`);
        }
    };

    return (
        <Card
            className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer bg-white/90 backdrop-blur-sm ${
                isCompleted ? 'border-green-200 border-2' : 'border-purple-100'
            }`}
            onClick={handleCardClick}
        >
            <div className="p-6 flex flex-col items-center text-center relative">
                {isCompleted && (
                    <div className="absolute top-2 right-2">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                )}

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
                    {isCompleted && (
                        <div className="mt-3 py-2 px-3 bg-green-50 rounded-md">
                            <p className="text-green-600 text-sm">
                                You've completed this survey
                            </p>
                            <p className="text-green-500 text-xs mt-1">
                                Click to view results
                            </p>
                        </div>
                    )}
                </CardContent>

                {!isCompleted && (
                    <CardFooter className="p-0 mt-4">
                        <p className="text-purple-600 text-sm font-medium">
                            Click to start survey
                        </p>
                    </CardFooter>
                )}
            </div>
        </Card>
    );
}