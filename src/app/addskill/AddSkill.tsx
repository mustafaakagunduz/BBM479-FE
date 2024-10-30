import React, { useState } from 'react';
import { Pencil, Trash2, Plus, Check, ChevronDown } from 'lucide-react';

type Skill = {
    id: number;
    name: string;
    industry: string; // Tek bir endüstri
};

const AVAILABLE_INDUSTRIES = [
    "Finance and Banking",
    "Healthcare and Biotechnology",
    "Education",
    "Information Technologies"
];

const initialSkills: Skill[] = [
    { id: 1, name: "JavaScript Programming", industry: "Information Technologies" },
    { id: 2, name: "UI/UX Design", industry: "Education" },
];

const AddSkill: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [newSkill, setNewSkill] = useState<string>('');
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null); // Tek bir endüstri
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [editingSkillId, setEditingSkillId] = useState<number | null>(null);

    const handleAddSkill = () => {
        if (newSkill.trim() && selectedIndustry) {
            const newId = Math.max(...skills.map(s => s.id), 0) + 1;
            setSkills([...skills, { id: newId, name: newSkill.trim(), industry: selectedIndustry }]);
            setNewSkill('');
            setSelectedIndustry(null);
        }
    };

    const handleEditSkill = (skill: Skill) => {
        setEditingSkillId(skill.id);
        setNewSkill(skill.name);
        setSelectedIndustry(skill.industry);
    };

    const handleUpdateSkill = () => {
        if (editingSkillId !== null && newSkill.trim() && selectedIndustry) {
            setSkills(prevSkills =>
                prevSkills.map(skill =>
                    skill.id === editingSkillId
                        ? { ...skill, name: newSkill.trim(), industry: selectedIndustry }
                        : skill
                )
            );
            setEditingSkillId(null);
            setNewSkill('');
            setSelectedIndustry(null);
        }
    };

    const handleDeleteSkill = (skillId: number) => {
        setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId));
    };

    const toggleIndustry = (industry: string) => {
        setSelectedIndustry(prev => (prev === industry ? null : industry)); // Tek bir endüstri seçimi
        setIsDropdownOpen(false); // Dropdown'u kapat
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 space-y-6">
                    {/* Yeni Beceri Ekleme */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                            placeholder="Enter new skill..."
                        />
                        {editingSkillId === null ? (
                            <button
                                onClick={handleAddSkill}
                                disabled={!newSkill.trim() || !selectedIndustry}
                                className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
                            >
                                <Plus size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={handleUpdateSkill}
                                disabled={!newSkill.trim() || !selectedIndustry}
                                className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
                            >
                                <Check size={20} />
                            </button>
                        )}
                    </div>

                    {/* Endüstri Dropdown Menüsü */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                        >
                            {selectedIndustry || "Select Industry"}
                            <ChevronDown size={20} />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                                {AVAILABLE_INDUSTRIES.map(industry => (
                                    <div
                                        key={industry}
                                        onClick={() => toggleIndustry(industry)}
                                        className={`px-4 py-2 cursor-pointer hover:bg-purple-100 ${
                                            selectedIndustry === industry
                                                ? "bg-purple-200 text-purple-800 font-medium"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {industry}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Beceri Listesi */}
                    <div className="space-y-3">
                        {skills.map(skill => (
                            <div key={skill.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                                <span className="text-gray-700">{skill.name}</span>
                                <div className="text-sm text-gray-500">
                                    {skill.industry}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditSkill(skill)}
                                        className="p-2 rounded-lg hover:bg-purple-100 text-purple-600"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSkill(skill.id)}
                                        className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSkill;
