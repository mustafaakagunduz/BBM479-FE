import React, { useState } from 'react';
import { PlusCircle, Save, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// Define the structure for a question
type Question = {
  content: string;
  options: string[];
  selectedSkill: string;
};

// Define the structure for a position
type Position = {
  name: string;
  skillLevels: Record<string, number>;
};

const SurveyBuilder: React.FC = () => {
  const [surveyTitle, setSurveyTitle] = useState<string>('');
  const [skills, setSkills] = useState<string[]>(Array(5).fill('')); // Start with 5 empty skill boxes
  const [positions, setPositions] = useState<Position[]>([]);
  const [currentPosition, setCurrentPosition] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Initialize a new question
  const createNewQuestion = (): Question => ({
    content: '',
    options: Array(5).fill(''),
    selectedSkill: '',
  });

  const addSkillBox = () => {
    setSkills([...skills, '']);
  };

  const updateSkill = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  const removeSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const addPosition = () => {
    if (currentPosition.trim()) {
      const newPosition: Position = {
        name: currentPosition,
        skillLevels: skills.filter(skill => skill.trim()).reduce((acc, skill) => {
          acc[skill] = 1;
          return acc;
        }, {} as Record<string, number>)
      };
      setPositions([...positions, newPosition]);
      setCurrentPosition('');
    }
  };

  const updateSkillLevel = (positionIndex: number, skill: string, level: number) => {
    const updatedPositions = [...positions];
    updatedPositions[positionIndex].skillLevels[skill] = level;
    setPositions(updatedPositions);
  };

  // Question management functions
  const addQuestion = () => {
    setQuestions([...questions, createNewQuestion()]);
  };

  const updateQuestionContent = (index: number, content: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].content = content;
    setQuestions(updatedQuestions);
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };



  const updateSelectedSkill = (questionIndex: number, skill: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].selectedSkill = skill;
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const steps = [
    {
      title: "Survey Details & Skills",
      content: (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Survey Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Survey Title</label>
              <input
                type="text"
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"

                placeholder="Enter survey title..."
              />
            </div>
            <div className="space-y-4">
              <label className="text-lg font-medium text-gray-700">ADD SKILLS</label>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"

                      placeholder={`Skill ${index + 1}`}
                    />
                    <button
                      onClick={() => removeSkill(index)}
                      className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addSkillBox}
                className="w-full py-3 rounded-lg bg-purple-100 text-purple-600 font-medium hover:bg-purple-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add More Skills
              </button>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      title: "Add Positions",
      content: (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Add Position
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Position Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentPosition}
                  onChange={(e) => setCurrentPosition(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                  placeholder="Enter position name..."
                />
                <button
                  onClick={addPosition}
                  className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all duration-200"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {positions.map((position, pIndex) => (
                <Card key={pIndex} className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-xl">{position.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(position.skillLevels).map(([skill, level], sIndex) => (
                      <div key={sIndex} className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 flex-1">{skill}</span>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              onClick={() => updateSkillLevel(pIndex, skill, value)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                                level === value
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      title: "Add Questions",
      content: (
        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <Card key={qIndex} className="bg-white/90 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Question {qIndex + 1}
                </CardTitle>
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={20} />
                </button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question Content */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Question Content</label>
                  <textarea
                    value={question.content}
                    onChange={(e) => updateQuestionContent(qIndex, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                    placeholder="Enter your question..."
                    rows={3}
                  />
                </div>

                {/* Skill Selection Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Related Skill</label>
                  <select
                    value={question.selectedSkill}
                    onChange={(e) => updateSelectedSkill(qIndex, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                  >
                    <option value="">Select a skill</option>
                    {skills.filter(skill => skill.trim()).map((skill, index) => (
                      <option key={index} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">Options</label>
                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => (
                      <input
                        key={oIndex}
                        type="text"
                        value={option}
                        onChange={(e) => updateQuestionOption(qIndex, oIndex, e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                        placeholder={`Option ${oIndex + 1}`}
                      />
                    ))}
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
          
          <button
            onClick={addQuestion}
            className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <PlusCircle size={20} />
            Add New Question
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Survey Builder
          </h1>
          <div className="mt-8 flex justify-center gap-4">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ${
                  activeStep === index
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-purple-50'
                }`}
              >
                {step.title}
                {index < steps.length - 1 && <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {steps[activeStep].content}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeStep === 0
                ? 'opacity-0 pointer-events-none'
                : 'bg-white text-purple-600 hover:bg-purple-50'
            }`}
          >
            Back
          </button>
          <button
            onClick={() => {
              if (activeStep < steps.length - 1) {
                setActiveStep(activeStep + 1);
              } else {
                // Handle form submission
                console.log('Form submitted', {
                  surveyTitle,
                  skills: skills.filter(skill => skill.trim()),
                  positions,
                  questions,
                });
              }
            }}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {activeStep === steps.length - 1 ? (
              <>
                <Save size={20} />
                Save
              </>
            ) : (
              <>
                Next
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyBuilder;
