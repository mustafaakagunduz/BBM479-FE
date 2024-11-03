import React, { useState } from 'react';
import { Pencil, Trash2, Plus, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

type Skill = {
    id: number;
    name: string;
    level: number;
};

type Profession = {
    id: number;
    name: string;
    industry: string;
    requiredSkills: Skill[];
};

const skillOptions = [
    "JavaScript Programming", "UI/UX Design", "React", "CSS",
    "Python", "Machine Learning", "Statistics", "Data Visualization",
    "Leadership", "Agile Methodologies", "Communication", "Risk Management",
    "Cloud Computing", "DevOps", "Database Management", "Problem Solving"
];

const industryOptions = [
    "Information Technologies", "Healthcare", "Finance", "Education", "Management"
];

const initialProfessions: Profession[] = [
    {
        id: 1,
        name: "Frontend Developer",
        industry: "Information Technologies",
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
        industry: "Information Technologies",
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
        industry: "Management",
        requiredSkills: [
            { id: 9, name: "Leadership", level: 5 },
            { id: 10, name: "Agile Methodologies", level: 4 },
            { id: 11, name: "Communication", level: 5 },
            { id: 12, name: "Risk Management", level: 3 }
        ]
    }
];

const AddProfession = () => {
    const [professions, setProfessions] = useState<Profession[]>(initialProfessions);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [expandedProfession, setExpandedProfession] = useState<number | null>(null);
    const [editingProfession, setEditingProfession] = useState<Profession | null>(null);
    const [newProfession, setNewProfession] = useState<Profession>({
        id: 0,
        name: "",
        industry: "",
        requiredSkills: []
    });

    const resetNewProfession = () => {
        setNewProfession({
            id: 0,
            name: "",
            industry: "",
            requiredSkills: []
        });
    };

    const handleAddSkillToNewProfession = () => {
        const newSkill = { id: Date.now(), name: skillOptions[0], level: 1 };
        setNewProfession({
            ...newProfession,
            requiredSkills: [...newProfession.requiredSkills, newSkill]
        });
    };

    const handleAddSkillToExistingProfession = (profession: Profession) => {
        const newSkill = { id: Date.now(), name: skillOptions[0], level: 1 };
        const updatedProfession = {
            ...profession,
            requiredSkills: [...profession.requiredSkills, newSkill]
        };
        setEditingProfession(updatedProfession);
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

    const handleDeleteProfession = (id: number) => {
        setProfessions(professions.filter(prof => prof.id !== id));
    };

    const handleSaveNewProfession = () => {
        if (newProfession.name.trim() && newProfession.industry && newProfession.requiredSkills.length > 0) {
            const newId = Math.max(...professions.map(p => p.id), 0) + 1;
            setProfessions([...professions, { ...newProfession, id: newId }]);
            setIsAddingNew(false);
            resetNewProfession();
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

    const handleSaveEdit = () => {
        if (editingProfession) {
            setProfessions(professions.map(prof =>
                prof.id === editingProfession.id ? editingProfession : prof
            ));
            setEditingId(null);
            setEditingProfession(null);
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

    const renderProfessionContent = (prof: Profession) => {
        const isEditing = editingId === prof.id;
        const professionToRender = isEditing ? editingProfession! : prof;

        return (
            <div key={prof.id} className="border border-gray-300 rounded-lg p-4 text-black">
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
                                    value={professionToRender.industry}
                                    onChange={(e) => setEditingProfession({
                                        ...professionToRender,
                                        industry: e.target.value
                                    })}
                                    className="px-2 py-1 border rounded"
                                >
                                    {industryOptions.map(industry => (
                                        <option key={industry} value={industry}>{industry}</option>
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
                                        value={skill.name}
                                        onChange={(e) => {
                                            const updatedSkills = professionToRender.requiredSkills.map(s =>
                                                s.id === skill.id ? { ...s, name: e.target.value } : s
                                            );
                                            setEditingProfession({
                                                ...professionToRender,
                                                requiredSkills: updatedSkills
                                            });
                                        }}
                                        className="flex-1 px-3 py-2 rounded-md border border-gray-200"
                                    >
                                        {skillOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="flex-1">{skill.name}</span>
                                )}
                                <LevelSelector
                                    level={skill.level}
                                    onChange={(level) => handleSkillLevelChange(prof.id, skill.id, level)}
                                    disabled={!isEditing}
                                />
                                {isEditing && (
                                    <button
                                        onClick={() => handleDeleteSkill(prof.id, skill.id)}
                                        className="text-red-600 hover:text-red-800 transition"
                                    >
                                        <Trash2 size={20}/>
                                    </button>
                                )}
                            </div>
                        ))}
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
                                <select
                                    value={newProfession.industry}
                                    onChange={(e) => setNewProfession({...newProfession, industry: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple"
                                >
                                    <option value="" disabled>Select Industry</option>
                                    {industryOptions.map(industry => (
                                        <option key={industry} value={industry}>{industry}</option>
                                    ))}
                                </select>


                                <div className="space-y-2">
                                    {newProfession.requiredSkills.map((skill, index) => (
                                        <div key={skill.id}
                                             className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                                            <select
                                                value={skill.name}
                                                onChange={(e) => {
                                                    const updatedSkills = [...newProfession.requiredSkills];
                                                    updatedSkills[index] = {...skill, name: e.target.value};
                                                    setNewProfession({...newProfession, requiredSkills: updatedSkills});
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
                                <div className="space-y-4">
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
                            </div>
                        )}
                        {professions.map(prof => renderProfessionContent(prof))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddProfession;