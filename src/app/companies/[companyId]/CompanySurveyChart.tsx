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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from 'lucide-react';

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
    const [companyName, setCompanyName] = useState<string>("");

    useEffect(() => {
        // Fetch company name when component mounts
        axios.get(`http://localhost:8081/api/companies/${companyId}`)
            .then(response => setCompanyName(response.data.name))
            .catch(error => console.error('Error fetching company:', error));

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
        <Card className="max-w-4xl mx-auto mt-8">
            <CardHeader className="py-6">
                <CardTitle className="text-center text-2xl lg:text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Survey-Based Employee Skill Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {companyName && (
                    <div className="text-center mb-6">
                        <h2 className="text-xl text-gray-700 font-semibold">{companyName}</h2>
                    </div>
                )}

                <div className="space-y-4 w-80 mx-auto mb-8">
                    <div className="relative">
                        <button
                            onClick={() => setIsSurveyDropdownOpen(!isSurveyDropdownOpen)}
                            className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                        >
                            {selectedSurvey ? surveys.find(s => s.id === selectedSurvey)?.title : "Select Survey"}
                            <ChevronDown size={20}/>
                        </button>
                        {isSurveyDropdownOpen && (
                            <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
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
                        <div className="h-96">
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
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: `${analysisData.companyName} - Skill Analysis`
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            max: 100,
                                            ticks: {
                                                stepSize: 10
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className="space-y-4 w-80 mx-auto mt-8">
                            <div className="relative">
                                <button
                                    onClick={() => setIsSkillDropdownOpen(!isSkillDropdownOpen)}
                                    className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                                >
                                    {selectedSkill || "Choose Skill to Inspect"}
                                    <ChevronDown size={20}/>
                                </button>
                                {isSkillDropdownOpen && (
                                    <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
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
                            <div className="mt-4 p-4 border rounded-lg bg-white">
                                <h3 className="text-lg font-semibold mb-3">
                                    {selectedSkill} - Individual Scores
                                </h3>
                                <div className="space-y-2">
                                    {[...skillDetails]
                                        .sort((a, b) => b.score - a.score)
                                        .map((detail) => (
                                            <div key={detail.userId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span>{detail.userName}</span>
                                                <span className="font-medium">{detail.score * 20}%</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default CompanySurveyChart;