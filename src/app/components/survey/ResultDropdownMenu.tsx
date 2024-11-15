// src/app/components/survey/ResultDropdownMenu.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

interface ResultHeaderProps {
    currentResult: SurveyResult;
    allResults: SurveyResult[];
    onResultSelect: (result: SurveyResult) => void;
}

const ResultDropdownMenu: React.FC<ResultHeaderProps> = ({
                                                       currentResult,
                                                       allResults,
                                                       onResultSelect
                                                   }) => {
    const [isOpen, setIsOpen] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const renderButtonContent = () => {
        return (
            <div className="w-full flex justify-between items-center">
                <div className="flex flex-col">
                <span className="text-sm font-normal">
                    {formatDate(currentResult.createdAt)}
                </span>
                </div>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
        );
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-64 flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200"
            >
                {renderButtonContent()}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                        {allResults.map((result) => (
                            <button
                                key={result.id}
                                onClick={() => {
                                    onResultSelect(result);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors ${
                                    result.id === currentResult.id ? 'bg-purple-100' : ''
                                }`}
                            >
                                <div className="text-sm text-gray-600">
                                    {formatDate(result.createdAt)}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultDropdownMenu;