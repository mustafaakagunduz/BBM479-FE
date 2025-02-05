import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { professionApi } from "@/app/services/ProfessionApi";
import { toast } from 'react-hot-toast';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle
} from "@/app/components/ui/alert-dialog";

const AddProfessionEski = () => {
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

    type ApiRequiredSkill = {
        skillId: number;
        skillName: string;
        requiredLevel: number;
    };

    // States
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
    const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState<{[key: string]: boolean}>({});
    const [industryDropdowns, setIndustryDropdowns] = useState<{[key: string]: boolean}>({});

    // Initial data fetching
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

    // When editingId changes, fetch available skills for that industry
    useEffect(() => {
        if (editingId && editingProfession?.industryId) {
            handleIndustryChange(editingProfession.industryId, true);
        }
    }, [editingId, editingProfession?.industryId]);

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
            toast.error('Failed to fetch skills');
        }
    };

    const handleAddSkillToExistingProfession = () => {
        if (editingProfession) {
            // Henüz seçilmemiş ilk skill'i bul
            const selectedSkillIds = new Set(editingProfession.requiredSkills.map(skill => skill.id));
            const availableSkill = availableSkills.find(skill => !selectedSkillIds.has(skill.id));

            if (availableSkill) {
                const newSkill = {
                    id: 0, // Başlangıçta 0 olarak ayarla
                    name: "Select a skill", // Başlangıç metni
                    level: 1,
                    tempId: Date.now() + Math.random()
                };

                setEditingProfession({
                    ...editingProfession,
                    requiredSkills: [...editingProfession.requiredSkills, newSkill]
                });
            }
        }
    };

    const handleAddSkillToNewProfession = () => {
        // Eğer mevcut skill sayısı, mevcut endüstrideki toplam skill sayısına eşit veya fazlaysa ekleme yapma
        if (newProfession.requiredSkills.length >= availableSkills.length) {
            toast.error(`You can only add up to ${availableSkills.length} skills for this industry`);
            return;
        }

        const newSkill = {
            id: 0, // Başlangıçta 0 olarak ayarla
            name: "Select a skill", // Başlangıç metni
            level: 1,
            tempId: Date.now() + Math.random()
        };

        setNewProfession({
            ...newProfession,
            requiredSkills: [...newProfession.requiredSkills, newSkill]
        });
    };

    const handleDeleteSkill = (index: number) => {
        if (editingProfession) {
            const updatedSkills = [...editingProfession.requiredSkills];
            updatedSkills.splice(index, 1);
            setEditingProfession({
                ...editingProfession,
                requiredSkills: updatedSkills
            });
        }
    };

    const handleSaveEdit = async () => {
        if (editingProfession && editingProfession.industryId) {
            try {
                const updateData = {
                    name: editingProfession.name,
                    industryId: editingProfession.industryId,
                    requiredSkills: editingProfession.requiredSkills.map(skill => ({
                        skillId: skill.id,
                        requiredLevel: skill.level
                    }))
                };

                const response = await professionApi.updateProfession(editingProfession.id, updateData);

                setProfessions(prevProfessions =>
                    prevProfessions.map(prof =>
                        prof.id === editingProfession.id ? {
                            ...editingProfession,
                            requiredSkills: response.data.requiredSkills.map((skill: ApiRequiredSkill) => ({
                                id: skill.skillId,
                                name: skill.skillName,
                                level: skill.requiredLevel,
                                tempId: Date.now() + Math.random()
                            }))
                        } : prof
                    )
                );

                setEditingId(null);
                setEditingProfession(null);
                toast.success('Profession updated successfully');
            } catch (error) {
                console.error('Error updating profession:', error);
                toast.error('Failed to update profession');
            }
        }
    };

    // Components
    const LevelSelector = ({ level, onChange, disabled = false }: {
        level: number;
        onChange: (level: number) => void;
        disabled?: boolean;
    }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((num) => (
                <button
                    key={num}
                    type="button"
                    onClick={() => !disabled && onChange(num)}
                    disabled={disabled}
                    className={`w-8 h-8 rounded-full ${
                        level >= num
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                    } ${
                        disabled
                            ? 'opacity-60 cursor-not-allowed'
                            : 'hover:bg-purple-500 hover:text-white'
                    } transition-colors`}
                >
                    {num}
                </button>
            ))}
        </div>
    );
    const [skillSearchTerms, setSkillSearchTerms] = useState<{[key: string]: string}>({});
    const renderSkillDropdown = (skill: Skill, index: number, isNewProfession: boolean) => {
        const dropdownKey = `${isNewProfession ? 'new' : skill.tempId || skill.id}-${index}`;

        // Skills'leri alfabetik sırala ve ara
        const filteredAndSortedSkills = availableSkills
            .filter(option => {
                // Halihazırda seçili olan skilleri filtreleme
                const selectedSkills = isNewProfession
                    ? newProfession.requiredSkills
                    : editingProfession?.requiredSkills || [];

                const isAlreadySelected = selectedSkills.some(
                    (selectedSkill, idx) => idx !== index && selectedSkill.id === option.id
                );

                return !isAlreadySelected && option.name.toLowerCase().includes((skillSearchTerms[dropdownKey] || '').toLowerCase());
            })
            .sort((a, b) => a.name.localeCompare(b.name));

        return (
            <div className="relative flex-1">
                <button
                    type="button"
                    onClick={() => setIsSkillDropdownOpen(prev => ({
                        ...prev,
                        [dropdownKey]: !prev[dropdownKey]
                    }))}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-lg border ${
                        skill.id === 0 ? 'text-gray-400 bg-white border-gray-300' : 'bg-gray-100 border-gray-200'
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                    {skill.id === 0 ? "Select a skill" : skill.name}
                    <ChevronDown size={20}/>
                </button>
                {isSkillDropdownOpen[dropdownKey] && (
                    <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
                        {/* Search input */}
                        <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                            <input
                                type="text"
                                value={skillSearchTerms[dropdownKey] || ''}
                                onChange={(e) => setSkillSearchTerms(prev => ({
                                    ...prev,
                                    [dropdownKey]: e.target.value
                                }))}
                                placeholder="Search skills..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        {/* Skills list */}
                        <div className="max-h-48 overflow-y-auto">
                            {filteredAndSortedSkills.map(option => (
                                <div
                                    key={option.id}
                                    onClick={() => {
                                        const updatedSkill = {
                                            ...skill,
                                            id: option.id,
                                            name: option.name,
                                            tempId: skill.tempId || Date.now() + Math.random()
                                        };

                                        if (isNewProfession) {
                                            const updatedSkills = [...newProfession.requiredSkills];
                                            updatedSkills[index] = updatedSkill;
                                            setNewProfession({...newProfession, requiredSkills: updatedSkills});
                                        } else if (editingProfession) { // Add this condition
                                            const updatedSkills = [...editingProfession.requiredSkills];
                                            updatedSkills[index] = updatedSkill;
                                            setEditingProfession({
                                                ...editingProfession,
                                                requiredSkills: updatedSkills
                                            });
                                        }

                                        setIsSkillDropdownOpen(prev => ({...prev, [dropdownKey]: false}));
                                        setSkillSearchTerms(prev => ({...prev, [dropdownKey]: ''}));
                                    }}
                                    className={`px-4 py-2 cursor-pointer hover:bg-purple-100 ${
                                        skill.id === option.id ? "bg-purple-200 text-purple-800 font-medium" : "text-gray-700"
                                    }`}
                                >
                                    {option.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderExistingProfessionSkills = (profession: Profession, isEditing: boolean) => (
        <div className="space-y-2">
            {profession.requiredSkills.map((skill, index) => (
                <div key={`existing-skill-${skill.tempId || skill.id}-${index}`}
                     className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                    {isEditing ?
                        renderSkillDropdown(skill, index, isAddingNew) :
                        <span className="flex-1">{skill.name}</span>
                    }
                    <LevelSelector
                        level={skill.level}
                        onChange={(newLevel) => {
                            if (isAddingNew) {
                                const updatedSkills = [...newProfession.requiredSkills];
                                updatedSkills[index] = { ...skill, level: newLevel };
                                setNewProfession({
                                    ...newProfession,
                                    requiredSkills: updatedSkills
                                });
                            } else if (isEditing && editingProfession) {
                                const updatedSkills = [...editingProfession.requiredSkills];
                                updatedSkills[index] = { ...skill, level: newLevel };
                                setEditingProfession({
                                    ...editingProfession,
                                    requiredSkills: updatedSkills
                                });
                            }
                        }}
                        disabled={!isEditing}
                    />
                    {isEditing && (
                        <button
                            onClick={() => {
                                if (isAddingNew) {
                                    const updatedSkills = [...newProfession.requiredSkills];
                                    updatedSkills.splice(index, 1);
                                    setNewProfession({
                                        ...newProfession,
                                        requiredSkills: updatedSkills
                                    });
                                } else {
                                    handleDeleteSkill(index);
                                }
                            }}
                            className="text-red-600 hover:text-red-800 transition"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
    const renderIndustryDropdown = (id: string, selectedId: number | undefined, onChange: (id: number) => void) => (
        <div className="relative">
            <button
                type="button"
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

// ... previous code remains same ...

    // Add these handlers that were missing in the first part
    const handleStartEdit = (profession: Profession) => {
        setEditingId(profession.id);
        setEditingProfession({
            ...profession,
            requiredSkills: profession.requiredSkills.map(skill => ({
                ...skill,
                tempId: Date.now() + Math.random()
            }))
        });
        setExpandedProfession(profession.id);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingProfession(null);
    };

    const handleDeleteConfirm = async () => {
        if (professionToDelete !== null) {
            try {
                const result = await professionApi.deleteProfession(professionToDelete);

                if (result.success) {
                    setProfessions(prevProfessions =>
                        prevProfessions.filter(prof => prof.id !== professionToDelete)
                    );
                    setProfessionToDelete(null);
                    toast.success('Profession deleted successfully');
                } else {
                    setDeleteError(result.error?.message || 'An error occurred while deleting the profession');
                    setProfessionToDelete(null);
                }
            } catch (error: any) {
                console.error('Error deleting profession:', error);
                setDeleteError('An error occurred while deleting the profession');
                setProfessionToDelete(null);
            }
        }
    };

    const handleSaveNewProfession = async () => {
        if (!newProfession.requiredSkills.length) {
            toast.error('Please add at least one skill');
            return;
        }

        if (newProfession.name.trim() && newProfession.industryId && newProfession.requiredSkills.length > 0) {
            try {
                // Frontend'de önce mevcut meslekler arasında aynı isimde bir meslek var mı kontrol et
                const existingProfession = professions.find(
                    profession =>
                        profession.name.toLowerCase() === newProfession.name.trim().toLowerCase() &&
                        profession.industryId === newProfession.industryId
                );

                if (existingProfession) {
                    toast.error('This profession has already been added for this industry', {
                        duration: 2000,
                        style: {
                            border: '1px solid #EF4444',
                            padding: '12px',
                            color: '#DC2626',
                            backgroundColor: '#FEE2E2'
                        },
                    });
                    return;
                }

                const professionData = {
                    name: newProfession.name,
                    industryId: newProfession.industryId,
                    requiredSkills: newProfession.requiredSkills.map(skill => ({
                        skillId: skill.id,
                        requiredLevel: skill.level
                    }))
                };

                const response = await professionApi.createProfession(professionData);
                const formattedProfession = {
                    id: response.data.id,
                    name: response.data.name,
                    industry: newProfession.industry,
                    industryId: response.data.industryId,
                    requiredSkills: response.data.requiredSkills.map((skill: any) => ({
                        id: skill.skillId,
                        name: skill.skillName,
                        level: skill.requiredLevel,
                        tempId: Date.now() + Math.random()
                    }))
                };

                setProfessions(prevProfessions => [...prevProfessions, formattedProfession]);
                setIsAddingNew(false);
                resetNewProfession();
                toast.success('Profession added successfully', {
                    duration: 2000,
                    style: {
                        border: '1px solid #10B981',
                        padding: '12px',
                        color: '#059669',
                        backgroundColor: '#ECFDF5'
                    },
                });
            } catch (error: any) {
                if (error.response?.data?.message === "Profession with this name already exists in this industry") {
                    toast.error('This profession has already been added for this industry', {
                        duration: 2000,
                        style: {
                            border: '1px solid #EF4444',
                            padding: '12px',
                            color: '#DC2626',
                            backgroundColor: '#FEE2E2'
                        },
                    });
                } else {
                    const errorMessage = error.response?.data?.message || 'Failed to add profession';
                    toast.error(errorMessage, {
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
        }
    };

    const resetNewProfession = () => {
        setNewProfession({
            id: 0,
            name: "",
            industry: "",
            industryId: undefined,
            requiredSkills: []
        });
    };

    const renderProfessionItem = (prof: Profession) => {
        const isEditing = editingId === prof.id;
        const professionToRender = isEditing ? editingProfession! : prof;

        return (
            <div key={prof.id} className="border border-gray-300 rounded-lg p-4 text-black">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col space-y-2 flex-grow">
                        {isEditing ? (
                            <>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm text-gray-600">Profession Name:</label>
                                    <input
                                        type="text"
                                        value={professionToRender.name}
                                        onChange={(e) => setEditingProfession({
                                            ...professionToRender,
                                            name: e.target.value
                                        })}
                                        className="px-2 py-1 border rounded"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm text-gray-600">Industry:</label>
                                    <div className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                                        {professionToRender.industry}
                                    </div>
                                </div>
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
                        {renderExistingProfessionSkills(professionToRender, isEditing)}
                        {isEditing && (
                            <div className="space-y-2">
                                <button
                                    onClick={handleAddSkillToExistingProfession}
                                    className={`px-4 py-2 rounded-lg ${
                                        (editingProfession?.requiredSkills.length ?? 0) >= availableSkills.length
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-purple-600 hover:bg-purple-700'
                                    } text-white font-medium transition`}
                                    disabled={(editingProfession?.requiredSkills.length ?? 0) >= availableSkills.length}
                                >
                                    Add Skill {editingProfession?.requiredSkills.length}/{availableSkills.length}
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
            {/* Delete Confirmation Dialog */}
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

            {/* Error Dialog */}
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

            {/* Main Content */}
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
                        {/* Add New Profession Form */}
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
                                {renderExistingProfessionSkills(newProfession, true)}
                                <div className="flex justify-evenly">
                                    <button
                                        onClick={handleAddSkillToNewProfession}
                                        className={`px-4 py-2 rounded-lg ${
                                            newProfession.requiredSkills.length >= availableSkills.length
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-purple-600 hover:bg-purple-700'
                                        } text-white font-medium transition`}
                                        disabled={newProfession.requiredSkills.length >= availableSkills.length}
                                    >
                                        Add Skill {newProfession.requiredSkills.length}/{availableSkills.length}
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

                        {/* Existing Professions List */}
                        {professions.map(renderProfessionItem)}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddProfessionEski;