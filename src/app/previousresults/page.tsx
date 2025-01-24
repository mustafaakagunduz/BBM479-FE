'use client';

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { /* Trash2, */ ClipboardCheck } from 'lucide-react';
import axios from 'axios';
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
    Divider
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
    attemptNumber: number;
    professionMatches: ProfessionMatch[];
    createdAt: string;
}

const PreviousResults: React.FC = () => {
    const router = useRouter();
    const [results, setResults] = useState<SurveyResult[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchResults = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const API_BASE = 'http://localhost:8081/api/surveys';
            const response = await axios.get(`${API_BASE}/results/user/${user.id}`);

            if (response.data) {
                setResults(response.data);
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
                const API_BASE = 'http://localhost:8081/api/surveys';
                await axios.delete(`${API_BASE}/results/${resultId}`);
                setResults(prevResults => prevResults.filter(result => result.id !== resultId));
            } catch (error) {
                console.error('Error deleting result:', error);
            }
        }
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
                                                <Typography variant="h6">
                                                    {new Date(result.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(result.createdAt).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false
                                                    })}
                                                </Typography>
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
                                                onClick={() => router.push(`/previousresults/details/${result.id}`)}
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