import React from 'react';

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
  // Sayıdan harfe çeviren yardımcı fonksiyon
  const getLetter = (num: number): string => {
    return String.fromCharCode(64 + num); // 1 -> A, 2 -> B, 3 -> C, ...
  };

  return (
    <div className="space-y-6">
      {/* Question content */}
      <div 
        className={`prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto ${className}`}
        dangerouslySetInnerHTML={{ __html: question.content }}
      />
      
      {/* Options */}
      <div className="space-y-3 mt-6">
        {question.options.map((option) => (
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
                {getLetter(option.level)}
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