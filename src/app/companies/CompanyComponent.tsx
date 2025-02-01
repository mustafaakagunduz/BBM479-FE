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
    CardContent,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search, Pencil, Trash2, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Company {
    id: number;
    name: string;
    description: string;
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
        },
    },
}));

const CompanyComponent: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [editFormData, setEditFormData] = useState({ name: '', description: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        const filtered = companies.filter(company =>
            company.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCompanies(filtered);
    }, [searchTerm, companies]);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8081/api/companies');
            const sortedData = response.data.sort((a: Company, b: Company) => a.id - b.id);
            setCompanies(sortedData);
            setFilteredCompanies(sortedData);
        } catch (error) {
            console.error('Error fetching companies:', error);
            toast.error('Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (companyId: number) => {
        router.push(`/companies/${companyId}`);
    };

    const handleEditClick = (e: React.MouseEvent, company: Company) => {
        e.stopPropagation();
        setSelectedCompany(company);
        setEditFormData({ name: company.name, description: company.description });
        setEditDialogOpen(true);
    };

    const handleDeleteClick = (e: React.MouseEvent, company: Company) => {
        e.stopPropagation();
        setSelectedCompany(company);
        setDeleteDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        if (!selectedCompany) return;

        try {
            setIsProcessing(true);
            await axios.put(`http://localhost:8081/api/companies/${selectedCompany.id}`, editFormData);

            fetchCompanies(); // Refresh the list
            setEditDialogOpen(false);
            toast.success('Company updated successfully');
        } catch (error) {
            toast.error('Failed to update company');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedCompany) return;

        try {
            setIsProcessing(true);
            await axios.delete(`http://localhost:8081/api/companies/${selectedCompany.id}`);

            fetchCompanies(); // Refresh the list
            setDeleteDialogOpen(false);
            toast.success('Company deleted successfully');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete company';
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
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
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                                marginBottom: '1.5rem',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#e9d5ff',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#9333ea',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#9333ea',
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search className="text-purple-600" size={20} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Company Name</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="center">Number of Employees</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredCompanies.map((company) => (
                                        <StyledTableRow
                                            key={company.id}
                                            onClick={() => handleRowClick(company.id)}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{company.name}</TableCell>
                                            <TableCell>{company.description}</TableCell>
                                            <TableCell align="center">{company.userCount || 0}</TableCell>
                                            <TableCell align="right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={(e) => handleEditClick(e, company)}
                                                        className="p-2 text-yellow-600 hover:text-yellow-700 transition"
                                                        style={{backgroundColor: 'transparent'}}  // Şeffaf arka plan
                                                    >
                                                        <Pencil size={20}/>
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteClick(e, company)}
                                                        className="p-2 text-red-600 hover:text-red-700 transition"
                                                        style={{backgroundColor: 'transparent'}}  // Şeffaf arka plan
                                                    >
                                                        <Trash2 size={20}/>
                                                    </button>
                                                    <span
                                                        className="action-badge inline-flex items-center justify-center"
                                                        style={{
                                                            padding: '6px 12px',
                                                            borderRadius: '16px',
                                                            backgroundColor: '#f3e8ff',
                                                            color: '#9333ea',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
    {'View Employees'}
</span>
                                                </div>
                                            </TableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {filteredCompanies.length === 0 && (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textAlign: 'center',
                                        py: 3,
                                        color: 'text.secondary'
                                    }}
                                >
                                    {searchTerm ? 'No companies found matching your search.' : 'No companies found in the system.'}
                                </Typography>
                            )}
                        </TableContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Edit Company
                </DialogTitle>
                <DialogContent>
                    <div className="mt-4 space-y-4">
                        <TextField
                            fullWidth
                            label="Company Name"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            multiline
                            rows={3}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setEditDialogOpen(false)}
                        disabled={isProcessing}
                        sx={{ color: 'gray' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditSubmit}
                        disabled={isProcessing}
                        sx={{
                            backgroundColor: '#9333ea',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#7928d1'
                            }
                        }}
                    >
                        {isProcessing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Delete Company
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this company? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={isProcessing}
                        sx={{ color: 'gray' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={isProcessing}
                        sx={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#b91c1c'
                            }
                        }}
                    >
                        {isProcessing ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CompanyComponent;