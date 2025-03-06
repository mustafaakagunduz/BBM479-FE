"use client";
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface CompanySurveyChartProps {
    companyId: string;
}

interface Survey {
    id: number;
    title: string;
}

interface SkillScore {
    skillName: string;
    averageScore: number;
}

interface CompanyAnalysis {
    companyId: number;
    companyName: string;
    skillScores: SkillScore[];
}

interface SkillDetail {
    userId: number;
    userName: string;
    score: number;
}

function CompanySurveyChart({ companyId }: CompanySurveyChartProps) {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [selectedSurvey, setSelectedSurvey] = useState<number>();
    const [analysisData, setAnalysisData] = useState<CompanyAnalysis | null>(null);
    const [isSurveyDropdownOpen, setIsSurveyDropdownOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
    const [skillDetails, setSkillDetails] = useState<SkillDetail[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8081/api/surveys')
            .then(response => setSurveys(response.data))
            .catch(error => console.error('Error fetching surveys:', error));
    }, [companyId]);

    useEffect(() => {
        if (selectedSurvey) {
            axios.get(`http://localhost:8081/api/analysis/company/${companyId}/survey/${selectedSurvey}/skills`)
                .then(response => setAnalysisData(response.data))
                .catch(error => console.error('Error fetching analysis:', error));
        }
    }, [companyId, selectedSurvey]);

    const fetchSkillDetails = async (skillName: string) => {
        try {
            const response = await axios.get(
                `http://localhost:8081/api/analysis/company/${companyId}/survey/${selectedSurvey}/skill/${skillName}/details`
            );
            setSkillDetails(response.data);
        } catch (error) {
            console.error('Error fetching skill details:', error);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Company Skill Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mb-8">
                    <div className="relative" style={{ zIndex: 50 }}>
                        <button
                            onClick={() => setIsSurveyDropdownOpen(!isSurveyDropdownOpen)}
                            className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                        >
                            {selectedSurvey ? surveys.find(s => s.id === selectedSurvey)?.title : "Select Survey"}
                            <ChevronDown size={20}/>
                        </button>
                        {isSurveyDropdownOpen && (
                            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto max-h-48">
                                {surveys.map(survey => (
                                    <div
                                        key={survey.id}
                                        onClick={() => {
                                            setSelectedSurvey(survey.id);
                                            setIsSurveyDropdownOpen(false);
                                        }}
                                        className="px-4 py-2 cursor-pointer hover:bg-purple-100"
                                    >
                                        {survey.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {analysisData && (
                    <>
                        <Card className="mb-8 w-full">
                            <CardHeader>
                                <CardTitle>Skill Score Distribution</CardTitle>
                            </CardHeader>
                            <CardContent className="w-full">
                                <div className="w-full h-64 sm:h-80 md:h-96">
                                    <Bar
                                        data={{
                                            labels: [...analysisData.skillScores]
                                                .sort((a, b) => b.averageScore - a.averageScore)
                                                .map(score => score.skillName),
                                            datasets: [{
                                                label: 'Skill Scores',
                                                data: [...analysisData.skillScores]
                                                    .sort((a, b) => b.averageScore - a.averageScore)
                                                    .map(score => score.averageScore * 20),
                                                backgroundColor: 'rgba(147, 51, 234, 0.5)',
                                                borderColor: 'rgb(147, 51, 234)',
                                                borderWidth: 1
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                title: {
                                                    display: false
                                                },
                                                legend: {
                                                    position: 'top' as const,
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    max: 100,
                                                    ticks: {
                                                        stepSize: 10
                                                    }
                                                },
                                                x: {
                                                    ticks: {
                                                        autoSkip: true,
                                                        maxRotation: 45,
                                                        minRotation: 45
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mt-8">
                            <div className="relative" style={{ zIndex: 40 }}>
                                <button
                                    onClick={() => setIsSkillDropdownOpen(!isSkillDropdownOpen)}
                                    className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                                >
                                    {selectedSkill || "Choose Skill to Inspect"}
                                    <ChevronDown size={20}/>
                                </button>
                                {isSkillDropdownOpen && (
                                    <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto max-h-48">
                                        {[...analysisData.skillScores]
                                            .sort((a, b) => a.skillName.localeCompare(b.skillName))
                                            .map(score => (
                                                <div
                                                    key={score.skillName}
                                                    onClick={() => {
                                                        setSelectedSkill(score.skillName);
                                                        setIsSkillDropdownOpen(false);
                                                        fetchSkillDetails(score.skillName);
                                                    }}
                                                    className="px-4 py-2 cursor-pointer hover:bg-purple-100"
                                                >
                                                    {score.skillName}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedSkill && skillDetails.length > 0 && (
                            <Card className="mt-8 w-full">
                                <CardHeader>
                                    <CardTitle>{selectedSkill} - Individual Scores</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col space-y-2 w-full">
                                        {[...skillDetails]
                                            .sort((a, b) => a.score - b.score)
                                            .map((detail) => (
                                                <div key={detail.userId} className="flex justify-between items-center p-2 bg-gray-50 rounded w-full">
                                                    <span className="truncate mr-2">{detail.userName}</span>
                                                    <span className="font-medium whitespace-nowrap">{detail.score * 20}%</span>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default CompanySurveyChart;