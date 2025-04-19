'use client';
import React, { useEffect, useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Radio,
    RadioGroup,
    FormControlLabel,
    Typography,
    CircularProgress,
    Card,
    CardContent
} from '@mui/material';
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from "@/utils/axiosInstance";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

const AuthorizationSystem = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error details:', error);
            toast.error('Failed to load users', {
                duration: 2000,
                style: {
                    border: '1px solid #EF4444',
                    padding: '12px',
                    color: '#DC2626',
                    backgroundColor: '#FEE2E2'
                },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            await axiosInstance.put(`/api/users/${userId}/role`, {
                roleName: newRole
            });

            await fetchUsers();
            toast.success('User role updated successfully', {
                duration: 2000,
                style: {
                    border: '1px solid #10B981',
                    padding: '12px',
                    color: '#059669',
                    backgroundColor: '#ECFDF5'
                },
            });
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Failed to update user role', {
                duration: 2000,
                style: {
                    border: '1px solid #EF4444',
                    padding: '12px',
                    color: '#DC2626',
                    backgroundColor: '#FEE2E2'
                },
            });
        }
    };



    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">


            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom style={{ marginBottom: '2rem' }}>
                            User Authorization Management
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Username</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>
                                                <RadioGroup
                                                    row
                                                    value={user.role}  // DÜZELTILDI
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                >
                                                    <FormControlLabel
                                                        value="ADMIN"
                                                        control={<Radio />}
                                                        label="Admin"
                                                        disabled={user.id === 1}
                                                    />
                                                    <FormControlLabel
                                                        value="USER"
                                                        control={<Radio />}
                                                        label="User"
                                                        disabled={user.id === 1}
                                                    />
                                                </RadioGroup>
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

export default AuthorizationSystem;