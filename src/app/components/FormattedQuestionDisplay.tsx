import React, { useEffect, useState } from 'react';

interface QuestionOption {
    level: number;
    description: string;
}

interface Question {
    content: string;
    options: QuestionOption[];
}

interface FormattedQuestionDisplayProps {
    question: Question;
    selectedLevel?: number;
    onAnswerSelect: (level: number) => void;
    className?: string;
}

const FormattedQuestionDisplay: React.FC<FormattedQuestionDisplayProps> = ({
                                                                               question,
                                                                               selectedLevel,
                                                                               onAnswerSelect,
                                                                               className = ""
                                                                           }) => {
    // Karıştırılmış seçenekleri tutacak state
    const [shuffledOptions, setShuffledOptions] = useState<QuestionOption[]>([]);

    // Sayıdan harfe çeviren yardımcı fonksiyon (artık indekse göre)
    const getLetter = (index: number): string => {
        return String.fromCharCode(65 + index); // 0 -> A, 1 -> B, 2 -> C, ...
    };

    // Seçenekleri karıştıran fonksiyon
    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Component mount olduğunda ve question değiştiğinde seçenekleri karıştır
    useEffect(() => {
        // Seçenekleri karıştır
        const shuffled = shuffleArray(question.options);
        setShuffledOptions(shuffled);
    }, [question]);

    // Eğer shuffledOptions henüz set edilmediyse loading göster
    if (shuffledOptions.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Question content */}
            <div
                className={`prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto ${className}`}
                dangerouslySetInnerHTML={{ __html: question.content }}
            />

            {/* Options */}
            <div className="space-y-3 mt-6">
                {shuffledOptions.map((option, index) => (
                    <button
                        key={option.level}
                        onClick={() => onAnswerSelect(option.level)}
                        className={`w-full p-4 text-left rounded-lg transition-colors ${
                            selectedLevel === option.level
                                ? 'bg-purple-100 border-2 border-purple-500 text-purple-900'
                                : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                selectedLevel === option.level
                                    ? 'border-purple-500 bg-purple-500 text-white'
                                    : 'border-gray-300 text-gray-500'
                            }`}>
                                {getLetter(index)} {/* Artık level yerine index kullanıyoruz */}
                            </div>
                            <p className="text-sm sm:text-base">{option.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FormattedQuestionDisplay;