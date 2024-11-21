'use client';

import { useEffect, useState, use } from 'react';
import axios from 'axios';
import { Survey } from '@/app/types/survey';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import NavbarUser from "@/app/components/navbars/NavbarUser";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle
} from "@/app/components/ui/alert-dialog";

interface PageProps {
    params: Promise<{
        surveyId: string;
    }>;
}

export default function ApplySurveyPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const router = useRouter();
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSurveyDetails();
    }, [resolvedParams.surveyId]);

    const handleOptionSelect = (questionId: number, optionLevel: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionLevel
        }));
    };

    const fetchSurveyDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/surveys/${resolvedParams.surveyId}`);
            setSurvey(response.data);
        } catch (error) {
            console.error('Error fetching survey details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (survey?.questions && currentQuestionIndex < survey.questions.length - 1) {
            const currentQuestionId = survey.questions[currentQuestionIndex].id;

            if (answers[currentQuestionId] === undefined) {
                alert('Please select an answer before proceeding to the next question.');
                return;
            }

            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (!survey || !survey.questions || submitting) {
            return;
        }

        const allQuestionsAnswered = survey.questions.every(
            question => answers[question.id] !== undefined
        );

        if (!allQuestionsAnswered) {
            alert('Please answer all questions before submitting.');
            return;
        }

        try {
            setSubmitting(true);

            const surveyResponse = {
                userId: 1,
                surveyId: Number(resolvedParams.surveyId),
                answers: Object.entries(answers).map(([questionId, level]) => ({
                    questionId: Number(questionId),
                    selectedLevel: level
                }))
            };

            // Yapay gecikme ekliyoruz (3 saniye)
            await new Promise(resolve => setTimeout(resolve, 2000));

            const responseResult = await axios.post('http://localhost:8081/api/responses', surveyResponse);

            if (responseResult.status === 201 || responseResult.status === 200) {
                await router.replace(
                    `/applysurvey/apply/${resolvedParams.surveyId}/result?new=true`,
                    { scroll: false }
                );
            }
        } catch (error) {
            console.error('Error submitting survey:', error);
            alert('Failed to submit survey. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center">Loading survey details...</div>;
    }

    if (!survey || !survey.questions) {
        return <div className="flex justify-center">Survey not found</div>;
    }

    const currentQuestion = survey.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-black">
            <NavbarUser />
            <div className="container mx-auto p-6 space-y-6">
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
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {survey.title}
                        </CardTitle>
                        <div className="text-sm text-gray-600 mt-2">
                            Question {currentQuestionIndex + 1} of {survey.questions.length}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div key={currentQuestion.id} className="border rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    {currentQuestion.text}
                                </h3>
                                <div className="ml-4 space-y-3">
                                    {currentQuestion.options.map((option) => (
                                        <div
                                            key={option.id}
                                            onClick={() => handleOptionSelect(currentQuestion.id, option.level)}
                                            className={`flex items-center p-3 bg-white rounded-lg border transition-all cursor-pointer
                            ${answers[currentQuestion.id] === option.level
                                                ? 'border-purple-500 bg-purple-50 shadow-sm'
                                                : 'hover:border-purple-500'}`}
                                        >
                                            <div className="flex items-center w-full">
                                                <div className="flex-shrink-0 mr-4">
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                    ${answers[currentQuestion.id] === option.level
                                                        ? 'border-purple-500 bg-purple-500'
                                                        : 'border-gray-300'}`}
                                                    >
                                                        {answers[currentQuestion.id] === option.level && (
                                                            <div className="w-2 h-2 bg-white rounded-full" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium">
                                                        Level {option.level}
                                                    </div>
                                                    <div className="text-gray-600">
                                                        {option.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between mt-6">
                                <Button
                                    onClick={handleBack}
                                    disabled={isFirstQuestion}
                                    className="flex items-center gap-2"
                                    variant="ghost"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>

                                {isLastQuestion ? (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Survey'
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        className="flex items-center gap-2"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>


            {/* Loading Modal */}
            <AlertDialog open={submitting}>
                <AlertDialogContent className="flex flex-col items-center justify-center p-6 bg-white">
                    <AlertDialogTitle className="sr-only">
                        Processing Survey Responses
                    </AlertDialogTitle>
                    <div className="mb-4">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                    </div>
                    <AlertDialogDescription className="text-center text-lg text-purple-600 font-medium">
                        Processing your survey responses...
                        <br />
                        <span className="text-purple-500">
                Please wait while we calculate your results.
            </span>
                    </AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}