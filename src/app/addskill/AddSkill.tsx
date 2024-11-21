import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Check, X, ChevronDown } from 'lucide-react';
import { skillService, Skill } from '../services/skillService';
import { industryService } from '../services/industryService';
import { toast } from 'react-hot-toast';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface Industry {
    id: number;
    name: string;
}

const AddSkill: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [newSkill, setNewSkill] = useState<string>('');
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filterIndustry, setFilterIndustry] = useState<Industry | null>(null);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState<number | null>(null);
    const [editingSkill, setEditingSkill] = useState<{
        id: number;
        name: string;
        industryId: number;
        isEditingIndustry: boolean;
    } | null>(null);

    const openDeleteModal = (skillId: number) => {
        setSkillToDelete(skillId);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSkillToDelete(null);
        setDeleteModalOpen(false);
    };

    const confirmDelete = async () => {
        if (skillToDelete) {
            await handleDeleteSkill(skillToDelete);
            closeDeleteModal();
        }
    };

    useEffect(() => {
        fetchIndustries();
        fetchSkills();
    }, []);

    const fetchIndustries = async () => {
        try {
            const data = await industryService.getAllIndustries();
            setIndustries(data);
        } catch (error) {
            toast.error('Failed to fetch industries');
            console.error('Error fetching industries:', error);
        }
    };

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const data = await skillService.getAllSkills();
            setSkills(data);
        } catch (error) {
            toast.error('Failed to fetch skills');
            console.error('Error fetching skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = async () => {
        if (newSkill.trim() && selectedIndustry) {
            try {
                setLoading(true);
                await skillService.createSkill({
                    name: newSkill.trim(),
                    industryId: selectedIndustry.id
                });
                await fetchSkills();
                setNewSkill('');
                setSelectedIndustry(null);
                toast.success('Skill added successfully');
            } catch (error) {
                toast.error('Failed to add skill');
                console.error('Error adding skill:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEditClick = (skill: Skill) => {
        setEditingSkill({
            id: skill.id,
            name: skill.name,
            industryId: skill.industryId,
            isEditingIndustry: false
        });
    };

    const handleCancelEdit = () => {
        setEditingSkill(null);
    };

    const handleUpdateSkill = async (skillId: number, newName: string, newIndustryId: number) => {
        try {
            setLoading(true);
            await skillService.updateSkill(skillId, {
                name: newName.trim(),
                industryId: newIndustryId
            });
            await fetchSkills();
            setEditingSkill(null);
            toast.success('Skill updated successfully');
        } catch (error) {
            toast.error('Failed to update skill');
            console.error('Error updating skill:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSkill = async (skillId: number) => {
        try {
            setLoading(true);
            await skillService.deleteSkill(skillId);
            await fetchSkills();
            toast.success('Skill deleted successfully');
        } catch (error) {
            toast.error('Failed to delete skill');
            console.error('Error deleting skill:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleIndustry = (industry: Industry) => {
        setSelectedIndustry(industry);
        setIsDropdownOpen(false);
    };

    const filteredSkills = filterIndustry
        ? skills.filter(skill => skill.industryId === filterIndustry.id)
        : skills;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Add Skill Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 space-y-4 relative z-30">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Skill</h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                            placeholder="Enter new skill..."
                        />
                        <button
                            onClick={() => handleAddSkill()}
                            disabled={!newSkill.trim() || !selectedIndustry}
                            className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50"
                        >
                            <Plus size={20}/>
                        </button>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                        >
                            {selectedIndustry ? selectedIndustry.name : "Select Industry"}
                            <ChevronDown size={20}/>
                        </button>
                        {isDropdownOpen && (
                            <div
                                className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {industries.map(industry => (
                                    <div
                                        key={industry.id}
                                        onClick={() => toggleIndustry(industry)}
                                        className={`px-4 py-2 cursor-pointer hover:bg-purple-100 ${
                                            selectedIndustry?.id === industry.id
                                                ? "bg-purple-200 text-purple-800 font-medium"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {industry.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills List Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 relative z-20">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Existing Skills</h2>
                        {/* Industry Filter Dropdown */}
                        <div className="relative w-64">
                            <button
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                            >
                                {filterIndustry ? filterIndustry.name : "Filter by Industry"}
                                <ChevronDown size={20}/>
                            </button>
                            {isFilterDropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    <div
                                        className="px-4 py-2 cursor-pointer hover:bg-purple-100 text-gray-700"
                                        onClick={() => {
                                            setFilterIndustry(null);
                                            setIsFilterDropdownOpen(false);
                                        }}
                                    >
                                        All Industries
                                    </div>
                                    {industries.map(industry => (
                                        <div
                                            key={industry.id}
                                            onClick={() => {
                                                setFilterIndustry(industry);
                                                setIsFilterDropdownOpen(false);
                                            }}
                                            className={`px-4 py-2 cursor-pointer hover:bg-purple-100 ${
                                                filterIndustry?.id === industry.id
                                                    ? "bg-purple-200 text-purple-800 font-medium"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {industry.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-3">
                        {filteredSkills.map(skill => (
                            <div key={skill.id} className="p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between">
                                    {editingSkill?.id === skill.id ? (
                                        <div className="flex-1 mr-4">
                                            <input
                                                type="text"
                                                value={editingSkill.name}
                                                onChange={(e) => setEditingSkill({
                                                    ...editingSkill,
                                                    name: e.target.value
                                                })}
                                                className="w-full px-3 py-1 rounded border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-gray-700">{skill.name}</span>
                                    )}
                                    <div className="flex gap-2">
                                        {editingSkill?.id === skill.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateSkill(
                                                        skill.id,
                                                        editingSkill.name,
                                                        editingSkill.industryId
                                                    )}
                                                    className="p-2 rounded-lg hover:bg-green-100 text-green-600"
                                                >
                                                    <Check size={16}/>
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                                                >
                                                    <X size={16}/>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEditClick(skill)}
                                                    className="p-2 rounded-lg hover:bg-purple-100 text-purple-600"
                                                >
                                                    <Pencil size={16}/>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(skill.id)}
                                                    className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                                                >
                                                    <Trash2 size={16}/>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 mt-2 ">
                                    {editingSkill?.id === skill.id ? (
                                        <div className="relative">
                                            <button
                                                onClick={() => setEditingSkill({
                                                    ...editingSkill,
                                                    isEditingIndustry: !editingSkill.isEditingIndustry
                                                })}
                                                className="w-full text-left px-3 py-1 bg-gray-100 rounded border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent "
                                            >
                                                {industries.find(i => i.id === editingSkill.industryId)?.name}
                                            </button>
                                            {editingSkill.isEditingIndustry && (
                                                <div
                                                    className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50 ">
                                                    {industries.map(industry => (
                                                        <div
                                                            key={industry.id}
                                                            onClick={() => {
                                                                setEditingSkill({
                                                                    ...editingSkill,
                                                                    industryId: industry.id,
                                                                    isEditingIndustry: false
                                                                });
                                                            }}
                                                            className="px-3 py-2 cursor-pointer hover:bg-purple-100 "
                                                        >
                                                            {industry.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        industries.find(i => i.id === skill.industryId)?.name || 'Unknown Industry'
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>



            <Dialog
                open={deleteModalOpen}
                onClose={closeDeleteModal}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">
                    Delete Confirmation
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this skill?
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={closeDeleteModal}
                        sx={{
                            backgroundColor: '#9333EA',
                            color: 'white',
                            '&:hover': {backgroundColor: '#7E22CE'}
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        sx={{
                            backgroundColor: '#9333EA',
                            color: 'white',
                            '&:hover': {backgroundColor: '#7E22CE'}
                        }}
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
)
    ;
};

export default AddSkill;