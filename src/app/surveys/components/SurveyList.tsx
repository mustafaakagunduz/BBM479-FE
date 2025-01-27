import { useEffect, useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { SurveyCard } from './SurveyCard';
import { toast } from 'react-hot-toast';
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

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
      const response = await axios.get<Survey[]>('http://localhost:8081/api/surveys');
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
  const API_URL = 'http://localhost:8081/api';

  const handleDeleteConfirm = async () => {
    if (!surveyToDelete) return;
    
    try {
      setIsProcessing(true);
      await axios.delete(`${API_URL}/surveys/${surveyToDelete}`);
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
            <AlertDialogDescription>
              This will permanently delete the survey and all associated data including:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All survey responses</li>
                <li>Survey results and analysis</li>
                <li>Profession matches</li>
                <li>Questions and options</li>
              </ul>
              This action cannot be undone.
            </AlertDialogDescription>
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

      {surveys.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No surveys available</p>
          <button 
            onClick={fetchSurveys}
            className="mt-4 px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyList;