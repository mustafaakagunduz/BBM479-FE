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
    Snackbar,
    Alert,
    Card,
    CardContent
} from '@mui/material';

interface User {
    id: number;
    username: string;
    email: string;
    role: {
        name: string;
    };
}

const AuthorizationSystem = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/users');
            console.log('Response status:', response.status); // HTTP status'u görelim
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            console.log('Fetched data:', data); // Gelen datayı görelim
            setUsers(data);
        } catch (error) {
            console.error('Error details:', error); // Detaylı hata görelim
            setSnackbar({
                open: true,
                message: 'Failed to load users',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            const response = await fetch(`http://localhost:8081/api/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                // RoleUpdateRequest formatında gönderiyoruz
                body: JSON.stringify({
                    roleName: newRole
                })
            });

            if (!response.ok) throw new Error('Failed to update role');

            await fetchUsers(); // Listeyi yenile
            setSnackbar({
                open: true,
                message: 'User role updated successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error updating role:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update user role',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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
                                            <TableCell>{user.role.name}</TableCell>
                                            <TableCell>
                                                <RadioGroup
                                                    row
                                                    value={user.role.name}
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

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        variant="filled"
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
};

export default AuthorizationSystem;