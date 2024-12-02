import React, { useState, useEffect } from 'react';
//import { Alert, AlertDescription, AlertTitle } from 'src'
import { XCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { PlusCircle, Save, ChevronRight, Trash2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { surveyService } from '../services/surveyService';
import { Industry, Skill, Question, Option ,Profession } from '../types/index';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';


interface QuestionForm {
    content: string;
    options: string[];
    selectedSkill: number; // string yerine number kullanıyoruz
}

const SurveyBuilder: React.FC = () => {
    // API data states
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(false);
    const [professions, setProfessions] = useState<Profession[]>([]);
    const [isLoading, setIsLoading] = useState(false); // mevcut loading state'i

    // Form states
    const [surveyTitle, setSurveyTitle] = useState<string>('');
    const [selectedIndustryId, setSelectedIndustryId] = useState<number | null>(null);
    const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
    const [questions, setQuestions] = useState<QuestionForm[]>([]);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [selectedProfessions, setSelectedProfessions] = useState<number[]>([]);
// SurveyBuilder component'inin başındaki state tanımlamalarına:

const { user, loading: authLoading } = useAuth(); // loading'i authLoading olarak yeniden adlandırdık            
  

    useEffect(() => {
        const loadProfessions = async () => {
            if (selectedIndustryId) {
                try {
                    setLoading(true);
                    const response = await surveyService.getProfessionsByIndustry(selectedIndustryId);
                    setProfessions(response.data);
                } catch (error) {
                    console.error('Failed to load professions:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadProfessions();
    }, [selectedIndustryId]);
    // Load initial data
    useEffect(() => {
        const loadIndustries = async () => {
            try {
                setLoading(true);
                const response = await surveyService.getIndustries();
                setIndustries(response.data);
            } catch (error) {
                console.error('Failed to load industries:', error);
            } finally {
                setLoading(false);
            }
        };

        loadIndustries();
    }, []);

    // Load skills when industry is selected
    useEffect(() => {
        const loadSkills = async () => {
            if (selectedIndustryId) {
                try {
                    setLoading(true);
                    const response = await surveyService.getSkillsByIndustry(selectedIndustryId);
                    setSkills(response.data);
                } catch (error) {
                    console.error('Failed to load skills:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadSkills();
    }, [selectedIndustryId]);
    // Functions for handling professions
    const handleProfessionSelect = (professionId: number) => {
        if (!selectedProfessions.includes(professionId)) {
            setSelectedProfessions([...selectedProfessions, professionId]);
        }
    };

    const handleProfessionRemove = (professionId: number) => {
        setSelectedProfessions(selectedProfessions.filter(id => id !== professionId));
    };

    // Initialize a new question
    const createNewQuestion = (): QuestionForm => ({
        content: '',
        options: Array(5).fill(''),
        selectedSkill: 0, // veya -1 kullanabilirsiniz
    });

    // Handle form submission
    useEffect(() => {
        console.log('SurveyBuilder - Current auth state:', {
            user,
            authLoading,
            localStorageAuth: localStorage.getItem('auth')
        });
    }, [user, authLoading]);
    const handleSubmit = async () => {
        try {
            console.log('Submit attempt - Auth state:', {
                user,
                localStorageAuth: localStorage.getItem('auth')
            });

            if (!user?.id) {
                console.log('User ID missing:', user);
                toast.error('Please login to create a survey');
                return;
            }

            setIsLoading(true);

            const surveyData = {
                userId: user.id,
                title: surveyTitle,
                industryId: selectedIndustryId!,
                selectedProfessions: selectedProfessions,
                questions: questions.map(q => ({
                    text: q.content,
                    skillId: q.selectedSkill,
                    options: q.options.map((opt, index) => ({
                        level: index + 1,
                        description: opt
                    }))
                }))
            };

            console.log('Sending survey data:', surveyData);

            const response = await surveyService.createSurvey(surveyData);
            // ... geri kalanı aynı
        } catch (error) {
            console.error('Survey creation error:', error);
            toast.error('Failed to create survey. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const addSkill = (skillId: number) => {
        if (!selectedSkills.includes(skillId)) {
            setSelectedSkills([...selectedSkills, skillId]);
        }
    };

    const removeSkill = (skillId: number) => {
        setSelectedSkills(selectedSkills.filter(id => id !== skillId));
    };

    const updateQuestion = (index: number, updates: Partial<QuestionForm>) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], ...updates };
        setQuestions(newQuestions);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };



        // Initialize a new question


        const steps = [
            {
                title: "Survey Details",
                content: (
                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Survey Details
                            </CardTitle>
                        </CardHeader>
                        {/* Survey Details Card içindeki CardContent'te değişiklik yapıyoruz */}
                        <CardContent className="space-y-6">
                            {/* Survey Title */}
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

                            {/* Industry Selection */}
                            <div className="space-y-4">
                                <label className="text-lg font-medium text-gray-700">Select Industry</label>
                                <select
                                    value={selectedIndustryId || ''}
                                    onChange={(e) => setSelectedIndustryId(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                                >
                                    <option value="">Select an industry</option>
                                    {industries.map((industry) => (
                                        <option key={industry.id} value={industry.id}>
                                            {industry.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Skills Selection - Artık her zaman görünür */}
                            <div className="space-y-4">
                                <label className="text-lg font-medium text-gray-700">Select Skills to Measure</label>
                                <select
                                    value=""
                                    onChange={(e) => {
                                        const skillId = Number(e.target.value);
                                        if (!selectedSkills.includes(skillId)) {
                                            setSelectedSkills([...selectedSkills, skillId]);
                                        }
                                    }}
                                    className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black ${
                                        !selectedIndustryId ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={!selectedIndustryId}
                                >
                                    <option value="">
                                        {!selectedIndustryId
                                            ? "Please select an industry first"
                                            : "Select a skill"
                                        }
                                    </option>
                                    {skills
                                        .filter(skill => !selectedSkills.includes(skill.id))
                                        .map((skill) => (
                                            <option key={skill.id} value={skill.id}>
                                                {skill.name}
                                            </option>
                                        ))}
                                </select>

                                {/* Selected Skills Display */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {selectedSkills.map((skillId) => {
                                        const skill = skills.find(s => s.id === skillId);
                                        return (
                                            <div
                                                key={skillId}
                                                className={`flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg ${
                                                    !selectedIndustryId ? 'opacity-50' : ''
                                                }`}
                                            >
                                                <span>{skill?.name}</span>
                                                <button
                                                    onClick={() => setSelectedSkills(selectedSkills.filter(id => id !== skillId))}
                                                    className="p-1 hover:bg-purple-200 rounded-full"
                                                    disabled={!selectedIndustryId}
                                                >
                                                    <X size={16}/>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Yönlendirme mesajı ekleyelim */}
                                {!selectedIndustryId && (
                                    <p className="text-sm text-gray-500 italic">
                                        Please select an industry to enable skill selection
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ),
            },
            {
                title: "Select Professions",
                content: (
                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Select Professions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Selected Industry Display */}
                            {selectedIndustryId && (
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <p className="text-purple-700 font-medium">
                                        Selected Industry: {industries.find(i => i.id === selectedIndustryId)?.name}
                                    </p>
                                </div>
                            )}

                            {/* Professions Selection */}
                            <div className="space-y-4">
                                <label className="text-lg font-medium text-gray-700">
                                    Available Professions
                                </label>

                                {/* Professions Dropdown */}
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    value=""
                                    onChange={(e) => handleProfessionSelect(Number(e.target.value))}
                                    disabled={!selectedIndustryId}
                                >
                                    <option value="">Select a profession</option>
                                    {professions
                                        .filter(prof => !selectedProfessions.includes(prof.id))
                                        .map((profession) => (
                                            <option key={profession.id} value={profession.id}>
                                                {profession.name}
                                            </option>
                                        ))}
                                </select>

                                {/* Selected Professions Display */}
                                <div className="mt-4 space-y-2">
                                    <label className="text-lg font-medium text-gray-700">
                                        Selected Professions
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProfessions.map(profId => {
                                            const profession = professions.find(p => p.id === profId);
                                            return (
                                                <div
                                                    key={profId}
                                                    className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg"
                                                >
                                                    <span>{profession?.name}</span>
                                                    <button
                                                        onClick={() => handleProfessionRemove(profId)}
                                                        className="p-1 hover:bg-purple-200 rounded-full transition-colors"
                                                    >
                                                        <X size={16}/>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Validation Message */}
                                {selectedProfessions.length === 0 && (
                                    <p className="text-amber-600 text-sm">
                                        Please select at least one profession to continue
                                    </p>
                                )}
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
                                        onClick={() => {
                                            const newQuestions = [...questions];
                                            newQuestions.splice(qIndex, 1);
                                            setQuestions(newQuestions);
                                        }}
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
                                            onChange={(e) => {
                                                const newQuestions = [...questions];
                                                newQuestions[qIndex].content = e.target.value;
                                                setQuestions(newQuestions);
                                            }}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                                            placeholder="Enter your question..."
                                            rows={3}
                                        />
                                    </div>

                                    {/* Skill Selection */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Related Skill</label>
                                        <select
                                            value={question.selectedSkill}
                                            onChange={(e) => {
                                                const newQuestions = [...questions];
                                                newQuestions[qIndex].selectedSkill = Number(e.target.value);
                                                setQuestions(newQuestions);
                                            }}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                                        >
                                            <option value="">Select a skill</option>
                                            {skills
                                                .filter(skill =>
                                                    // Skill seçili skillerde olmalı VE
                                                    selectedSkills.includes(skill.id) &&
                                                    // Bu skill ya mevcut soru için seçili olmalı YA DA
                                                    // başka hiçbir soruda seçili olmamalı
                                                    (skill.id === question.selectedSkill ||
                                                        !questions.some(
                                                            (q, idx) => idx !== qIndex && q.selectedSkill === skill.id
                                                        ))
                                                )
                                                .map((skill) => (
                                                    <option key={skill.id} value={skill.id}>
                                                        {skill.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-700">Options (1-5 Level)</label>
                                        <div className="space-y-3">
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-500 w-20">
                                                        Level {oIndex + 1}:
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => {
                                                            const newQuestions = [...questions];
                                                            newQuestions[qIndex].options[oIndex] = e.target.value;
                                                            setQuestions(newQuestions);
                                                        }}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                                                        placeholder={`Description for level ${oIndex + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Add Question Button */}
                        <button
                            onClick={() => setQuestions([...questions, createNewQuestion()])}
                            className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <PlusCircle size={20} />
                            Add New Question
                        </button>
                    </div>
                ),
            }
        ];

        return (
            
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 2000,
                            style: {
                                background: '#ECFDF5',
                                color: '#059669',
                                border: '1px solid #10B981',
                                padding: '16px',
                                fontSize: '1.1rem',
                                minWidth: '300px',
                                maxWidth: '400px',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#059669',
                                    secondary: '#ECFDF5',
                                },
                            }
                        }}
                    />

                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Survey Builder
                        </h1>

                        {/* Steps Navigation */}
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

                    {/* Active Step Content */}
                    <div className="transition-all duration-300 ease-in-out">
                        {steps[activeStep].content}
                    </div>

                    {/* Navigation Buttons */}
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
                                    handleSubmit();
                                }
                            }}
                            disabled={loading}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-2"
                        >
                            {activeStep === steps.length - 1 ? (
                                <>
                                    <Save size={20} />
                                    {loading ? 'Saving...' : 'Save Survey'}
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