'use client';
import React, { useEffect, useState } from 'react';
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

interface Company {
    id: number;
    name: string;
    userCount?: number;
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: '#9333ea',
        cursor: 'pointer',
        '& .MuiTableCell-root': {
            color: 'white',
        },
        '& .action-badge': {
            backgroundColor: 'white',
            color: '#9333ea'
        }
    },
}));

const CompanyComponent: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8081/api/companies');
                setCompanies(response.data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const handleRowClick = (companyId: number) => {
        router.push(`/companies/${companyId}`);
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
                    Company Management
                </Typography>

                <Card elevation={3}>
                    <CardContent>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Company Name</TableCell>
                                        <TableCell>Number of Employees</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {companies.map((company) => (
                                        <StyledTableRow
                                            key={company.id}
                                            onClick={() => handleRowClick(company.id)}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{company.name}</TableCell>
                                            <TableCell>{company.userCount || 0} {(company.userCount === 1) ? 'Employee' : 'Employees'}</TableCell>
                                            <TableCell align="right">
                                                <span
                                                    className="action-badge"
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '16px',
                                                        backgroundColor: '#f3e8ff',
                                                        color: '#9333ea',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    View Employees
                                                </span>
                                            </TableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {companies.length === 0 && (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textAlign: 'center',
                                        py: 3,
                                        color: 'text.secondary'
                                    }}
                                >
                                    No companies found in the system.
                                </Typography>
                            )}
                        </TableContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CompanyComponent;