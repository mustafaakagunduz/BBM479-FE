import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';

import axiosInstance from "@/utils/axiosInstance";

interface CompanyDescriptionCardProps {
    companyId: string;
}

const CompanyDescriptionCard: React.FC<CompanyDescriptionCardProps> = ({ companyId }) => {
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCompanyDescription = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/api/companies/${companyId}`);setDescription(response.data.description || 'No description available');
            } catch (error) {
                console.error('Error fetching company description:', error);
                setError('Failed to load company description');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDescription();
    }, [companyId]);

    if (loading) {
        return (
            <Card elevation={3} className="w-full">
                <CardContent>
                    <div className="animate-pulse">
                        <div className="h-4 bg-purple-100 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-purple-100 rounded w-1/2"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card elevation={3} className="w-full">
                <CardContent>
                    <Typography color="error">{error}</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card elevation={3} className="w-full">
            <CardContent>
                <Typography
                    variant="h6"
                    sx={{
                        background: 'linear-gradient(to right, #9333ea, #ec4899)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '1rem',
                        fontWeight: 'bold'
                    }}
                >
                    Company Description
                </Typography>
                <Typography variant="body1" className="text-gray-700">
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CompanyDescriptionCard;