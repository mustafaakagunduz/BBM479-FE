// app/companycharts/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Company {
    id: number;
    name: string;
}

interface SkillStats {
    skillId: number;
    skillName: string;
    companyAverage: number;
    aboveAverageScore: number;
    belowAverageScore: number;
    aboveAverageUsers: {
        userId: number;
        userName: string;
        skillScore: number;
    }[];
}

export default function CompanyCharts() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
    const [skillStats, setSkillStats] = useState<SkillStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/companies');
                const data = await response.json();
                setCompanies(data);
            } catch (err) {
                console.error('Error fetching companies:', err);
                setError('Failed to fetch companies');
            }
        };
        fetchCompanies();
    }, []);
    const handleCompanySelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const companyId = e.target.value;
        if (!companyId) return; // Boş seçim yapıldıysa işlemi durdur
        
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:8081/api/company-charts/${companyId}/skills/stats`);
            const data = await response.json();
            console.log("Backend response:", data); // Debug için
            setSkillStats(data);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Failed to fetch company statistics');
        } finally {
            setLoading(false);
        }
    };
 // Top Performers card'ını güncelleyelim
 const renderTopPerformers = () => {
    if (!skillStats?.aboveAverageUsers?.length) {
        return <div className="text-gray-500">No top performers data available</div>;
    }

    return (
        <div className="space-y-4">
            {skillStats.aboveAverageUsers.map((user) => (
                <div 
                    key={user.userId}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                    <span>{user.userName}</span>
                    <span className="font-semibold">
                        {user.skillScore.toFixed(1)}%
                    </span>
                </div>
            ))}
        </div>
    );
};

    const chartData = skillStats ? [
        {
            name: 'Below Average',
            value: skillStats.belowAverageScore,
        },
        {
            name: 'Company Average',
            value: skillStats.companyAverage,
        },
        {
            name: 'Above Average',
            value: skillStats.aboveAverageScore,
        },
    ] : [];

    return (
        <div className="container mx-auto p-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Company Performance Analytics</h2>
                <select 
                    onChange={handleCompanySelect}
                    className="w-[280px] px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                            {company.name}
                        </option>
                    ))}
                </select>
            </div>
    
            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
    
            {skillStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Performance Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar 
                                            dataKey="value" 
                                            fill="#8884d8"
                                            name="Skill Score (%)"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
    
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderTopPerformers()}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}