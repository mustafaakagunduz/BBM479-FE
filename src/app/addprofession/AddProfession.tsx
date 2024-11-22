import React, {useEffect, useState} from 'react';
import { Pencil, Trash2, Plus, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {professionApi} from "@/app/services/ProfessionApi";
import { Toaster, toast } from 'react-hot-toast';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle
} from "@/app/components/ui/alert-dialog";




const AddProfession = () => {
    // Types
    type Skill = {
        id: number;
        name: string;
        level: number;
        tempId?: number;
    };

    type Profession = {
        id: number;
        name: string;
        industry: string;
        industryId?: number;
        requiredSkills: Skill[];
    };

    type Industry = {
        id: number;
        name: string;
    };

    type ApiSkill = {
        id: number;
        name: string;
        industryId: number;
        industryName: string;
    };

    // State tanımlamaları
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [availableSkills, setAvailableSkills] = useState<ApiSkill[]>([]);
    const [professions, setProfessions] = useState<Profession[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [expandedProfession, setExpandedProfession] = useState<number | null>(null);
    const [editingProfession, setEditingProfession] = useState<Profession | null>(null);
    const [newProfession, setNewProfession] = useState<Profession>({
        id: 0,
        name: "",
        industry: "",
        industryId: undefined,
        requiredSkills: []
    });
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [professionToDelete, setProfessionToDelete] = useState<number | null>(null);
    const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
    const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState<{[key: string]: boolean}>({});
    const [industryDropdowns, setIndustryDropdowns] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [industriesResponse, professionsResponse] = await Promise.all([
                professionApi.getAllIndustries(),
                professionApi.getAllProfessions()
            ]);
            setIndustries(industriesResponse.data);
            setProfessions(formatProfessions(professionsResponse.data));
        } catch (error) {
            console.error('Error fetching initial data:', error);
            toast.error('Failed to load data');
        }
    };


    useEffect(() => {
        const fetchIndustries = async () => {
            try {
                const response = await professionApi.getAllIndustries();
                setIndustries(response.data);
            } catch (error) {
                console.error('Error fetching industries:', error);
                // Hata yönetimi eklenebilir
            }
        };

        fetchIndustries();
    }, []);

    useEffect(() => {
        const fetchProfessions = async () => {
            try {
                const response = await professionApi.getAllProfessions();
                const formattedProfessions = formatProfessions(response.data);
                setProfessions(formattedProfessions);
            } catch (error) {
                console.error('Error fetching professions:', error);
            }
        };

        fetchProfessions();
    }, []);

    const handleDeleteConfirm = async () => {
        if (professionToDelete !== null) {
            try {
                await professionApi.deleteProfession(professionToDelete);
                setProfessions(prevProfessions =>
                    prevProfessions.filter(prof => prof.id !== professionToDelete)
                );
                setProfessionToDelete(null); // Modal'ı kapat
                toast.success('Profession deleted successfully', {
                    duration: 2000, // 2 saniye sonra kapanacak
                    style: {
                        border: '1px solid #10B981',
                        padding: '12px',
                        color: '#059669',
                        backgroundColor: '#ECFDF5'
                    },
                });
            } catch (error: any) {
                console.log('Component Error:', {
                    error: error,
                    type: error.type,
                    response: error.response
                });

                if (error.type === 'REFERENCE_ERROR') {
                    setDeleteError('This profession cannot be deleted because it is associated with a survey registered in the system.');
                } else {
                    setDeleteError('An error occurred while deleting the profession');
                }
                setProfessionToDelete(null); // Hata durumunda da modal'ı kapat
            }
        }
    };

    const formatProfessions = (data: any[]) => data.map(prof => ({
        id: prof.id,
        name: prof.name,
        industry: prof.industryName,
        industryId: prof.industryId,
        requiredSkills: prof.requiredSkills.map((skill: any) => ({
            id: skill.skillId,
            name: skill.skillName,
            level: skill.requiredLevel,
            tempId: Date.now() + Math.random()
        }))
    }));

    const renderIndustryDropdown = (id: string, selectedId: number | undefined, onChange: (id: number) => void) => (
        <div className="relative">
            <button
                onClick={() => setIndustryDropdowns(prev => ({...prev, [id]: !prev[id]}))}
                className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
            >
                {industries.find(i => i.id === selectedId)?.name || "Select Industry"}
                <ChevronDown size={20}/>
            </button>
            {industryDropdowns[id] && (
                <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                    {industries.map(industry => (
                        <div
                            key={industry.id}
                            onClick={() => {
                                onChange(industry.id);
                                setIndustryDropdowns(prev => ({...prev, [id]: false}));
                            }}
                            className={`px-4 py-2 cursor-pointer hover:bg-purple-100 ${
                                selectedId === industry.id ? "bg-purple-200 text-purple-800 font-medium" : "text-gray-700"
                            }`}
                        >
                            {industry.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderSkillDropdown = (skill: Skill, index: number, isNewProfession: boolean) => {
        const dropdownKey = `${isNewProfession ? 'new' : skill.id}-${index}`;

        return (
            <div className="relative flex-1">
                <button
                    onClick={() => setIsSkillDropdownOpen(prev => ({
                        ...prev,
                        [dropdownKey]: !prev[dropdownKey]
                    }))}
                    className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                >
                    {skill.name}
                    <ChevronDown size={20}/>
                </button>
                {isSkillDropdownOpen[dropdownKey] && (
                    <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                        {availableSkills.map(option => (
                            <div
                                key={option.id}
                                onClick={() => handleSkillSelect(option, skill, index, isNewProfession, dropdownKey)}
                                className={`px-4 py-2 cursor-pointer hover:bg-purple-100 ${
                                    skill.id === option.id ? "bg-purple-200 text-purple-800 font-medium" : "text-gray-700"
                                }`}
                            >
                                {option.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const handleSkillSelect = (option: ApiSkill, currentSkill: Skill, index: number, isNewProfession: boolean, dropdownKey: string) => {
        const updatedSkill = {
            ...currentSkill,
            id: option.id,
            name: option.name
        };

        if (isNewProfession) {
            const updatedSkills = [...newProfession.requiredSkills];
            updatedSkills[index] = updatedSkill;
            setNewProfession({...newProfession, requiredSkills: updatedSkills});
        } else if (editingProfession) {
            const updatedSkills = [...editingProfession.requiredSkills];
            updatedSkills[index] = updatedSkill;
            setEditingProfession({...editingProfession, requiredSkills: updatedSkills});
        }

        setIsSkillDropdownOpen(prev => ({...prev, [dropdownKey]: false}));
    };

    const renderSkillSelect = (skill: Skill, index: number, isNewProfession: boolean) => (
        <select
            value={skill.id}
            onChange={(e) => {
                const selectedSkill = availableSkills.find(s => s.id === Number(e.target.value));
                if (selectedSkill) {
                    if (isNewProfession) {
                        const updatedSkills = [...newProfession.requiredSkills];
                        updatedSkills[index] = {
                            ...skill,
                            id: selectedSkill.id,
                            name: selectedSkill.name,
                            tempId: skill.tempId // Mevcut tempId'yi koru
                        };
                        setNewProfession({...newProfession, requiredSkills: updatedSkills});
                    } else if (editingProfession) {
                        const updatedSkills = [...editingProfession.requiredSkills];
                        updatedSkills[index] = {
                            ...skill,
                            id: selectedSkill.id,
                            name: selectedSkill.name,
                            tempId: skill.tempId // Mevcut tempId'yi koru
                        };
                        setEditingProfession({...editingProfession, requiredSkills: updatedSkills});
                    }
                }
            }}
            className="flex-1 px-3 py-2 rounded-md border border-gray-200 text-black"
        >
            <option key={`current-${skill.tempId || skill.id}`} value={skill.id}>
                {skill.name}
            </option>
            {availableSkills
                .filter(option => option.id !== skill.id)
                .map(option => (
                    <option key={`option-${option.id}-${skill.tempId || index}`} value={option.id}>
                        {option.name}
                    </option>
                ))
            }
        </select>
    );

    const renderNewProfessionSkills = () => (
        <div className="space-y-2">
            {newProfession.requiredSkills.map((skill, index) => (
                <div key={`new-skill-${skill.tempId || index}`}
                     className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                    {renderSkillDropdown(skill, index, true)}
                    <LevelSelector
                        level={skill.level}
                        onChange={(level) => {
                            const updatedSkills = [...newProfession.requiredSkills];
                            updatedSkills[index] = {...skill, level};
                            setNewProfession({...newProfession, requiredSkills: updatedSkills});
                        }}
                    />
                    <button
                        onClick={() => {
                            const updatedSkills = newProfession.requiredSkills.filter((_, i) => i !== index);
                            setNewProfession({...newProfession, requiredSkills: updatedSkills});
                        }}
                        className="text-red-600 hover:text-red-800 transition"
                    >
                        <Trash2 size={20}/>
                    </button>
                </div>
            ))}
        </div>
    );

    const renderExistingProfessionSkills = (profession: Profession, isEditing: boolean) => (
        <div className="space-y-2">
            {profession.requiredSkills.map((skill, index) => (
                <div key={`existing-skill-${skill.tempId || skill.id}-${index}`}
                     className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                    {isEditing ?
                        renderSkillDropdown(skill, index, false) :
                        <span className="flex-1">{skill.name}</span>
                    }
                    <LevelSelector
                        level={skill.level}
                        onChange={(level) => {
                            if (isEditing && editingProfession) {
                                const updatedSkills = [...editingProfession.requiredSkills];
                                updatedSkills[index] = {...skill, level};
                                setEditingProfession({...editingProfession, requiredSkills: updatedSkills});
                            }
                        }}
                        disabled={!isEditing}
                    />
                    {isEditing && (
                        <button
                            onClick={() => handleDeleteSkill(profession.id, skill.id)}
                            className="text-red-600 hover:text-red-800 transition"
                        >
                            <Trash2 size={20}/>
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
    const handleIndustryChange = async (industryId: number, isEditing: boolean = false) => {
        try {
            const response = await professionApi.getSkillsByIndustry(industryId);
            setAvailableSkills(response.data);
            const selectedIndustry = industries.find(i => i.id === industryId);

            if (isEditing && editingProfession) {
                setEditingProfession({
                    ...editingProfession,
                    industryId: industryId,
                    industry: selectedIndustry?.name || ""
                });
            } else {
                setNewProfession({
                    ...newProfession,
                    industryId: industryId,
                    industry: selectedIndustry?.name || ""
                });
            }
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const handleSaveNewProfession = async () => {
        if (newProfession.name.trim() && newProfession.industryId && newProfession.requiredSkills.length > 0) {
            try {
                const professionData = {
                    name: newProfession.name,
                    industryId: newProfession.industryId,
                    requiredSkills: newProfession.requiredSkills.map(skill => ({
                        skillId: skill.id,
                        requiredLevel: skill.level
                    }))
                };

                const response = await professionApi.createProfession(professionData);

                // Backend'den gelen veriyi frontend formatına dönüştürüyoruz
                const formattedProfession: Profession = {
                    id: response.data.id,
                    name: response.data.name,
                    industry: newProfession.industry,
                    industryId: response.data.industryId,
                    requiredSkills: response.data.requiredSkills.map((skill: any) => ({
                        id: skill.skillId,
                        name: skill.skillName,
                        level: skill.requiredLevel
                    }))
                };

                setProfessions(prevProfessions => [...prevProfessions, formattedProfession]);
                setIsAddingNew(false);
                resetNewProfession();

                // Başarılı mesajı eklendi
                toast.success('Profession added successfully', {
                    duration: 2000,
                    style: {
                        border: '1px solid #10B981',
                        padding: '12px',
                        color: '#059669',
                        backgroundColor: '#ECFDF5'
                    },
                });
            } catch (error) {
                console.error('Error saving profession:', error);
                // Hata durumunda hata mesajı
                toast.error('Failed to add profession', {
                    duration: 2000,
                    style: {
                        border: '1px solid #EF4444',
                        padding: '12px',
                        color: '#DC2626',
                        backgroundColor: '#FEE2E2'
                    },
                });
            }
        }
    };

    const resetNewProfession = () => {
        setNewProfession({
            id: 0,
            name: "",
            industry: "",
            industryId: undefined,  // Eksik olan property eklendi
            requiredSkills: []
        });
    };

    const handleAddSkillToNewProfession = () => {
        if (availableSkills.length > 0) {
            const firstSkill = availableSkills[0];
            // Benzersiz bir ID oluştur
            const uniqueId = Date.now();
            const newSkill = {
                id: firstSkill.id,
                name: firstSkill.name,
                level: 1,
                tempId: uniqueId // Geçici benzersiz ID
            };
            setNewProfession({
                ...newProfession,
                requiredSkills: [...newProfession.requiredSkills, newSkill]
            });
        }
    };

    const handleAddSkillToExistingProfession = (profession: Profession) => {
        if (availableSkills.length > 0) {
            const firstSkill = availableSkills[0];
            // Benzersiz bir ID oluştur
            const uniqueId = Date.now();
            const newSkill = {
                id: firstSkill.id,
                name: firstSkill.name,
                level: 1,
                tempId: uniqueId // Geçici benzersiz ID
            };
            const updatedProfession = {
                ...profession,
                requiredSkills: [...profession.requiredSkills, newSkill]
            };
            setEditingProfession(updatedProfession);
        }
    };

    const handleSkillLevelChange = (professionId: number, skillId: number, level: number) => {
        if (editingProfession && editingProfession.id === professionId) {
            setEditingProfession({
                ...editingProfession,
                requiredSkills: editingProfession.requiredSkills.map(skill =>
                    skill.id === skillId ? { ...skill, level } : skill
                )
            });
        }
    };

    const handleDeleteProfession = async (id: number) => {
        try {
            await professionApi.deleteProfession(id);
            setProfessions(prevProfessions =>
                prevProfessions.filter(prof => prof.id !== id)
            );
            toast.success('Profession deleted successfully');
        } catch (error: any) {
            console.log('Component Error:', {
                error: error,
                type: error.type,
                response: error.response
            });

            // error.type kontrolü
            if (error.type === 'REFERENCE_ERROR') {
                setDeleteError('Bu meslek sistemde kayıtlı bir anket ile ilişkili olduğu için silinemez');
            } else {
                setDeleteError('Meslek silinirken bir hata oluştu');
            }
        }
    };

    const handleStartEdit = (profession: Profession) => {
        setEditingId(profession.id);
        setEditingProfession({
            ...profession,
            requiredSkills: profession.requiredSkills.map(skill => ({
                ...skill,
                tempId: Date.now() + Math.random() // Her skill için benzersiz tempId ekliyoruz
            }))
        });
        setExpandedProfession(profession.id);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingProfession(null);
    };

    const handleSaveEdit = async () => {
        if (editingProfession && editingProfession.industryId) { // industryId kontrolü eklendi
            try {
                const updateData = {
                    name: editingProfession.name,
                    industryId: editingProfession.industryId, // artık kesinlikle number olacak
                    requiredSkills: editingProfession.requiredSkills.map(skill => ({
                        skillId: skill.id,
                        requiredLevel: skill.level
                    }))
                };
                await professionApi.updateProfession(editingProfession.id, updateData);

                setProfessions(prevProfessions =>
                    prevProfessions.map(prof =>
                        prof.id === editingProfession.id ? editingProfession : prof
                    )
                );
                setEditingId(null);
                setEditingProfession(null);
            } catch (error) {
                console.error('Error updating profession:', error);
            }
        }
    };

    const handleDeleteSkill = (professionId: number, skillId: number) => {
        if (editingProfession && editingProfession.id === professionId) {
            setEditingProfession({
                ...editingProfession,
                requiredSkills: editingProfession.requiredSkills.filter(skill => skill.id !== skillId)
            });
        }
    };

    const LevelSelector = ({ level, onChange, disabled = false }: {
        level: number;
        onChange: (level: number) => void;
        disabled?: boolean
    }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((num) => (
                <button
                    key={num}
                    className={`w-8 h-8 rounded-full ${
                        level >= num
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                    } ${
                        disabled
                            ? 'opacity-60 cursor-not-allowed'
                            : 'hover:bg-purple-500 hover:text-white'
                    } transition-colors`}
                    onClick={() => !disabled && onChange(num)}
                    disabled={disabled}
                >
                    {num}
                </button>
            ))}
        </div>
    );

    useEffect(() => {
        if (editingId && editingProfession?.industryId) {
            handleIndustryChange(editingProfession.industryId, true);
        }
    }, [editingId, editingProfession?.industryId]);

    const renderProfessionContent = (prof: Profession) => {
        const isEditing = editingId === prof.id;
        const professionToRender = isEditing ? editingProfession! : prof;

        return (
            <div key={prof.id} className="border border-gray-300 rounded-lg p-4 text-black">

                <AlertDialog open={!!deleteError}>
                    <AlertDialogContent className="flex flex-col items-center justify-center p-6 bg-white">
                        <AlertDialogTitle className="text-xl font-semibold text-purple-600 mb-4">
                            Delete Failed
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-lg text-purple-500 mb-6">
                            {deleteError}
                        </AlertDialogDescription>
                        <button
                            onClick={() => setDeleteError(null)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                            Close
                        </button>
                    </AlertDialogContent>
                </AlertDialog>
                {/* Header bölümü - değişiklik yok */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    value={professionToRender.name}
                                    onChange={(e) => setEditingProfession({
                                        ...professionToRender,
                                        name: e.target.value
                                    })}
                                    className="px-2 py-1 border rounded mb-2"
                                />
                                <select
                                    value={professionToRender.industryId || ""}
                                    onChange={(e) => handleIndustryChange(Number(e.target.value), true)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple"
                                >
                                    <option value="" disabled>Select Industry</option>
                                    {industries.map(industry => (
                                        <option key={industry.id} value={industry.id}>{industry.name}</option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <>
                                <span className="text-lg font-semibold">{professionToRender.name}</span>
                                <span className="text-sm text-gray-600">{professionToRender.industry}</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center">
                        {isEditing ? (
                            <button
                                onClick={handleCancelEdit}
                                className="p-2 text-red-500 hover:text-red-600 transition"
                            >
                                <X size={20} />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleStartEdit(prof)}
                                    className="p-2 text-yellow-500 hover:text-yellow-600 transition"
                                >
                                    <Pencil size={20} />
                                </button>
                                <button
                                    onClick={() => setProfessionToDelete(prof.id)}
                                    className="p-2 text-red-500 hover:text-red-600 transition"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Expand/Collapse button - değişiklik yok */}
                <button
                    onClick={() => setExpandedProfession(expandedProfession === prof.id ? null : prof.id)}
                    className="flex items-center text-gray-500 hover:text-gray-600 transition mt-2"
                >
                    {expandedProfession === prof.id ? <ChevronUp /> : <ChevronDown />}
                    <span className="ml-2">
                    {expandedProfession === prof.id ? "Hide Skills" : "Show Skills"}
                </span>
                </button>

                {/* Skills bölümü - yeni render fonksiyonlarını kullanıyoruz */}
                {expandedProfession === prof.id && (
                    <div className="mt-4 space-y-2">
                        {renderExistingProfessionSkills(professionToRender, isEditing)}
                        {isEditing && (
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleAddSkillToExistingProfession(professionToRender)}
                                    className="w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                                >
                                    Add Skill
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
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

            <AlertDialog open={professionToDelete !== null}>
                <AlertDialogContent className="flex flex-col items-center justify-center p-6 bg-white">
                    <AlertDialogTitle className="text-xl font-semibold text-purple-600 mb-4">
                        Delete Profession
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-lg text-purple-500 mb-6">
                        Are you sure you want to delete this profession?
                    </AlertDialogDescription>
                    <div className="flex gap-4">
                        <button
                            onClick={handleDeleteConfirm}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => setProfessionToDelete(null)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>

                    </div>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!deleteError}>
                <AlertDialogContent className="flex flex-col items-center justify-center p-6 bg-white">
                    <AlertDialogTitle className="text-xl font-semibold text-purple-600 mb-4">
                        Delete Failed
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-lg text-purple-500 mb-6">
                        {deleteError}
                    </AlertDialogDescription>
                    <button
                        onClick={() => setDeleteError(null)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        Close
                    </button>
                </AlertDialogContent>
            </AlertDialog>

            <div className="max-w-4xl mx-auto">
                <Card className="bg-white/90 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Professions & Required Skills
                        </CardTitle>
                        <button
                            onClick={() => setIsAddingNew(true)}
                            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all duration-200 flex items-center gap-2"
                            disabled={isAddingNew}
                        >
                            <Plus size={20} />
                            Add New Profession
                        </button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isAddingNew && (
                            <div className="border border-purple-200 rounded-lg p-4 space-y-4">
                                <input
                                    type="text"
                                    value={newProfession.name}
                                    onChange={(e) => setNewProfession({...newProfession, name: e.target.value})}
                                    placeholder="Enter profession name..."
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 text-black"
                                />
                                {renderIndustryDropdown(
                                    'new-profession',
                                    newProfession.industryId,
                                    (id) => handleIndustryChange(id)
                                )}
                                {renderNewProfessionSkills()}
                                <div className="flex justify-evenly">
                                    <button
                                        onClick={handleAddSkillToNewProfession}
                                        className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                                    >
                                        Add Skill
                                    </button>
                                    <button
                                        onClick={handleSaveNewProfession}
                                        className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                                    >
                                        Save Profession
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsAddingNew(false);
                                            resetNewProfession();
                                        }}
                                        className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                        {professions.map(prof => (
                            <div key={prof.id} className="border border-gray-300 rounded-lg p-4 text-black">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        {editingId === prof.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editingProfession?.name || ''}
                                                    onChange={(e) => setEditingProfession(prev => ({
                                                        ...prev!,
                                                        name: e.target.value
                                                    }))}
                                                    className="px-2 py-1 border rounded mb-2"
                                                />
                                                {renderIndustryDropdown(
                                                    `edit-profession-${prof.id}`,
                                                    editingProfession?.industryId,
                                                    (id) => handleIndustryChange(id, true)
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-lg font-semibold">{prof.name}</span>
                                                <span className="text-sm text-gray-600">{prof.industry}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        {editingId === prof.id ? (
                                            <button
                                                onClick={handleCancelEdit}
                                                className="p-2 text-red-500 hover:text-red-600 transition"
                                            >
                                                <X size={20} />
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleStartEdit(prof)}
                                                    className="p-2 text-yellow-500 hover:text-yellow-600 transition"
                                                >
                                                    <Pencil size={20} />
                                                </button>
                                                <button
                                                    onClick={() => setProfessionToDelete(prof.id)}
                                                    className="p-2 text-red-500 hover:text-red-600 transition"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setExpandedProfession(expandedProfession === prof.id ? null : prof.id)}
                                    className="flex items-center text-gray-500 hover:text-gray-600 transition mt-2"
                                >
                                    {expandedProfession === prof.id ? <ChevronUp /> : <ChevronDown />}
                                    <span className="ml-2">
                                    {expandedProfession === prof.id ? "Hide Skills" : "Show Skills"}
                                </span>
                                </button>

                                {expandedProfession === prof.id && (
                                    <div className="mt-4 space-y-2">
                                        {renderExistingProfessionSkills(prof, editingId === prof.id)}
                                        {editingId === prof.id && (
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => handleAddSkillToExistingProfession(prof)}
                                                    className="w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                                                >
                                                    Add Skill
                                                </button>
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddProfession;