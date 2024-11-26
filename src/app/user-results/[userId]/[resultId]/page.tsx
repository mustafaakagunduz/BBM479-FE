'use client';
import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Card,
    CardContent
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import SurveySpiderChart from "@/app/components/charts/SurveySpiderChart";

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

interface PageProps {
    params: Promise<{
        userId: string;
        resultId: string;
    }>;
}

const ResultDetails = ({ params }: PageProps) => {
    const resolvedParams = use(params);
    const router = useRouter();
    const [result, setResult] = useState<SurveyResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Kullanıcı bilgilerini al
                const userResponse = await axios.get(`http://localhost:8081/api/users/1`);
                setUsername(userResponse.data.name);

                // Sonuçları al
                const allResultsResponse = await axios.get(`http://localhost:8081/api/surveys/results/user/1`);
                if (allResultsResponse.data) {
                    const targetResult = allResultsResponse.data.find(
                        (r: SurveyResult) => r.id === parseInt(resolvedParams.resultId)
                    );

                    if (targetResult) {
                        setResult(targetResult);
                    } else {
                        setError('Result not found');
                    }
                }
            } catch (err) {
                console.error('Error fetching result:', err);
                setError('Failed to fetch result details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [resolvedParams.userId, resolvedParams.resultId]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography color="error">
                                {error || 'Result not found'}
                            </Typography>
                            <div
                                onClick={() => router.push(`/user-results/${resolvedParams.userId}`)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    marginTop: '1rem',
                                    color: '#9333ea',
                                }}
                            >
                                <ArrowLeft size={20} />
                                <span>Back to Results</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Back Button */}
                <div
                    onClick={() => router.push(`/user-results/${resolvedParams.userId}`)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        marginBottom: '1rem',
                        color: '#9333ea',
                    }}
                >
                    <ArrowLeft size={20} />
                    <span>Back to Results</span>
                </div>

                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        background: 'linear-gradient(to right, #9333ea, #ec4899)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '2rem',
                        fontWeight: 'bold'
                    }}
                >
                    Survey Result for {username}
                </Typography>

                <Card elevation={3}>
                    <CardContent>
                        {/* Sonuç Detayları */}
                        <div className="mb-6">
                            <Typography variant="subtitle1" color="textSecondary">
                                Completed on: {formatDate(result.createdAt)}
                            </Typography>

                        </div>

                        {/* Spider Chart */}
                        {result.professionMatches && result.professionMatches.length > 0 && (
                            <div className="h-[500px] w-full">
                                <SurveySpiderChart professionMatches={result.professionMatches} />
                            </div>
                        )}

                        {/* Profession Matches Table */}
                        <TableContainer component={Paper} sx={{ mt: 4 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Profession</TableCell>
                                        <TableCell align="right">Match Percentage</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {result.professionMatches.map((match) => (
                                        <TableRow key={match.id}>
                                            <TableCell>{match.professionName}</TableCell>
                                            <TableCell align="right">
                                                <span
                                                    style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '16px',
                                                        backgroundColor: '#f3e8ff',
                                                        color: '#9333ea',
                                                    }}
                                                >
                                                    {match.matchPercentage.toFixed(1)}%
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResultDetails;