import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import SurveyResult from './SurveyResult';
// Mock veri
const mockSurveys = [
  {
    id: 1,
    title: "Yazılım Geliştirme Becerileri Değerlendirmesi",
    description: "Bu anket, yazılım geliştirme becerilerinizi değerlendirmek için tasarlanmıştır.",
    questions: [
      {
        title: "Problem çözme yaklaşımınızı en iyi hangisi tanımlar?",
        options: [
          "Sistematik ve analitik düşünme",
          "Sezgisel ve yaratıcı düşünme",
          "Takım bazlı problem çözme",
          "Deneme-yanılma yaklaşımı",
          "Araştırma odaklı yaklaşım"
        ],
        skill: "Analytical Thinking",
        relevance: {
          "Data Scientist": 5,
          "Digital Forensics Analyst": 4,
          "Database Architect": 3
        }
      },
      {
        title: "Yeni bir teknoloji ile karşılaştığınızda nasıl adapte olursunuz?",
        options: [
          "Hemen dökümanları okumaya başlarım",
          "Örnek projeleri incelerim",
          "Deneme projesi oluştururum",
          "Online eğitimler alırım",
          "Topluluk forumlarını takip ederim"
        ],
        skill: "Change Management",
        relevance: {
          "Data Scientist": 4,
          "Digital Forensics Analyst": 5,
          "Database Architect": 4
        }
      }
    ]
  }
];

interface Answer {
  questionIndex: number;
  selectedOption: number;
}

const MakeSurvey = () => {
  const [currentSurvey, setCurrentSurvey] = useState(mockSurveys[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    const existingAnswerIndex = answers.findIndex(
      a => a.questionIndex === currentQuestionIndex
    );

    if (existingAnswerIndex !== -1) {
      newAnswers[existingAnswerIndex].selectedOption = optionIndex;
    } else {
      newAnswers.push({
        questionIndex: currentQuestionIndex,
        selectedOption: optionIndex
      });
    }

    setAnswers(newAnswers);
  };

  const isOptionSelected = (optionIndex: number) => {
    return answers.some(
      a => a.questionIndex === currentQuestionIndex && a.selectedOption === optionIndex
    );
  };

  const handleSubmit = () => {
    console.log("Survey Completed!");
    setSubmitted(true); // Update state to indicate submission
    setIsCompleted(true); // Update state to indicate completion
};

  const currentQuestion = currentSurvey.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentSurvey.questions.length - 1;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
      
          <SurveyResult  />

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {currentSurvey.title}
            </CardTitle>
            <p className="text-gray-600 mt-2">{currentSurvey.description}</p>
          </CardHeader>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Soru {currentQuestionIndex + 1} / {currentSurvey.questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700">{currentQuestion.title}</h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                    isOptionSelected(index)
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              currentQuestionIndex === 0
                ? 'opacity-0 pointer-events-none'
                : 'bg-white text-purple-600 hover:bg-purple-50'
            }`}
          >
            <ChevronLeft size={20} />
            Önceki Soru
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={answers.length < currentSurvey.questions.length}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                answers.length < currentSurvey.questions.length
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
              }`}
            >
              Anketi Tamamla
              <Send size={20} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(currentSurvey.questions.length - 1, prev + 1))}
              disabled={!answers.some(a => a.questionIndex === currentQuestionIndex)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                !answers.some(a => a.questionIndex === currentQuestionIndex)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
              }`}
            >
              Sonraki Soru
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MakeSurvey;