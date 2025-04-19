import { useEffect, useState, useCallback } from 'react';
    import axios, { AxiosError } from 'axios';
    import { SurveyCard } from './SurveyCard';
    import { toast } from 'react-hot-toast';
    import { FilePlus, Loader2, FileText } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from "../../components/ui/alert-dialog";
    import {
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
    } from "@/components/ui/tooltip";
    import { Alert, AlertDescription } from "@/components/ui/alert";
    import Link from 'next/link';

    interface Survey {
      id: number;
      title: string;
      userId: number;
      industryId: number;
      questions: Question[];
      selectedProfessions: number[];
    }

    interface Question {
      id: number;
      text: string;
      skillId: number;
      options: Option[];
    }

    interface Option {
      id: number;
      level: number;
      description: string;
    }

    interface ApiError {
      message: string;
      status?: number;
    }

    interface SurveyCardProps {
      survey: Survey;
      onDelete: (id: number) => void;
      ActionTooltip: ({ content, children }: { content: string; children: React.ReactNode }) => JSX.Element;
    }

    const SurveyList = () => {
      const [surveys, setSurveys] = useState<Survey[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [surveyToDelete, setSurveyToDelete] = useState<number | null>(null);
      const [isProcessing, setIsProcessing] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [retryCount, setRetryCount] = useState(0);

      const fetchSurveys = useCallback(async () => {
        try {
          setIsLoading(true);
          setError(null);
            const response = await axiosInstance.get<Survey[]>('/api/surveys');
          setSurveys(response.data);
        } catch (err) {
          const error = err as AxiosError<ApiError>;
          const errorMessage = error.response?.data?.message || 'Failed to load surveys';
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }, []);

      useEffect(() => {
        fetchSurveys();
      }, [fetchSurveys]);

      const handleDelete = useCallback((id: number) => {
        setSurveyToDelete(id);
        setError(null);
        setRetryCount(0);
      }, []);

      const handleDeleteConfirm = async () => {
        if (!surveyToDelete) return;

        try {
          setIsProcessing(true);
            await axiosInstance.delete(`/api/surveys/${surveyToDelete}`);
          setSurveys(surveys.filter(survey => survey.id !== surveyToDelete));
          setSurveyToDelete(null);
          toast.success("Survey deleted successfully");
        } catch (error) {
          toast.error("Failed to delete survey");
          console.error("Delete error:", error);
          setError("Failed to delete survey. Please try again.");
          setRetryCount(prev => prev + 1);
        } finally {
          setIsProcessing(false);
        }
      };

      const handleCloseDialog = () => {
        setSurveyToDelete(null);
        setError(null);
        setRetryCount(0);
      };

      if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
      }

      const CreateSurveyCard = () => (
          <Link
              href="/addsurvey"
              className="block p-6 bg-purple-600 rounded-lg shadow-sm hover:bg-purple-700 transition-colors duration-200 h-full relative"
          >
            <div className="flex flex-col h-full min-h-[200px]">
              {/* Icon at the top */}
              <div className="flex justify-center pt-4">
                <FilePlus className="w-12 h-12 text-white" />
              </div>

              {/* Content in the middle */}
              <div className="flex flex-col items-center justify-center flex-grow text-center">
                <h3 className="text-lg font-semibold mb-2 text-white">Create a New Survey</h3>
                <p className="text-purple-100">Design and create new surveys from scratch</p>
              </div>
            </div>
          </Link>
      );

      const LoadSurveyQuestionsCard = () => (
          <Link
          href="/loadsurvey"
          className="block p-6 bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200 h-full relative"
          >
            <div className="flex flex-col h-full min-h-[200px]">
              {/* İkon */}
              <div className="flex justify-center pt-4">
                <FileText className="w-12 h-12 text-white" /> {/* veya uygun başka bir ikon */}
              </div>

              {/* İçerik */}
              <div className="flex flex-col items-center justify-center flex-grow text-center">
                <h3 className="text-lg font-semibold mb-2 text-white">Load Survey Questions</h3>
                <p className="text-blue-100">Import questions from existing templates</p>
              </div>
            </div>
          </Link>
        );

      const ActionTooltip = ({ content, children }: { content: string; children: React.ReactNode }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {children}
              </TooltipTrigger>
              <TooltipContent>
                <p>{content}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      );

      return (
          <div className="space-y-6">
            {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    {error}
                    {retryCount > 0 && (
                        <div className="mt-2 text-sm">
                          Failed after {retryCount} attempts. Please try again later.
                        </div>
                    )}
                  </AlertDescription>
                </Alert>
            )}

            <AlertDialog open={!!surveyToDelete} onOpenChange={handleCloseDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Survey</AlertDialogTitle>
                  <div className="mt-2">
                    <AlertDialogDescription asChild>
                      <div className="space-y-4">
                        <span>This will permanently delete the survey and all associated data including:</span>
                        <ul className="list-disc list-inside space-y-1">
                          <li>All survey responses</li>
                          <li>Survey results and analysis</li>
                          <li>Profession matches</li>
                          <li>Questions and options</li>
                        </ul>
                        <span>This action cannot be undone.</span>
                      </div>
                    </AlertDialogDescription>
                  </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                      onClick={handleDeleteConfirm}
                      disabled={isProcessing}
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  >
                    {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>
                        {retryCount > 0 ? `Retrying (${retryCount}/3)...` : 'Deleting...'}
                      </span>
                        </div>
                    ) : (
                        'Delete Survey'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CreateSurveyCard />
                {/* <LoadSurveyQuestionsCard /> */}
              {surveys.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg col-span-full md:col-span-1">
                    <p className="text-gray-600">No surveys available</p>
                    <button
                        onClick={fetchSurveys}
                        className="mt-4 px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                    >
                      Refresh
                    </button>
                  </div>
              ) : (
                  surveys.map((survey) => (
                      <SurveyCard
                          key={survey.id}
                          survey={survey}
                          onDelete={handleDelete}
                          ActionTooltip={ActionTooltip}
                      />
                  ))
              )}
            </div>
          </div>
      );
    };

    export default SurveyList;