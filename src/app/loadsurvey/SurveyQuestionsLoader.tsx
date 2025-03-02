import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { surveyService } from '../services/surveyService';
import { Industry, Skill, Profession } from '../types/index';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Save, ChevronRight, X, Upload, AlertTriangle, Info, FileText, Download, CheckCircle } from 'lucide-react';

interface SurveyFormData {
    title: string;
    industryId: number | null;
    selectedSkills: number[];
    selectedProfessions: number[];
}

const SurveyQuestionsLoader: React.FC = () => {
    const router = useRouter();
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [professions, setProfessions] = useState<Profession[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState<SurveyFormData>({
        title: '',
        industryId: null,
        selectedSkills: [],
        selectedProfessions: []
    });

    // Load industries on mount
    useEffect(() => {
        const loadIndustries = async () => {
            try {
                setLoading(true);
                const response = await surveyService.getIndustries();
                setIndustries(response.data);
            } catch (error) {
                console.error('Failed to load industries:', error);
                toast.error('Failed to load industries');
            } finally {
                setLoading(false);
            }
        };

        loadIndustries();
    }, []);

    // Load skills when industry changes
    useEffect(() => {
        if (formData.industryId) {
            const loadSkills = async () => {
                try {
                    setLoading(true);
                    const response = await surveyService.getSkillsByIndustry(formData.industryId!);
                    setSkills(response.data);
                } catch (error) {
                    console.error('Failed to load skills:', error);
                    toast.error('Failed to load skills');
                } finally {
                    setLoading(false);
                }
            };

            const loadProfessions = async () => {
                try {
                    setLoading(true);
                    const response = await surveyService.getProfessionsByIndustry(formData.industryId!);
                    setProfessions(response.data);
                } catch (error) {
                    console.error('Failed to load professions:', error);
                    toast.error('Failed to load professions');
                } finally {
                    setLoading(false);
                }
            };

            loadSkills();
            loadProfessions();
        }
    }, [formData.industryId]);

    const handleIndustryChange = (industryId: number) => {
        setFormData({
            ...formData,
            industryId,
            selectedSkills: [], // Reset skills when industry changes
            selectedProfessions: [] // Reset professions when industry changes
        });
        setSelectedFile(null); // Reset selected file when industry changes
    };

    const handleSkillSelect = (skillId: number) => {
        if (!formData.selectedSkills.includes(skillId)) {
            setFormData({
                ...formData,
                selectedSkills: [...formData.selectedSkills, skillId]
            });
        }
    };

    const handleSkillRemove = (skillId: number) => {
        setFormData({
            ...formData,
            selectedSkills: formData.selectedSkills.filter(id => id !== skillId)
        });
    };

    const handleProfessionSelect = (professionId: number) => {
        if (!formData.selectedProfessions.includes(professionId)) {
            setFormData({
                ...formData,
                selectedProfessions: [...formData.selectedProfessions, professionId]
            });
        }
    };

    const handleProfessionRemove = (professionId: number) => {
        setFormData({
            ...formData,
            selectedProfessions: formData.selectedProfessions.filter(id => id !== professionId)
        });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            // Excel dosyası olup olmadığını kontrol et
            if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                file.type === 'application/vnd.ms-excel' ||
                file.name.endsWith('.xlsx') || 
                file.name.endsWith('.xls')) {
                setSelectedFile(file);
                toast.success(`File selected: ${file.name}`);
            } else {
                toast.error('Please select an Excel file (.xlsx or .xls)');
                e.target.value = '';
            }
        }
    };

    const triggerFileInput = () => {
        if (formData.selectedSkills.length > 0 && formData.selectedProfessions.length > 0 && fileInputRef.current) {
            fileInputRef.current.click();
        } else {
            toast.error('Please select skills and professions first');
        }
    };

    const downloadFile = () => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            const a = document.createElement('a');
            a.href = url;
            a.download = selectedFile.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleLoadQuestions = async () => {
        try {
            if (!formData.title.trim()) {
                toast.error('Please enter a survey title');
                return;
            }
            if (!formData.industryId) {
                toast.error('Please select an industry');
                return;
            }
            if (formData.selectedSkills.length === 0) {
                toast.error('Please select at least one skill');
                return;
            }
            if (formData.selectedProfessions.length === 0) {
                toast.error('Please select at least one profession');
                return;
            }
            if (!selectedFile) {
                toast.error('Please select an Excel file with questions');
                return;
            }

            setLoading(true);
            
            // Gerçek uygulamada yapılacak işlemler:
            // 1. FormData oluştur
            // 2. Excel dosyasını yükle
            // 3. API'ye gönder
            
            // Örnek FormData oluşturma:
            // const formDataToSend = new FormData();
            // formDataToSend.append('file', selectedFile);
            // formDataToSend.append('title', formData.title);
            // formDataToSend.append('industryId', formData.industryId.toString());
            // formDataToSend.append('skills', JSON.stringify(formData.selectedSkills));
            // formDataToSend.append('professions', JSON.stringify(formData.selectedProfessions));
            
            // Örnek API çağrısı:
            // const response = await surveyService.uploadQuestionsFile(formDataToSend);
            
            // Şimdilik sadece bir başarı mesajı gösterelim
            toast.success('Excel file processed successfully!');
            
            // Yeni bir sekmede açılacak şekilde yönlendirme
            window.open('/surveys', '_blank');
        } catch (error) {
            console.error('Failed to process file:', error);
            toast.error('Failed to process the Excel file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
                    Load Survey Questions
                </h1>

                <Card className="bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Survey Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Survey Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Survey Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                                placeholder="Enter survey title..."
                            />
                        </div>

                        {/* Industry Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Select Industry</label>
                            <select
                                value={formData.industryId || ''}
                                onChange={(e) => handleIndustryChange(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Select Skills to Measure</label>
                            <select
                                value=""
                                onChange={(e) => handleSkillSelect(Number(e.target.value))}
                                className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black ${
                                    !formData.industryId ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={!formData.industryId}
                            >
                                <option value="">
                                    {!formData.industryId
                                        ? "Please select an industry first"
                                        : "Select a skill"
                                    }
                                </option>
                                {skills
                                    .filter(skill => !formData.selectedSkills.includes(skill.id))
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((skill) => (
                                        <option key={skill.id} value={skill.id}>
                                            {skill.name}
                                        </option>
                                    ))}
                            </select>

                            {/* Selected Skills Display */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {formData.selectedSkills.map((skillId) => {
                                    const skill = skills.find(s => s.id === skillId);
                                    return (
                                        <div
                                            key={skillId}
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg"
                                        >
                                            <span>{skill?.name}</span>
                                            <button
                                                onClick={() => handleSkillRemove(skillId)}
                                                className="p-1 hover:bg-blue-200 rounded-full"
                                            >
                                                <X size={16}/>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Professions Selection */}
                        <div className="space-y-2 pt-4 border-t border-gray-100">
                            <label className="text-sm font-medium text-gray-700">Select Target Professions</label>
                            <select
                                value=""
                                onChange={(e) => handleProfessionSelect(Number(e.target.value))}
                                className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black ${
                                    !formData.industryId ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={!formData.industryId}
                            >
                                <option value="">
                                    {!formData.industryId
                                        ? "Please select an industry first"
                                        : "Select a profession"
                                    }
                                </option>
                                {professions
                                    .filter(prof => !formData.selectedProfessions.includes(prof.id))
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((profession) => (
                                        <option key={profession.id} value={profession.id}>
                                            {profession.name}
                                        </option>
                                    ))}
                            </select>

                            {/* Selected Professions Display */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {formData.selectedProfessions.map((profId) => {
                                    const profession = professions.find(p => p.id === profId);
                                    return (
                                        <div
                                            key={profId}
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg"
                                        >
                                            <span>{profession?.name}</span>
                                            <button
                                                onClick={() => handleProfessionRemove(profId)}
                                                className="p-1 hover:bg-blue-200 rounded-full"
                                            >
                                                <X size={16}/>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                
                {/* Excel dosyası yükleme bölümü */}
                <Card className={`bg-white/90 backdrop-blur-sm mt-6 ${formData.selectedSkills.length > 0 && formData.selectedProfessions.length > 0 ? '' : 'opacity-50'}`}>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Upload Questions File
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Excel dosyası format bilgileri */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-5 w-5 text-blue-700" />
                                <p className="text-blue-700 font-medium">The Excel file must meet the following requirements to successfully create the survey:</p>
                            </div>
                            <ul className="text-blue-700 space-y-1 pl-5 list-disc">
                                <li>Column A represents the Skill</li>
                                <li>Column B represents the Question</li>
                                <li>Column C represents the first option</li>
                                <li>Column D represents the second option</li>
                                <li>Column E represents the third option</li>
                                <li>Column F represents the fourth option</li>
                                <li>Column G represents the fifth option</li>
                            </ul>
                            <div className="flex items-center gap-2 mt-2">
                                <Info className="h-5 w-5 text-blue-700" />
                                <p className="text-blue-700 font-medium">If the skill in Column A is not among the selected skills, the question will not be added.</p>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2">
                                <Info className="h-5 w-5 text-blue-700" />
                                <p className="text-blue-700 font-medium">Questions in rows with missing or extra columns from the format specified above will not be added.</p>
                            </div>
                        </div>

                        {formData.selectedSkills.length > 0 && formData.selectedProfessions.length > 0 ? (
                            <div>
                                {!selectedFile ? (
                                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer" onClick={triggerFileInput}>
                                        <input 
                                            type="file" 
                                            accept=".xlsx,.xls" 
                                            className="hidden" 
                                            onChange={handleFileSelect} 
                                            ref={fileInputRef}
                                        />
                                        <Upload className="w-12 h-12 text-blue-500 mb-4" />
                                        <p className="text-lg font-medium text-gray-700 mb-1">
                                            Click to select an Excel file
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Only Excel files (.xlsx, .xls) are supported
                                        </p>
                                    </div>
                                ) : (
                                    <div className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <FileText className="h-6 w-6 text-blue-500 mr-2" />
                                                <span className="font-medium">{selectedFile.name}</span>
                                                <span className="text-gray-500 ml-2">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={downloadFile}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                                    title="Download file"
                                                >
                                                    <Download className="h-5 w-5" />
                                                </button>
                                                <button 
                                                    onClick={removeFile} 
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                                    title="Remove file"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded border border-gray-200 flex items-center">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                            <span className="text-gray-700">File ready to upload. Click "Load Questions" to continue.</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-gray-500">
                                    Please select skills and professions first to enable file upload
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-8 flex justify-between">
                    <button
                        onClick={() => router.push('/surveys')}
                        className="px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-white text-blue-600 hover:bg-blue-50"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleLoadQuestions}
                        disabled={loading || !selectedFile}
                        className={`px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium transition-all duration-200 flex items-center gap-2 ${loading || !selectedFile ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-indigo-600'}`}
                    >
                        {loading ? 'Processing...' : 'Load Questions'}
                        {!loading && <ChevronRight size={20}/>}
                    </button>
                </div>
            </div>
            <Toaster position="top-right" />
        </div>
    );
};

export default SurveyQuestionsLoader;