'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    CircularProgress,
    TextField,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search } from 'lucide-react';
import { User } from "@/app/types/auth";

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

interface CompanyDetail {
    id: number;
    name: string;
    description: string;
    users: User[];
}

interface CompanyDetailComponentProps {
    companyId: string;
}

const CompanyDetailComponent: React.FC<CompanyDetailComponentProps> = ({ companyId }) => {
    const [company, setCompany] = useState<CompanyDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
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

    const filteredUsers = company?.users?.filter(user => {
        const searchTerms = searchQuery.toLowerCase();
        return (
            user.name.toLowerCase().includes(searchTerms) ||
            user.email.toLowerCase().includes(searchTerms)
        );
    }) || [];

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <Typography variant="body1" color="error" className="p-4">
                {error}
            </Typography>
        );
    }

    if (!company) {
        return (
            <Typography variant="body1" color="error" className="p-4">
                Company not found
            </Typography>
        );
    }

    return (
        <div className="p-4">
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search employees by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search size={20} className="text-gray-500" />
                        </InputAdornment>
                    ),
                    sx: {
                        '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#9333ea',
                            }
                        },
                        '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#9333ea',
                            }
                        }
                    }
                }}
            />

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
                        {filteredUsers.map((user) => (
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
                {filteredUsers.length === 0 && (
                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: 'center',
                            py: 3,
                            color: 'text.secondary'
                        }}
                    >
                        {searchQuery
                            ? "No employees found matching your search."
                            : "No employees found in this company."}
                    </Typography>
                )}
            </TableContainer>
        </div>
    );
};

export default CompanyDetailComponent;