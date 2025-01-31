'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface User {
    id: number;
    name: string;
    email: string;
}

interface CompanyDetail {
    id: number;
    name: string;
    description: string;
    users: User[];
}

interface CompanyDetailComponentProps {
    companyId: string;
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#9333ea',
        '& .MuiTableCell-root': {
            color: 'white',
        },
        '& .action-badge': {
            backgroundColor: 'white',
            color: '#9333ea'
        }
    },
}));

const CompanyDetailComponent: React.FC<CompanyDetailComponentProps> = ({ companyId }) => {
    const [company, setCompany] = useState<CompanyDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`http://localhost:8081/api/companies/${companyId}`);
                setCompany(response.data);
            } catch (error) {
                console.error('Error fetching company details:', error);
                setError('Failed to load company details');
            } finally {
                setLoading(false);
            }
        };

        if (companyId) {
            fetchCompanyDetails();
        }
    }, [companyId]);

    const handleRowClick = (userId: number) => {
        router.push(`/companies/${companyId}/${userId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="p-8">
                <Typography variant="h6" color="error">
                    Company not found
                </Typography>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
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
                {company.name} - Employee List
            </Typography>

            <Card elevation={3}>
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Full Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {company.users && company.users.map((user) => (
                                    <StyledTableRow
                                        key={user.id}
                                        onClick={() => handleRowClick(user.id)}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell align="right">
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRowClick(user.id);
                                                }}
                                                className="action-badge"
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '16px',
                                                    backgroundColor: '#f3e8ff',
                                                    color: '#9333ea',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                View Test Results
                                            </span>
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {(!company.users || company.users.length === 0) && (
                            <Typography
                                variant="body1"
                                sx={{
                                    textAlign: 'center',
                                    py: 3,
                                    color: 'text.secondary'
                                }}
                            >
                                No employees found in this company.
                            </Typography>
                        )}
                    </TableContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default CompanyDetailComponent;