import React, { useState } from 'react';
import { Pencil, Trash2, Plus, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type Skill = {
    id: number;
    name: string;
    level: number;
};

type Profession = {
    id: number;
    name: string;
    requiredSkills: Skill[];
};

// Dummy data
const initialProfessions: Profession[] = [
    {
        id: 1,
        name: "Frontend Developer",
        requiredSkills: [
            { id: 1, name: "JavaScript Programming", level: 4 },
            { id: 2, name: "UI/UX Design", level: 3 },
            { id: 3, name: "React", level: 4 },
            { id: 4, name: "CSS", level: 4 }
        ]
    },
    {
        id: 2,
        name: "Data Scientist",
        requiredSkills: [
            { id: 5, name: "Python", level: 5 },
            { id: 6, name: "Machine Learning", level: 4 },
            { id: 7, name: "Statistics", level: 4 },
            { id: 8, name: "Data Visualization", level: 3 }
        ]
    },
    {
        id: 3,
        name: "Project Manager",
        requiredSkills: [
            { id: 9, name: "Leadership", level: 5 },
            { id: 10, name: "Agile Methodologies", level: 4 },
            { id: 11, name: "Communication", level: 5 },
            { id: 12, name: "Risk Management", level: 3 }
        ]
    }
];

const skillOptions = [
    "JavaScript Programming", "UI/UX Design", "React", "CSS",
    "Python", "Machine Learning", "Statistics", "Data Visualization",
    "Leadership", "Agile Methodologies", "Communication", "Risk Management",
    "Cloud Computing", "DevOps", "Database Management", "Problem Solving"
];

const AddProfession: React.FC = () => {
    const [professions, setProfessions] = useState<Profession[]>(initialProfessions);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newProfession, setNewProfession] = useState<Profession>({
        id: 0,
        name: "",
        requiredSkills: []
    });
    const [expandedProfession, setExpandedProfession] = useState<number | null>(null);

    const resetNewProfession = () => {
        setNewProfession({
            id: 0,
            name: "",
            requiredSkills: []
        });
    };

    const handleAddSkillToProfession = () => {
        const newSkill = { id: Date.now(), name: skillOptions[0], level: 1 };
        if (isAddingNew) {
            setNewProfession({
                ...newProfession,
                requiredSkills: [...newProfession.requiredSkills, newSkill]
            });
        } else if (editingId) {
            setProfessions(professions.map(prof =>
                prof.id === editingId
                    ? { ...prof, requiredSkills: [...prof.requiredSkills, newSkill] }
                    : prof
            ));
        }
    };

    const handleSkillLevelChange = (professionId: number, skillId: number, level: number) => {
        setProfessions(professions.map(prof =>
            prof.id === professionId
                ? {
                    ...prof,
                    requiredSkills: prof.requiredSkills.map(skill =>
                        skill.id === skillId ? { ...skill, level } : skill
                    )
                }
                : prof
        ));
    };

    const handleDeleteProfession = (id: number) => {
        setProfessions(professions.filter(prof => prof.id !== id));
    };

    const handleSaveNewProfession = () => {
        if (newProfession.name.trim() && newProfession.requiredSkills.length > 0) {
            const newId = Math.max(...professions.map(p => p.id), 0) + 1;
            setProfessions([...professions, { ...newProfession, id: newId }]);
            setIsAddingNew(false);
            resetNewProfession();
        }
    };

    const LevelSelector: React.FC<{ level: number; onChange: (level: number) => void }> = ({ level, onChange }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((num) => (
                <button
                    key={num}
                    className={`w-8 h-8 rounded-full ${level >= num
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-600'} 
                        hover:bg-purple-500 hover:text-white transition-colors`}
                    onClick={() => onChange(num)}
                >
                    {num}
                </button>
            ))}
        </div>
    );

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
                        {isAddingNew && (
                            <div className="border border-purple-200 rounded-lg p-4 space-y-4">
                                <input
                                    type="text"
                                    value={newProfession.name}
                                    onChange={(e) => setNewProfession({ ...newProfession, name: e.target.value })}
                                    placeholder="Enter profession name..."
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 text-black"
                                />
                                <div className="space-y-2">
                                    {newProfession.requiredSkills.map((skill, index) => (
                                        <div key={skill.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                                            <select
                                                value={skill.name}
                                                onChange={(e) => {
                                                    const updatedSkills = [...newProfession.requiredSkills];
                                                    updatedSkills[index] = { ...skill, name: e.target.value };
                                                    setNewProfession({ ...newProfession, requiredSkills: updatedSkills });
                                                }}
                                                className="flex-1 px-3 py-2 rounded-md border border-gray-200 text-black"
                                            >
                                                {skillOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            <LevelSelector
                                                level={skill.level}
                                                onChange={(level) => {
                                                    const updatedSkills = [...newProfession.requiredSkills];
                                                    updatedSkills[index] = { ...skill, level };
                                                    setNewProfession({ ...newProfession, requiredSkills: updatedSkills });
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    const updatedSkills = newProfession.requiredSkills.filter(s => s.id !== skill.id);
                                                    setNewProfession({ ...newProfession, requiredSkills: updatedSkills });
                                                }}
                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleAddSkillToProfession}
                                            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
                                        >
                                            <Plus size={16} />
                                            Add Skill
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => {
                                            setIsAddingNew(false);
                                            resetNewProfession();
                                        }}
                                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveNewProfession}
                                        disabled={!newProfession.name || newProfession.requiredSkills.length === 0}
                                        className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 disabled:bg-purple-300 disabled:cursor-not-allowed"
                                    >
                                        Save Profession
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {professions.map(profession => (
                                <div
                                    key={profession.id}
                                    className="border border-gray-200 rounded-lg hover:border-purple-200 transition-all duration-200"
                                >
                                    <div
                                        className="flex items-center justify-between p-4 cursor-pointer"
                                        onClick={() => setExpandedProfession(
                                            expandedProfession === profession.id ? null : profession.id
                                        )}
                                    >
                                        <span className="text-lg font-medium text-black">
                                            {profession.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteProfession(profession.id);
                                                }}
                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                            {expandedProfession === profession.id ? (
                                                <ChevronUp className="text-black" size={20} />
                                            ) : (
                                                <ChevronDown className="text-black" size={20} />
                                            )}
                                        </div>
                                    </div>
                                    {expandedProfession === profession.id && (
                                        <div className="p-4 border-t border-gray-100 space-y-3">
                                            {profession.requiredSkills.map(skill => (
                                                <div
                                                    key={skill.id}
                                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                                >
                                                    <span className="text-black">{skill.name}</span>
                                                    <LevelSelector
                                                        level={skill.level}
                                                        onChange={(level) => handleSkillLevelChange(profession.id, skill.id, level)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddProfession;