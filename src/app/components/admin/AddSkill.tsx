import React, { useState } from 'react';
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// Skill type tanımı
type Skill = {
    id: number;
    name: string;
};

// Dummy data
const initialSkills: Skill[] = [
    { id: 1, name: "JavaScript Programming" },
    { id: 2, name: "UI/UX Design" },
    { id: 3, name: "Data Analysis" },
    { id: 4, name: "Project Management" },
    { id: 5, name: "Cloud Services" },
    { id: 6, name: "Problem Solving" },
    { id: 7, name: "Communication" },
    { id: 8, name: "Agile Methodologies" }
];

const AddSkill: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [newSkill, setNewSkill] = useState<string>('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>('');

    // Yeni skill ekleme
    const handleAddSkill = () => {
        if (newSkill.trim()) {
            const newId = Math.max(...skills.map(s => s.id), 0) + 1;
            setSkills([...skills, { id: newId, name: newSkill.trim() }]);
            setNewSkill('');
        }
    };

    // Skill silme
    const handleDeleteSkill = (id: number) => {
        setSkills(skills.filter(skill => skill.id !== id));
    };

    // Düzenleme moduna geçme
    const startEditing = (skill: Skill) => {
        setEditingId(skill.id);
        setEditValue(skill.name);
    };

    // Düzenlemeyi kaydetme
    const handleEditSave = () => {
        if (editingId && editValue.trim()) {
            setSkills(skills.map(skill =>
                skill.id === editingId
                    ? { ...skill, name: editValue.trim() }
                    : skill
            ));
            setEditingId(null);
            setEditValue('');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Card className="bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Add Skills
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Yeni Skill Ekleme */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                                placeholder="Enter new skill..."
                            />
                            <button
                                onClick={handleAddSkill}
                                disabled={!newSkill.trim()}
                                className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all duration-200 disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Add
                            </button>
                        </div>

                        {/* Skill Listesi */}
                        <div className="space-y-3">
                            {skills.map(skill => (
                                <div
                                    key={skill.id}
                                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white hover:border-purple-200 transition-all duration-200"
                                >
                                    {editingId === skill.id ? (
                                        // Düzenleme modu
                                        <div className="flex-1 flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                            <button
                                                onClick={handleEditSave}
                                                className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg"
                                            >
                                                <Check size={20} />
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        // Normal görünüm
                                        <>
                                            <span className="text-gray-700">{skill.name}</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => startEditing(skill)}
                                                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Pencil size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSkill(skill.id)}
                                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </>
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

export default AddSkill;