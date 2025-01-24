"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminGuard from "@/app/components/guards/AdminGuard";

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
    const [skillStats, setSkillStats] = useState<SkillStats[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/companies');
                const data = await response.json();
                console.log('Fetched companies:', data);
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
        console.log('Selected company ID:', companyId);
    
        setSkillStats([]);
        if (!companyId) return;
    
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:8081/api/company-charts/${companyId}/skills/stats`);
            const data = await response.json();
            console.log('API Response:', data);
            setSkillStats(data);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Failed to fetch company statistics');
        } finally {
            setLoading(false);
        }
    };
    

    const getChartData = () => {
        if (!skillStats.length) {
            console.log('No skill stats available');
            return [];
        }

        const chartData = skillStats.map(stat => ({
            name: stat.skillName,
            belowAverage: parseFloat(stat.belowAverageScore.toFixed(2)),
            companyAverage: parseFloat(stat.companyAverage.toFixed(2)),
            aboveAverage: parseFloat(stat.aboveAverageScore.toFixed(2))
        }));
        chartData.forEach((data) => {
            console.log(data.name, data.belowAverage, data.companyAverage, data.aboveAverage);
          });
        console.log('Generated chart data:', chartData);
        return chartData;
    };

    const renderTopPerformers = () => {
        if (!skillStats.length) return <div className="text-gray-500">No data available</div>;

        const allPerformers = skillStats.flatMap(stat => 
            stat.aboveAverageUsers.map(user => ({
                ...user,
                skillName: stat.skillName
            }))
        );

        console.log('Rendering top performers:', allPerformers);
        return (
            <div className="space-y-4">
                {allPerformers.map((user, index) => (
                    <div key={`${user.userId}-${index}`}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                            <div className="font-medium">{user.userName}</div>
                            <div className="text-sm text-gray-500">{user.skillName}</div>
                        </div>
                        <span className="font-semibold text-purple-600">
                            {user.skillScore.toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    const chartData = getChartData();
    console.log('Final chart data:', chartData);

    return (
        <AdminGuard>
            <div className="container mx-auto p-4">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Company Performance Analytics</h2>
                    <select 
                        onChange={handleCompanySelect}
                        className="w-full max-w-xs p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">Select a company</option>
                        {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div>

                {loading && (
                    <div className="text-center text-gray-600">Loading...</div>
                )}
                
                {error && (
                    <div className="text-red-500 mb-4">{error}</div>
                )}

                {skillStats.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-96 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                                            <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                                            <Legend />
                                            <Bar dataKey="belowAverage" name="Below Average" fill="#ef4444" />
                                            <Bar dataKey="companyAverage" name="Company Average" fill="#3b82f6" />
                                            <Bar dataKey="aboveAverage" name="Above Average" fill="#22c55e" />
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
        </AdminGuard>
    );
}