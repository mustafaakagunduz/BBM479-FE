import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { industryService, Industry } from '../services/industryService';
import { toast } from 'react-hot-toast';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle
} from "@/app/components/ui/alert-dialog";

const AddIndustry = () => {
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [newIndustry, setNewIndustry] = useState({ name: '' });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
    const [loading, setLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [industryToDelete, setIndustryToDelete] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);


    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsInitialLoading(true);
                const data = await industryService.getAllIndustries();
                setIndustries(data);
            } catch (error) {
                toast.error('Failed to fetch industries', {
                    duration: 2000,
                    style: {
                        border: '1px solid #EF4444',
                        padding: '12px',
                        color: '#DC2626',
                        backgroundColor: '#FEE2E2'
                    },
                });
            } finally {
                setIsInitialLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleAddIndustry = async () => {
        if (newIndustry.name.trim()) {
            try {
                setIsProcessing(true);
                const createdIndustry = await industryService.createIndustry(newIndustry);

                // Direkt state'e ekle
                setIndustries(prev => [...prev, createdIndustry]);
                setNewIndustry({ name: '' });

                toast.success('Industry added successfully', {
                    duration: 2000,
                    style: {
                        border: '1px solid #10B981',
                        padding: '12px',
                        color: '#059669',
                        backgroundColor: '#ECFDF5'
                    },
                });
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Failed to add industry';
                toast.error(errorMessage, {
                    duration: 2000,
                    style: {
                        border: '1px solid #EF4444',
                        padding: '12px',
                        color: '#DC2626',
                        backgroundColor: '#FEE2E2'
                    },
                });
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleStartEdit = (industry: Industry) => {
        setEditingId(industry.id);
        setEditingIndustry({ ...industry });
    };

    const handleSaveEdit = async () => {
        if (editingIndustry && editingIndustry.name.trim()) {
            try {
                setIsProcessing(true);

                const existingIndustry = industries.find(ind =>
                    ind.name === editingIndustry.name && ind.id !== editingIndustry.id
                );

                if (existingIndustry) {
                    toast.error('This industry already exists', {
                        duration: 2000,
                        style: {
                            border: '1px solid #EF4444',
                            padding: '12px',
                            color: '#DC2626',
                            backgroundColor: '#FEE2E2'
                        },
                    });
                    return;
                }

                const updatedIndustry = await industryService.updateIndustry(editingIndustry.id, {
                    name: editingIndustry.name
                });

                // Direkt state'i güncelle
                setIndustries(prev => prev.map(industry =>
                    industry.id === editingIndustry.id ? updatedIndustry : industry
                ));

                setEditingId(null);
                setEditingIndustry(null);

                toast.success('Industry updated successfully', {
                    duration: 2000,
                    style: {
                        border: '1px solid #10B981',
                        padding: '12px',
                        color: '#059669',
                        backgroundColor: '#ECFDF5'
                    },
                });
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Failed to update industry';
                toast.error(errorMessage, {
                    duration: 2000,
                    style: {
                        border: '1px solid #EF4444',
                        padding: '12px',
                        color: '#DC2626',
                        backgroundColor: '#FEE2E2'
                    },
                });
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingIndustry(null);
    };

    const handleDeleteConfirm = async () => {
        if (industryToDelete !== null) {
            try {
                setIsProcessing(true);
                const result = await industryService.deleteIndustry(industryToDelete);

                if (result.success) {
                    setIndustries(prev => prev.filter(industry => industry.id !== industryToDelete));
                    setIndustryToDelete(null);

                    toast.success('Industry deleted successfully', {
                        duration: 2000,
                        style: {
                            border: '1px solid #10B981',
                            padding: '12px',
                            color: '#059669',
                            backgroundColor: '#ECFDF5'
                        },
                    });
                } else if (result.error) {
                    setDeleteError(result.error.message);
                    setIndustryToDelete(null);
                }
            } finally {
                setIsProcessing(false);
            }
        }
    };

    if (isInitialLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    // Rest of the JSX remains the same as in your original component...
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">

            <AlertDialog open={industryToDelete !== null}>
                <AlertDialogContent className="flex flex-col items-center justify-center p-6 bg-white">
                    <AlertDialogTitle className="text-xl font-semibold text-purple-600 mb-4">
                        Delete Industry
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-lg text-purple-500 mb-6">
                        Are you sure you want to delete this industry?
                    </AlertDialogDescription>
                    <div className="flex gap-4">
                        <button
                            onClick={handleDeleteConfirm}
                            disabled={isProcessing}
                            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                            {isProcessing ? (
                                <div className="flex items-center">
                                    <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white"></div>
                                    <span>Deleting...</span>
                                </div>
                            ) : (
                                'Delete'
                            )}
                        </button>
                        <button
                            onClick={() => setIndustryToDelete(null)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* Error Modal */}
            <AlertDialog open={!!deleteError}>
                <AlertDialogContent className="flex flex-col items-center justify-center p-6 bg-white">
                    <AlertDialogTitle className="text-xl font-semibold text-purple-600 mb-4">
                        Delete Failed
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-lg text-purple-500 mb-6">
                        {deleteError}
                    </AlertDialogDescription>
                    <button
                        onClick={() => setDeleteError(null)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        Close
                    </button>
                </AlertDialogContent>
            </AlertDialog>
            <div className="max-w-4xl mx-auto">
                <Card className="bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Industries Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Add New Industry Form */}
                        <div className="space-y-4 p-4 border border-purple-100 rounded-lg text-black">
                            <input
                                type="text"
                                value={newIndustry.name}
                                onChange={(e) => setNewIndustry({ name: e.target.value })}
                                placeholder="Industry Name"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                            />
                            <button
                                onClick={handleAddIndustry}
                                disabled={!newIndustry.name.trim() || isProcessing}
                                className="w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white"></div>
                                        <span>Adding...</span>
                                    </div>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        Add New Industry
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Industries List */}
                        <div className="space-y-4">
                            {industries.map(industry => (
                                <div key={industry.id} className="p-4 border border-gray-200 rounded-lg">
                                    {editingId === industry.id ? (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={editingIndustry?.name}
                                                onChange={(e) => setEditingIndustry({
                                                    ...editingIndustry!,
                                                    name: e.target.value
                                                })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 text-black"
                                                disabled={isProcessing}
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2"
                                                    disabled={isProcessing}
                                                >
                                                    <X size={20} />
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition flex items-center gap-2"
                                                    disabled={isProcessing}
                                                >
                                                    {isProcessing ? (
                                                        <div className="flex items-center">
                                                            <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white"></div>
                                                            <span>Saving...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Check size={20} />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-black">{industry.name}</h3>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStartEdit(industry)}
                                                    className="p-2 text-yellow-600 hover:text-yellow-700 transition"
                                                    disabled={isProcessing}
                                                >
                                                    <Pencil size={20} />
                                                </button>
                                                <button
                                                    onClick={() => setIndustryToDelete(industry.id)} // handleDeleteIndustry yerine modal'ı aç
                                                    className="p-2 text-red-600 hover:text-red-700 transition"
                                                    disabled={isProcessing}
                                                >
                                                    <Trash2 size={20}/>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddIndustry;