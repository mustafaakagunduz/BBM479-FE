'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from "@/utils/axiosInstance";
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
    CardContent,
    TextField,
    InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search } from 'lucide-react';

interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    role: string;
    company?: {
        id: number;
        name: string;
    };
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

const UserResults = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/api/users');
                const filteredUsers = response.data.filter((user: User) => user.role === 'USER');
                setUsers(filteredUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Geliştirilmiş arama filtreleme fonksiyonu
    const filteredUsers = users.filter(user => {
        const searchTerms = searchQuery.toLowerCase();
        return (
            user.name.toLowerCase().includes(searchTerms) ||
            user.email.toLowerCase().includes(searchTerms) ||
            user.company?.name.toLowerCase().includes(searchTerms)
        );
    });

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
                    User Survey Results
                </Typography>

                <Card elevation={3}>
                    <CardContent>
                        <div style={{ marginBottom: '1rem' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search by name, email or company..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                        </div>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Company</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <StyledTableRow
                                            key={user.id}
                                            onClick={() => router.push(`/user-results/${user.id}`)}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {user.company?.name || (
                                                    <span style={{ color: '#6b7280', fontStyle: 'italic' }}>
                                                        Not Assigned
                                                    </span>
                                                )}
                                            </TableCell>
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
                                                    View Results
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
                                    No users found matching your search.
                                </Typography>
                            )}
                        </TableContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserResults;