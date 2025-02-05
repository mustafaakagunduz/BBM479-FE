'use client';
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const CompanyAdder = () => {
    const [newCompany, setNewCompany] = useState({ name: '', description: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAddCompany = async () => {
        if (newCompany.name.trim()) {
            try {
                setIsProcessing(true);
                const response = await axios.post('http://localhost:8081/api/companies', newCompany);
                setNewCompany({ name: '', description: '' });

                toast.success('Company added successfully', {
                    duration: 2000,
                    style: {
                        border: '1px solid #10B981',
                        padding: '12px',
                        color: '#059669',
                        backgroundColor: '#ECFDF5'
                    },
                });

                window.location.reload();
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Failed to add company';
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

    return (
        <div className="px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Card className="bg-white/90 backdrop-blur-sm">
                <Accordion type="single" collapsible>
                    <AccordionItem value="add-company">
                        <AccordionTrigger className="px-6 py-4">
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Add New Company
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 p-6 border border-purple-100 rounded-lg text-black mx-6 mb-6">
                                <input
                                    type="text"
                                    value={newCompany.name}
                                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                                    placeholder="Company Name"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                                />
                                <input
                                    type="text"
                                    value={newCompany.description}
                                    onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                                    placeholder="Company Description"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                                />
                                <button
                                    onClick={handleAddCompany}
                                    disabled={!newCompany.name.trim() || isProcessing}
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
                                            Add New Company
                                        </>
                                    )}
                                </button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>
        </div>
    );
};

export default CompanyAdder;