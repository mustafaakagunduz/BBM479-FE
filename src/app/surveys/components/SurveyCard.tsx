import { Survey } from '@/app/types/survey';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Trash2, Edit, Eye, FileText } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface SurveyCardProps {
    survey: Survey;
    onDelete: (id: number) => void;
    ActionTooltip: ({ content, children }: { content: string; children: React.ReactNode }) => JSX.Element;
}

export function SurveyCard({ survey, onDelete }: SurveyCardProps) {
    const router = useRouter();

    return (
        <Card
            className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer bg-white/90 backdrop-blur-sm border-purple-100"
            onClick={() => router.push(`/surveys/${survey.id}`)}
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
                <CardFooter className="flex justify-center gap-2 mt-6 p-0">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/surveys/${survey.id}`);
                                    }}
                                    className="text-gray-600 hover:text-purple-600"
                                    aria-label="View survey"
                                >
                                    <Eye className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Show Survey</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/surveys/${survey.id}/edit`);
                                    }}
                                    className="text-gray-600 hover:text-purple-600"
                                    aria-label="Edit survey"
                                >
                                    <Edit className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit Survey</p>
                                <p>Note : In order to keep survey's consistency, </p>
                                <p>if there are survey results in the system,</p>
                                <p> the system does not allow you to edit the survey.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(survey.id);
                                    }}
                                    className="text-gray-600 hover:text-red-600"
                                    aria-label="Delete survey"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete Survey</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardFooter>
            </div>
        </Card>
    );
}