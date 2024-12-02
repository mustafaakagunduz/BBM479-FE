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
import { styled } from '@mui/material/styles';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
    params: Promise<{ userId: string }>;
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: '#9333ea',
        cursor: 'pointer',
        '& .MuiTableCell-root': {
            color: 'white'
        },
        '& .action-badge': {
            backgroundColor: 'white',
            color: '#9333ea'
        }
    },
}));

const UserSurveyResults = ({ params }: PageProps) => {
    const resolvedParams = use(params);
    const [results, setResults] = useState<SurveyResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const userResponse = await axios.get(`http://localhost:8081/api/users/${resolvedParams.userId}`);
                setUsername(userResponse.data.name);

                const resultsResponse = await axios.get(`http://localhost:8081/api/surveys/results/user/${resolvedParams.userId}`);
                setResults(resultsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [resolvedParams.userId]);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Back Button */}
                <div
                    onClick={() => router.push('/user-results')}
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
                    <span>Back to Users</span>
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
                    Survey Results for {username}
                </Typography>

                <Card elevation={3}>
                    <CardContent>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Survey Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {results.map((result) => (
                                        <StyledTableRow
                                            key={result.id}
                                            onClick={() => router.push(`/user-results/${resolvedParams.userId}/${result.id}`)}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{formatDate(result.createdAt)}</TableCell>
                                            <TableCell align="right">
                                                <span
                                                    className="action-badge"
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '16px',
                                                        backgroundColor: '#f3e8ff',
                                                        color: '#9333ea',
                                                        fontSize: '0.875rem',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}
                                                >
                                                    Details
                                                    <ArrowRight size={16} />
                                                </span>
                                            </TableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {results.length === 0 && (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textAlign: 'center',
                                        py: 3,
                                        color: 'text.secondary'
                                    }}
                                >
                                    No survey results found for this user.
                                </Typography>
                            )}
                        </TableContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserSurveyResults;