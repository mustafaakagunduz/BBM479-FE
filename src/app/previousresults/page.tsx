'use client';

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck } from 'lucide-react';
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/app/context/AuthContext";
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Paper,
    Typography,
    Button,
    Divider,
    Box
} from '@mui/material';

interface ProfessionMatch {
    id: number;
    professionId: number;
    professionName: string;
    matchPercentage: number;
}

interface SurveyResult {
    id: number;
    userId: number;
    surveyId: number;
    surveyTitle: string;
    attemptNumber: number;
    professionMatches: ProfessionMatch[];
    createdAt: string;
}

// Separate component for date rendering to avoid hydration issues
const FormattedDate: React.FC<{ date: string }> = ({ date }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Typography component="span" variant="body2" color="text.secondary">{date}</Typography>;
    }

    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return (
        <Box component="span">
            <Typography component="span" variant="body2" color="text.secondary" display="block">
                {formattedDate}
            </Typography>
            <Typography component="span" variant="body2" color="text.secondary" display="block">
                {formattedTime}
            </Typography>
        </Box>
    );
};

const PreviousResults: React.FC = () => {
    const router = useRouter();
    const [results, setResults] = useState<SurveyResult[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchResults = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);

            const response = await axiosInstance.get(`/api/surveys/results/user/${user.id}`);

            if (response.data) {
                const resultsWithSurveyTitles = await Promise.all(
                    response.data.map(async (result: SurveyResult) => {
                        try {
                            const surveyResponse = await axiosInstance.get(`/api/surveys/${result.surveyId}`);
                            return {
                                ...result,
                                surveyTitle: surveyResponse.data.title
                            };
                        } catch (error) {
                            console.error(`Error fetching survey title for id ${result.surveyId}:`, error);
                            return {
                                ...result,
                                surveyTitle: 'Unknown Survey'
                            };
                        }
                    })
                );
                setResults(resultsWithSurveyTitles);
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    const handleDelete = async (resultId: number) => {
        if (window.confirm('Are you sure you want to delete this result?')) {
            try {

                await axiosInstance.delete(`/api/surveys/results/${resultId}`);
                setResults(prevResults => prevResults.filter(result => result.id !== resultId));
            } catch (error) {
                console.error('Error deleting result:', error);
            }
        }
    };

    // Değiştirilen fonksiyon: resultId yerine surveyId'yi kullanarak doğrudan
    // applysurvey/apply/[surveyId]/result sayfasına yönlendiriyoruz
    const handleViewDetails = (result: SurveyResult) => {
        router.push(`/applysurvey/apply/${result.surveyId}/result`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">Loading results...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        marginBottom: 4,
                        background: 'linear-gradient(to right, #9333ea, #db2777)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    My Previous Results
                </Typography>

                {results.length > 0 ? (
                    <Paper elevation={3} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                        <List>
                            {results.map((result, index) => (
                                <React.Fragment key={result.id}>
                                    <ListItem
                                        sx={{
                                            py: 2,
                                            '&:hover': {
                                                backgroundColor: 'rgba(147, 51, 234, 0.05)'
                                            }
                                        }}
                                    >
                                        <ClipboardCheck
                                            size={24}
                                            style={{ color: '#9333ea', marginRight: '16px' }}
                                        />
                                        <ListItemText
                                            primary={
                                                <Typography variant="h6" component="div">
                                                    {result.surveyTitle}
                                                </Typography>
                                            }
                                            secondary={
                                                <FormattedDate date={result.createdAt} />
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    marginRight: 2,
                                                    backgroundColor: '#9333ea',
                                                    '&:hover': {
                                                        backgroundColor: '#7928ca'
                                                    }
                                                }}
                                                onClick={() => handleViewDetails(result)}
                                            >
                                                View Details
                                            </Button>
                                            <IconButton
                                                edge="end"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(result.id);
                                                }}
                                                sx={{
                                                    color: '#dc2626',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(220, 38, 38, 0.1)'
                                                    }
                                                }}
                                            >
                                                {/* <Trash2 size={20} /> */}
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {index < results.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                ) : (
                    <Typography
                        variant="body1"
                        align="center"
                        color="text.secondary"
                        sx={{ mt: 4 }}
                    >
                        No results found. Try taking a survey first!
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default PreviousResults;