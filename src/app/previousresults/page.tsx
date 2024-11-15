// app/previousresults/page.tsx
'use client';

import React, { useEffect, useState, useCallback } from "react";
import NavbarUser from "@/app/components/navbars/NavbarUser";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import { Trash2, ClipboardCheck } from 'lucide-react';
import axios from 'axios';

interface ProfessionMatch {
    id: number;
    professionId: number;
    professionName: string;
    matchPercentage: number;
}

interface SurveyResult {
    id: number;
    userId: number;
    surveyId: number;
    attemptNumber: number;
    professionMatches: ProfessionMatch[];
    createdAt: string;
}

const PreviousResults: React.FC = () => {
    const router = useRouter();
    const [results, setResults] = useState<SurveyResult[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = 1; // Şimdilik sabit

    const fetchResults = useCallback(async () => {
        try {
            setLoading(true);
            // Tüm anketlerin sonuçlarını getir
            const API_BASE = 'http://localhost:8081/api/surveys';
            const response = await axios.get(`${API_BASE}/results/user/${userId}`);

            if (response.data) {
                setResults(response.data);
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    const handleDelete = async (resultId: number) => {
        if (window.confirm('Are you sure you want to delete this result?')) {
            try {
                const API_BASE = 'http://localhost:8081/api/surveys';
                await axios.delete(`${API_BASE}/results/${resultId}`);
                // Silinen sonucu state'den kaldır
                setResults(prevResults => prevResults.filter(result => result.id !== resultId));
            } catch (error) {
                console.error('Error deleting result:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <NavbarUser />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">Loading results...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <NavbarUser />
            <div className="container mx-auto px-4 py-8">

                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
                        My Previous Results
                    </h1>
                    {/* grid-cols değerlerini güncelliyoruz ve gap'i azaltıyoruz */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {results.map((result) => (
                            <Card
                                key={result.id}
                                className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white/90 backdrop-blur-sm border-purple-100"
                            >
                                {/* CardContent'e aspect-ratio ve min-height ekliyoruz */}
                                <CardContent className="p-6 aspect-square flex flex-col">
                                    {/* İkon ortalı */}
                                    <div className="flex justify-center mb-4">
                                        <ClipboardCheck
                                            size={32}  // Biraz daha büyük
                                            className="text-purple-600"
                                        />
                                    </div>
                                    {/* Tarih bilgisi - formatlanmış ve bold */}
                                    <div className="flex-1 flex items-center justify-center text-purple-600">
                                        <div className="text-center space-y-3">
                                            <div
                                                className="text-2xl">{new Date(result.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric'
                                            })}</div>
                                            <div
                                                className="text-2xl">{new Date(result.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric'
                                            })}</div>
                                            <div
                                                className="text-2xl">{new Date(result.createdAt).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            })}</div>
                                        </div>
                                    </div>

                                    {/* Butonlar yan yana */}
                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                                            onClick={() => router.push(`/previousresults/details/${result.id}`)}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(result.id);
                                            }}
                                        >
                                            <Trash2 size={20} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {results.length === 0 && (
                        <div className="text-center text-gray-600 mt-8">
                            No results found. Try taking a survey first!
                        </div>
                    )}
                </div>

                {results.length === 0 && (
                    <div className="text-center text-gray-600 mt-8">
                        No results found. Try taking a survey first!
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviousResults;