// src/components/AddProfession.tsx
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'react-hot-toast';
import { api } from '../services/ProfessionService';
import type { Profession, Industry, Skill, RequiredSkill } from '../types';

 const AddProfession = () => {
    const [professions, setProfessions] = useState<Profession[]>([]);
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [expandedProfession, setExpandedProfession] = useState<number | null>(null);
    const [editingProfession, setEditingProfession] = useState<Profession | null>(null);
    const [newProfession, setNewProfession] = useState<Partial<Profession>>({
        name: "",
        industryId: 0,
        requiredSkills: []
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            const [professionsData, industriesData, skillsData] = await Promise.all([
                api.getAllProfessions(),
                api.getAllIndustries(),
                api.getAllSkills()
            ]);
            setProfessions(professionsData);
            setIndustries(industriesData);
            setSkills(skillsData);
        } catch (error) {
            console.error('Error loading initial data:', error);
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    const resetNewProfession = () => {
        setNewProfession({
            name: "",
            industryId: 0,
            requiredSkills: []
        });
    };

    const handleAddSkillToNewProfession = () => {
        if (!skills.length) return;
        
        const newSkill: RequiredSkill = {
            id: Date.now(),
            skillId: skills[0].id,
            skillName: skills[0].name,
            requiredLevel: 1
        };

        setNewProfession(prev => ({
            ...prev,
            requiredSkills: [...(prev.requiredSkills || []), newSkill]
        }));
    };

    const handleAddSkillToExistingProfession = (profession: Profession) => {
        if (!skills.length) return;

        const newSkill: RequiredSkill = {
            id: Date.now(),
            skillId: skills[0].id,
            skillName: skills[0].name,
            requiredLevel: 1
        };

        setEditingProfession(prev => {
            if (!prev) return null;
            return {
                ...prev,
                requiredSkills: [...prev.requiredSkills, newSkill]
            };
        });
    };

    const handleSkillLevelChange = (professionId: number, skillId: number, level: number) => {
        if (editingProfession && editingProfession.id === professionId) {
            setEditingProfession({
                ...editingProfession,
                requiredSkills: editingProfession.requiredSkills.map(skill =>
                    skill.id === skillId ? { ...skill, requiredLevel: level } : skill
                )
            });
        }
    };

    const handleDeleteProfession = async (id: number) => {
        try {
            await api.deleteProfession(id);
            setProfessions(professions.filter(prof => prof.id !== id));
            toast.success('Profession deleted successfully');
        } catch (error) {
            console.error('Error deleting profession:', error);
            toast.error('Failed to delete profession');
        }
    };

    const handleSaveNewProfession = async () => {
        if (newProfession.name?.trim() && newProfession.industryId && newProfession.requiredSkills?.length) {
            try {
                const created = await api.createProfession(newProfession);
                setProfessions([...professions, created]);
                setIsAddingNew(false);
                resetNewProfession();
                toast.success('Profession created successfully');
            } catch (error) {
                console.error('Error creating profession:', error);
                toast.error('Failed to create profession');
            }
        } else {
            toast.error('Please fill all required fields');
        }
    };

    const handleStartEdit = (profession: Profession) => {
        setEditingId(profession.id);
        setEditingProfession({ ...profession });
        setExpandedProfession(profession.id);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingProfession(null);
    };

    const handleSaveEdit = async () => {
        if (editingProfession) {
            try {
                const updated = await api.updateProfession(editingProfession.id, editingProfession);
                setProfessions(professions.map(prof =>
                    prof.id === updated.id ? updated : prof
                ));
                setEditingId(null);
                setEditingProfession(null);
                toast.success('Profession updated successfully');
            } catch (error) {
                console.error('Error updating profession:', error);
                toast.error('Failed to update profession');
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
                    type="button"
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

    const renderProfessionContent = (prof: Profession) => {
        const isEditing = editingId === prof.id;
        const professionToRender = isEditing ? editingProfession! : prof;

        return (
            <div key={prof.id} className="border border-gray-300 rounded-lg p-4 mb-4">
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
                                    value={professionToRender.industryId}
                                    onChange={(e) => setEditingProfession({
                                        ...professionToRender,
                                        industryId: Number(e.target.value)
                                    })}
                                    className="px-2 py-1 border rounded"
                                >
                                    {industries.map(industry => (
                                        <option key={industry.id} value={industry.id}>
                                            {industry.name}
                                        </option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <>
                                <span className="text-lg font-semibold">{professionToRender.name}</span>
                                <span className="text-sm text-gray-600">{professionToRender.industryName}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSaveEdit}
                                    className="p-2 text-green-500 hover:text-green-600 transition"
                                >
                                    <Check size={20} />
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="p-2 text-red-500 hover:text-red-600 transition"
                                >
                                    <X size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleStartEdit(prof)}
                                    className="p-2 text-yellow-500 hover:text-yellow-600 transition"
                                >
                                    <Pencil size={20} />
                                </button>
                                <button
                                    onClick={() => handleDeleteProfession(prof.id)}
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
                        {professionToRender.requiredSkills.map(skill => (
                            <div key={skill.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                                {isEditing ? (
                                    <select
                                        value={skill.skillId}
                                        onChange={(e) => {
                                            const selectedSkill = skills.find(s => s.id === Number(e.target.value));
                                            if (!selectedSkill) return;

                                            const updatedSkills = professionToRender.requiredSkills.map(s =>
                                                s.id === skill.id ? {
                                                    ...s,
                                                    skillId: selectedSkill.id,
                                                    skillName: selectedSkill.name
                                                } : s
                                            );
                                            setEditingProfession({
                                                ...professionToRender,
                                                requiredSkills: updatedSkills
                                            });
                                        }}
                                        className="flex-1 px-3 py-2 rounded-md border border-gray-200"
                                    >
                                        {skills.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="flex-1">{skill.skillName}</span>
                                )}
                                <LevelSelector
                                    level={skill.requiredLevel}
                                    onChange={(level) => handleSkillLevelChange(prof.id, skill.id, level)}
                                    disabled={!isEditing}
                                />
                                {isEditing && (
                                    <button
                                        onClick={() => handleDeleteSkill(prof.id, skill.id)}
                                        className="text-red-600 hover:text-red-800 transition"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <button
                                onClick={() => handleAddSkillToExistingProfession(professionToRender)}
                                className="w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                            >
                                Add Skill
                            </button>
                        )}
                    </div>
                )}
            </div>);
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
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
                        {isLoading ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : (
                            <>
                                {isAddingNew && (
                                    <div className="border border-purple-200 rounded-lg p-4 space-y-4">
                                        <input
                                            type="text"
                                            value={newProfession.name}
                                            onChange={(e) => setNewProfession({...newProfession, name: e.target.value})}
                                            placeholder="Enter profession name..."
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                                        />
                                        <select
                                            value={newProfession.industryId}
                                            onChange={(e) => setNewProfession({
                                                ...newProfession,
                                                industryId: Number(e.target.value)
                                            })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value={0}>Select Industry</option>
                                            {industries.map(industry => (
                                                <option key={industry.id} value={industry.id}>
                                                    {industry.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="space-y-2">
                                            {newProfession.requiredSkills?.map((skill, index) => (
                                                <div key={skill.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                                                    <select
                                                        value={skill.skillId}
                                                        onChange={(e) => {
                                                            const selectedSkill = skills.find(s => s.id === Number(e.target.value));
                                                            if (!selectedSkill) return;
                                                            const updatedSkills = [...newProfession.requiredSkills!];
                                                            updatedSkills[index] = {
                                                                ...skill,
                                                                skillId: selectedSkill.id,
                                                                skillName: selectedSkill.name
                                                            };
                                                            setNewProfession({
                                                                ...newProfession,
                                                                requiredSkills: updatedSkills
                                                            });
                                                        }}
                                                        className="flex-1 px-3 py-2 rounded-md border border-gray-200"
                                                    >
                                                        {skills.map(option => (
                                                            <option key={option.id} value={option.id}>
                                                                {option.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <LevelSelector
                                                        level={skill.requiredLevel}
                                                        onChange={(level) => {
                                                            const updatedSkills = [...newProfession.requiredSkills!];
                                                            updatedSkills[index] = { ...skill, requiredLevel: level };
                                                            setNewProfession({
                                                                ...newProfession,
                                                                requiredSkills: updatedSkills
                                                            });
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const updatedSkills = newProfession.requiredSkills!.filter((_, i) => i !== index);
                                                            setNewProfession({
                                                                ...newProfession,
                                                                requiredSkills: updatedSkills
                                                            });
                                                        }}
                                                        className="text-red-600 hover:text-red-800 transition"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-evenly gap-4">
                                            <button
                                                onClick={handleAddSkillToNewProfession}
                                                className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                                            >
                                                Add Skill
                                            </button>
                                            <button
                                                onClick={handleSaveNewProfession}
                                                className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                                            >
                                                Save Profession
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsAddingNew(false);
                                                    resetNewProfession();
                                                }}
                                                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {professions.map(prof => renderProfessionContent(prof))}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddProfession;  