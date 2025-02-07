import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, ChevronRight, Trash2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { surveyService } from '@/app/services/surveyService';
import { Industry, Skill, Question, Option ,Profession } from '@/app/types/index';
import {toast, Toaster} from 'react-hot-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
interface QuestionForm {
    content: string;
    options: string[];
    selectedSkill: number; // string yerine number kullanıyoruz
}

interface SurveyEditerProps {
    mode?: 'create' | 'edit';
    surveyId?: number;
}

const SurveyEditer: React.FC<SurveyEditerProps> = ({ mode = 'create', surveyId }) => {
    // API data states
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(false);
    const [professions, setProfessions] = useState<Profession[]>([]);
    const [isDeleteSkillDialogOpen, setIsDeleteSkillDialogOpen] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState<number | null>(null);
    // Form states
    const [surveyTitle, setSurveyTitle] = useState<string>('');
    const [selectedIndustryId, setSelectedIndustryId] = useState<number | null>(null);
    const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
    const [questions, setQuestions] = useState<QuestionForm[]>([]);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [selectedProfessions, setSelectedProfessions] = useState<number[]>([]);

    useEffect(() => {
        const loadSurvey = async () => {
            if (mode === 'edit' && surveyId) {
                try {
                    setLoading(true);
                    const response = await surveyService.getSurveyById(surveyId);
                    const survey = response.data;

                    // Form alanlarını doldur
                    setSurveyTitle(survey.title);
                    setSelectedIndustryId(survey.industryId);
                    setSelectedProfessions(survey.selectedProfessions);

                    // Soruları dönüştür
                    const formattedQuestions = survey.questions.map(q => ({
                        content: q.text,
                        selectedSkill: q.skillId,
                        options: q.options.map(opt => opt.description)
                    }));
                    setQuestions(formattedQuestions);

                    // Seçili yetenekleri ayarla
                    const uniqueSkills = [...new Set(survey.questions.map(q => q.skillId))];
                    setSelectedSkills(uniqueSkills);

                } catch (error) {
                    console.error('Failed to load survey:', error);
                }
            }
        };

        loadSurvey();
    }, [mode, surveyId]);

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

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const surveyData = {
                id: mode === 'edit' ? surveyId : undefined,
                userId: 1,
                title: surveyTitle,
                industryId: selectedIndustryId!,
                selectedProfessions,
                questions: questions.map(q => ({
                    text: q.content,
                    skillId: q.selectedSkill,
                    options: q.options.map((opt, index) => ({
                        level: index + 1,
                        description: opt
                    }))
                }))
            };

            if (mode === 'edit' && surveyId) {
                await surveyService.updateSurvey(surveyId, surveyData);
                toast.success('Survey updated successfully!');
            } else {
                await surveyService.createSurvey(surveyData);
                toast.success('Survey created successfully!');
            }

            window.location.href = '/surveys';

        } catch (error) {
            console.error('Failed to submit survey:', error);
            toast.error('Failed to save survey. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleProfessionSelect = (professionId: number) => {
        if (!selectedProfessions.includes(professionId)) {
            setSelectedProfessions([...selectedProfessions, professionId]);
        }
    };

    const handleSkillRemove = (skillId: number) => {
        setSkillToDelete(skillId);
        setIsDeleteSkillDialogOpen(true);
    };

    const confirmSkillRemoval = () => {
        if (skillToDelete) {
            // İlgili soruyu bul ve sil
            const updatedQuestions = questions.filter(
                question => question.selectedSkill !== skillToDelete
            );
            setQuestions(updatedQuestions);

            // Skill'i seçili listeden kaldır
            setSelectedSkills(selectedSkills.filter(id => id !== skillToDelete));

            // Dialog'u kapat
            setIsDeleteSkillDialogOpen(false);
            setSkillToDelete(null);
        }
    };

    // Validasyon fonksiyonları
    const validateSurveyDetails = () => {
        if (!surveyTitle.trim()) {
            toast.error('Please fill in the survey title');
            return false;
        }
        if (!selectedIndustryId) {
            toast.error('Please select an industry');
            return false;
        }
        if (selectedSkills.length === 0) {
            toast.error('Please select at least one skill');
            return false;
        }
        return true;
    };

    const validateProfessions = () => {
        if (selectedProfessions.length === 0) {
            toast.error('Please select at least one profession');
            return false;
        }
        return true;
    };

    const validateQuestions = () => {
        // Soru sayısı kontrolü
        if (questions.length !== selectedSkills.length) {
            toast.error(`Please create exactly ${selectedSkills.length} questions (one per skill)`);
            return false;
        }

        // Her soru için detaylı kontrol
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];

            // Soru içeriği kontrolü
            if (!question.content.trim()) {
                toast.error(`Please fill in the content for question ${i + 1}`);
                return false;
            }

            // Skill seçimi kontrolü
            if (!question.selectedSkill) {
                toast.error(`Please select a skill for question ${i + 1}`);
                return false;
            }

            // Seçenekler kontrolü
            if (question.options.some(option => !option.trim())) {
                toast.error(`Please fill in all options for question ${i + 1}`);
                return false;
            }
        }
        return true;
    };

// Next/Save butonu için click handler
    const handleNextClick = () => {
        if (activeStep < steps.length - 1) {
            let isValid = true;

            switch (activeStep) {
                case 0:
                    isValid = validateSurveyDetails();
                    break;
                case 1:
                    isValid = validateProfessions();
                    break;
            }

            if (isValid) {
                setActiveStep(activeStep + 1);
            }
        } else {
            if (validateQuestions()) {
                handleSubmit();
            }
        }
    };

    const isQuestionsValid = () => {
        // Soru sayısı seçili skill sayısına eşit olmalı
        if (questions.length !== selectedSkills.length) {
            return false;
        }

        // Her soru bir skill ile eşleşmiş olmalı
        return questions.every(question => selectedSkills.includes(question.selectedSkill));
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
    
                            {/* Skills Selection */}
                            {selectedIndustryId && (
                                <div className="space-y-4">
                                    <label className="text-lg font-medium text-gray-700">Select Skills to Measure</label>
                                    <select
                                        value={""}
                                        onChange={(e) => {
                                            const skillId = Number(e.target.value);
                                            if (!selectedSkills.includes(skillId)) {
                                                setSelectedSkills([...selectedSkills, skillId]);
                                            }
                                        }}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                                    >
                                        <option value="">Select a skill</option>
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
                                                    className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg"
                                                >
                                                    <span>{skill?.name}</span>
                                                    <button
                                                        onClick={() => handleSkillRemove(skillId)}
                                                        className="p-1 hover:bg-purple-200 rounded-full"
                                                    >
                                                        <X size={16}/>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ),
            },
            {
                title: "Select Professions",
                content: (
                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle
                                className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
                        {/* Uyarı mesajı */}
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-purple-700">
                                You need to create exactly {selectedSkills.length} question{selectedSkills.length !== 1 ? 's' : ''}
                                (one for each selected skill)
                            </p>
                            <p className="text-purple-700 mt-2">
                                Current status: {questions.length} question{questions.length !== 1 ? 's' : ''} created
                            </p>
                        </div>

                        {/* Mevcut sorular */}
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
                                                .filter(skill => {
                                                    // Önce bu skill seçili skillerde var mı kontrol et
                                                    const isSelectedSkill = selectedSkills.includes(skill.id);

                                                    // Sonra bu skill başka bir soruda kullanılmış mı kontrol et
                                                    // Eğer bu soru için seçili olan skill ise, onu göster
                                                    const isUsedInOtherQuestion = questions.some(
                                                        (q, idx) => idx !== qIndex && q.selectedSkill === skill.id
                                                    );

                                                    // Skill seçili skillerde varsa VE
                                                    // (bu soru için seçili olan skill ise VEYA başka bir soruda kullanılmamışsa) göster
                                                    return isSelectedSkill && (skill.id === question.selectedSkill || !isUsedInOtherQuestion);
                                                })
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

                        {/* Add Question Button - Sadece gerekli sayıda soru eklenebilsin */}
                        {questions.length < selectedSkills.length && (
                            <button
                                onClick={() => setQuestions([...questions, createNewQuestion()])}
                                className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <PlusCircle size={20} />
                                Add New Question ({questions.length}/{selectedSkills.length})
                            </button>
                        )}

                        {/* Validasyon mesajları */}
                        {questions.length > selectedSkills.length && (
                            <p className="text-red-500 text-sm mt-2">
                                You have too many questions. Please remove {questions.length - selectedSkills.length} question(s).
                            </p>
                        )}
                        {questions.some(q => !selectedSkills.includes(q.selectedSkill)) && (
                            <p className="text-red-500 text-sm mt-2">
                                Each question must be associated with a skill.
                            </p>
                        )}
                    </div>
                ),
            }
        ];
    
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">

                <AlertDialog
                    open={isDeleteSkillDialogOpen}
                    onOpenChange={setIsDeleteSkillDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Remove Skill</AlertDialogTitle>
                            <AlertDialogDescription>
                                If you remove this skill, the associated question will also be deleted.
                                Are you sure you want to continue?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmSkillRemoval}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Survey Edit
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

                    {/* Navigation Buttons - Düzeltilmiş versiyon */}
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
                            onClick={handleNextClick}
                            disabled={loading || (activeStep === steps.length - 1 && !isQuestionsValid())}
                            className={`px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium 
            ${(loading || (activeStep === steps.length - 1 && !isQuestionsValid()))
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:from-purple-600 hover:to-pink-600'} 
            transition-all duration-200 flex items-center gap-2`}
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

                {/* Toast bildirimleri için Toaster komponenti */}
                <Toaster position="top-right" />
            </div>
        );
    };
    export default SurveyEditer;