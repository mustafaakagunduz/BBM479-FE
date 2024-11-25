'use client';

import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
    TooltipItem
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface ProfessionMatch {
    id: number;
    professionId: number;
    professionName: string;
    matchPercentage: number;
}

interface SurveyResultProps {
    professionMatches?: ProfessionMatch[];
}

const SurveySpiderChart: React.FC<SurveyResultProps> = ({ professionMatches = [] }) => {
    if (!professionMatches || professionMatches.length === 0) {
        return (
            <div className="w-full p-6 text-center text-gray-500">
                No match data available
            </div>
        );
    }

    const uniqueProfessions = Array.from(
        new Map(professionMatches.map(match => [match.professionId, match]))
            .values()
    ).sort((a, b) => b.matchPercentage - a.matchPercentage);

    const chartData: ChartData<'radar'> = {
        labels: uniqueProfessions.map(match => match.professionName), // Meslek isimlerini label olarak kullanıyoruz
        datasets: [
            {
                label: 'Match Percentage',
                data: uniqueProfessions.map(match => match.matchPercentage),

                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(139, 92, 246, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(139, 92, 246, 1)',
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBorderWidth: 2,
            },
        ],
    };

    const chartOptions: ChartOptions<'radar'> = {
        responsive: true,
        scales: {
            r: {
                min: 0,
                max: 100,
                beginAtZero: true,
                angleLines: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    stepSize: 20,
                    backdropColor: 'transparent',
                },
                pointLabels: {
                    display: true, // Etiketleri gösteriyoruz
                    font: {
                        size: 14,
                        family: 'Inter' // veya kullandığınız font
                    },
                    color: 'rgba(0, 0, 0, 0.7)' // Etiket rengi
                }
            }
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'white',
                titleColor: 'black',
                bodyColor: 'black',
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                padding: {
                    top: 15,
                    bottom: 15,
                    left: 20,
                    right: 20
                },
                usePointStyle: true,
                titleFont: {
                    size: 16,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 14
                },
                callbacks: {
                    title(tooltipItems: TooltipItem<'radar'>[]) {
                        const index = tooltipItems[0].dataIndex;
                        return uniqueProfessions[index].professionName;
                    },
                    label(context: TooltipItem<'radar'>) {
                        if (typeof context.raw === 'number') {
                            return `Match: ${context.raw.toFixed(1)}%`;
                        }
                        return '';
                    },
                },
            },
        },
        elements: {
            line: {
                tension: 0.3,
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="w-full" style={{ height: '400px' }}>
            <Radar data={chartData} options={chartOptions} />
        </div>
    );
};

export default SurveySpiderChart;