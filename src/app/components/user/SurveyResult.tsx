import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, TooltipItem } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type SkillRequirement = {
    level: number;
    weight: number;
};

type ProfessionSkills = {
    requiredSkills: {
        [skill: string]: SkillRequirement;
    };
};

type SkillMatrix = {
    [profession: string]: ProfessionSkills;
};

type Answer = {
    skill: string;
    level: number;
};

const skillMatrix: SkillMatrix = {
    "Data Scientist": {
        requiredSkills: {
            "Analytical Thinking": { level: 5, weight: 1 },
            "Critical Thinking": { level: 4, weight: 1 },
            "Change Management": { level: 3, weight: 1 },
        }
    },
    "Digital Forensics Analyst": {
        requiredSkills: {
            "Analytical Thinking": { level: 4, weight: 1 },
            "Critical Thinking": { level: 5, weight: 1 },
            "Change Management": { level: 2, weight: 1 },
        }
    },
    "Database Architect": {
        requiredSkills: {
            "Analytical Thinking": { level: 3, weight: 1 },
            "Critical Thinking": { level: 4, weight: 1 },
            "Change Management": { level: 4, weight: 1 },
        }
    }
};

const mockAnswers: Answer[] = [
    { skill: "Analytical Thinking", level: 4 },
    { skill: "Critical Thinking", level: 5 },
    { skill: "Change Management", level: 3 },
];

const SurveyResult: React.FC<{ answers?: Answer[] }> = ({ answers = mockAnswers }) => {
    const [spiderData, setSpiderData] = useState<any[]>([]);

    useEffect(() => {
        const skills = new Set<string>();
        Object.values(skillMatrix).forEach(profession => {
            Object.keys(profession.requiredSkills).forEach(skill => skills.add(skill));
        });

        const data = Array.from(skills).map(skill => {
            const dataPoint: any = { skill };
            Object.keys(skillMatrix).forEach(profession => {
                const requiredLevel = skillMatrix[profession].requiredSkills[skill]?.level || 0;
                const userAnswer = answers.find(a => a.skill === skill);
                const userLevel = userAnswer ? userAnswer.level : 0;
                dataPoint[profession] = Math.round((userLevel / requiredLevel) * 100);
            });
            return dataPoint;
        });

        setSpiderData(data);
    }, [answers]);

    // Chart.js için veri hazırlama
    const chartData = {
        labels: spiderData.map(item => item.skill),
        datasets: Object.keys(skillMatrix).map((profession, index) => ({
            label: profession,
            data: spiderData.map(item => item[profession]),
            backgroundColor: `hsl(${index * 120}, 70%, 50%, 0.3)`,
            borderColor: `hsl(${index * 120}, 70%, 50%)`,
            borderWidth: 2,
        })),
    };

    const options = {
        scales: {
            r: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20,
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem: TooltipItem<'radar'>) => {
                        // TooltipItem ile gelen label'ı kullan
                        const datasetLabel = tooltipItem.dataset.label || 'Unknown';
                        return `${datasetLabel}: ${tooltipItem.raw}%`;
                    },
                },
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <Card className="bg-white/90 backdrop-blur-sm mb-8">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Yetenek-Meslek Uyum Analizi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full">
                            <Radar data={chartData} options={options} />
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4 justify-center">
                            {Object.keys(skillMatrix).map((profession, index) => (
                                <div key={profession} className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: `hsl(${index * 120}, 70%, 50%)` }}
                                    />
                                    <span className="text-sm font-medium text-gray-700">{profession}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SurveyResult;
