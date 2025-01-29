'use client'
import { useEffect, useState, use } from 'react';
import axios, { AxiosError } from 'axios';
import { Survey } from '@/app/types/survey';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle
} from "@/app/components/ui/alert-dialog";
import FormattedQuestionDisplay from '@/app/components/FormattedQuestionDisplay';
interface PageProps {
    params: Promise<{
        surveyId: string;
    }>;
}

const ApplySurveyPage = ({ params }: PageProps) => {
    const resolvedParams = use(params);
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    const variants = {
        enter: (direction: number) => ({
            y: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            y: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            y: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    useEffect(() => {
        const controller = new AbortController();

        const fetchSurveyDetails = async () => {
            try {
                setLoading(true);

                // Önce survey detaylarını al
                const surveyResponse = await axios.get(
                    `http://localhost:8081/api/surveys/${resolvedParams.surveyId}`,
                    { signal: controller.signal }
                );

                // Survey datası varsa, sadece bu anket için completion kontrolü yap
                if (surveyResponse.data && user) {
                    try {
                        const completionResponse = await axios.get(
                            `http://localhost:8081/api/surveys/${resolvedParams.surveyId}/results/${user.id}/latest`
                        );

                        // Eğer bu spesifik anket için sonuç varsa
                        if (completionResponse.data) {
                            alert('You have already completed this survey.');
                            router.push('/applysurvey');
                            return;
                        }
                    } catch (completionError) {
                        // 404 hatası beklenen bir durum, diğer hataları logla
                        if (axios.isAxiosError(completionError) &&
                            completionError.response?.status !== 404) {
                            console.error('Error checking completion:', completionError);
                        }
                    }
                }

                // Her durumda survey datasını set et
                setSurvey(surveyResponse.data);

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.name !== 'CanceledError') {
                        console.error('Error fetching survey details:', error);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchSurveyDetails();
        }

        return () => controller.abort();
    }, [resolvedParams.surveyId, user, router]);

    const handleSubmit = async () => {
        if (!survey?.questions || submitting || !user) {
            console.log('Submit engellendi:', {
                hasQuestions: !!survey?.questions,
                isSubmitting: submitting,
                hasUser: !!user
            });
            return;
        }

        try {
            setSubmitting(true);

            // Tüm soruların cevaplanıp cevaplanmadığını kontrol et
            const allQuestionsAnswered = survey.questions.every(
                question => answers[question.id] !== undefined
            );

            if (!allQuestionsAnswered) {
                alert('Please answer all questions before submitting.');
                setSubmitting(false);
                return;
            }

            // Önce cevapları kaydet
            const surveyResponse = {
                userId: user.id,
                surveyId: Number(resolvedParams.surveyId),
                answers: Object.entries(answers).map(([questionId, level]) => ({
                    questionId: Number(questionId),
                    selectedLevel: level
                }))
            };

            // Cevapları kaydet
            const responseResult = await axios.post(
                'http://localhost:8081/api/responses',
                surveyResponse,
                {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                }
            );

            if (responseResult.status === 201 || responseResult.status === 200) {
                // Sonuçları hesapla ve bekle
                const waitForResults = async (retryCount = 0): Promise<void> => {
                    try {
                        const calculationResult = await axios.post(
                            `http://localhost:8081/api/surveys/${resolvedParams.surveyId}/results/${user.id}/calculate`
                        );

                        if (calculationResult.status === 200) {
                            // Sonuçların hazır olduğundan emin olmak için get isteği yap
                            const verifyResult = await axios.get(
                                `http://localhost:8081/api/surveys/${resolvedParams.surveyId}/results/${user.id}/latest`
                            );

                            if (verifyResult.data) {
                                router.push(`/applysurvey/apply/${resolvedParams.surveyId}/result?new=true`);
                                return;
                            }
                        }
                    } catch (error) {
                        if (retryCount < 3 && axios.isAxiosError(error)) {
                            const delay = Math.pow(2, retryCount) * 1000;
                            await new Promise(resolve => setTimeout(resolve, delay));
                            return waitForResults(retryCount + 1);
                        }
                        throw error;
                    }
                };

                await waitForResults();
            }
        } catch (error) {
            console.error('Submit error:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                if (errorMessage.includes("already completed")) {
                    alert("You have already completed this survey. You cannot submit it again.");
                } else {
                    alert(`Error: ${errorMessage}`);
                }
            } else {
                alert('Failed to submit survey. Please try again.');
            }
            router.push('/applysurvey');
        } finally {
            setSubmitting(false);
        }
    };

    const handleOptionSelect = (questionId: number, optionLevel: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionLevel
        }));
    };

    const handleNext = () => {
        if (survey?.questions && currentQuestionIndex < survey.questions.length - 1) {
            const currentQuestionId = survey.questions[currentQuestionIndex].id;

            if (answers[currentQuestionId] === undefined) {
                alert('Please select an answer before proceeding.');
                return;
            }

            setDirection(1);
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setDirection(-1);
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };



    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                <span className="ml-2">Loading survey details...</span>
            </div>
        );
    }

    if (!survey || !survey.questions) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-600">
                Survey not found
            </div>
        );
    }

    const currentQuestion = survey.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
                        <div className="space-y-6 overflow-hidden">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={currentQuestionIndex}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        y: { type: "tween", duration: 0.3 },
                                        opacity: { duration: 0.3 }
                                    }}
                                >
                                    <FormattedQuestionDisplay
                                        question={{
                                            content: currentQuestion.text,
                                            options: currentQuestion.options.map(option => ({
                                                level: option.level,
                                                description: option.description
                                            }))
                                        }}
                                        selectedLevel={answers[currentQuestion.id]}
                                        onAnswerSelect={(level) => handleOptionSelect(currentQuestion.id, level)}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigasyon butonlarını CardContent içinde ama AnimatePresence dışında tutuyoruz */}
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
};

export default ApplySurveyPage;