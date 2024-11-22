'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SurveyCard } from './SurveyCard';
import { Survey } from '@/app/types/survey';
import { toast, Toaster } from 'react-hot-toast';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle
} from "@/app/components/ui/alert-dialog";

export function SurveyList() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [surveyToDelete, setSurveyToDelete] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        fetchSurveys();
    }, []);

    const fetchSurveys = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/surveys');
            setSurveys(response.data);
        } catch (error) {
            toast.error('Failed to load surveys', {
                duration: 2000,
                style: {
                    border: '1px solid #EF4444',
                    padding: '12px',
                    color: '#DC2626',
                    backgroundColor: '#FEE2E2'
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        setSurveyToDelete(id);
    };
    const handleDeleteConfirm = async () => {
        if (surveyToDelete !== null) {
            try {
                setIsProcessing(true);
                await axios.delete(`http://localhost:8081/api/surveys/${surveyToDelete}`);
                setSurveys(prev => prev.filter(survey => survey.id !== surveyToDelete));
                setSurveyToDelete(null);

                toast.success('Survey deleted successfully', {
                    duration: 2000,
                    style: {
                        border: '1px solid #10B981',
                        padding: '12px',
                        color: '#059669',
                        backgroundColor: '#ECFDF5'
                    },
                });
            } catch (error: any) {
                console.error('Error deleting survey:', error);
                if (error.response?.status === 500) {
                    setDeleteError('This survey cannot be deleted because it is already in use.');
                } else {
                    setDeleteError('An error occurred while deleting the survey.');
                }
            } finally {
                setIsProcessing(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 2000,
                    style: {
                        background: '#ECFDF5',
                        color: '#059669',
                        border: '1px solid #10B981',
                        padding: '16px',
                        fontSize: '1.1rem',
                        minWidth: '300px',
                        maxWidth: '400px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#059669',
                            secondary: '#ECFDF5',
                        },
                    }
                }}
            />

            {/* Delete Confirmation Modal */}
            <AlertDialog open={surveyToDelete !== null}>
                <AlertDialogContent className="flex flex-col items-center justify-center p-6 bg-white">
                    <AlertDialogTitle className="text-xl font-semibold text-purple-600 mb-4">
                        Delete Survey
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-lg text-purple-500 mb-6">
                        Are you sure you want to delete this survey?
                    </AlertDialogDescription>
                    <div className="flex gap-4">
                        <button
                            onClick={handleDeleteConfirm}
                            disabled={isProcessing}
                            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                            {isProcessing ? (
                                <div className="flex items-center">
                                    <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white"></div>
                                    <span>Deleting...</span>
                                </div>
                            ) : (
                                'Delete'
                            )}
                        </button>
                        <button
                            onClick={() => setSurveyToDelete(null)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!deleteError}>
                <AlertDialogContent className="flex flex-col items-center justify-center p-6 bg-white">
                    <AlertDialogTitle className="text-xl font-semibold text-purple-600 mb-4">
                        Delete Failed
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-lg text-purple-500 mb-6">
                        {deleteError}
                    </AlertDialogDescription>
                    <button
                        onClick={() => setDeleteError(null)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        Close
                    </button>
                </AlertDialogContent>
            </AlertDialog>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {surveys.map((survey) => (
                    <SurveyCard
                        key={survey.id}
                        survey={survey}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </>
    );
}