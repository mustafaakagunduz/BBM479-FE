import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Check, X, ChevronDown } from 'lucide-react';
import { skillService, Skill } from '../services/skillService';
import { industryService } from '../services/industryService';
import {toast, Toaster} from 'react-hot-toast';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle
} from "@/app/components/ui/alert-dialog";

interface Industry {
    id: number;
    name: string;
}



interface CreateSkillDTO {
    name: string;
    industryId: number;  // Backend'de Long
}

const AddSkill: React.FC = () => {
    const [deleteError, setDeleteError] = useState<string | null>(null);
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
    const [isProcessing, setIsProcessing] = useState(false); // loading yerine isProcessing kullanalım
    const [isInitialLoading, setIsInitialLoading] = useState(true); // sadece ilk yükleme için

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsInitialLoading(true);
                const [industriesData, skillsData] = await Promise.all([
                    industryService.getAllIndustries(),
                    skillService.getAllSkills()
                ]);
                setIndustries(industriesData);
                setSkills(skillsData);
            } catch (error) {
                toast.error('Failed to load initial data');
                console.error('Error loading initial data:', error);
            } finally {
                setIsInitialLoading(false);
            }
        };

        loadInitialData();
    }, []);


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

    const handleAddSkill = async () => {
        if (newSkill.trim() && selectedIndustry) {
            try {
                // Frontend'de önce mevcut skill'ler arasında aynı isimde ve aynı industry'de bir skill var mı kontrol et
                const existingSkill = skills.find(
                    skill =>
                        skill.name.toLowerCase() === newSkill.trim().toLowerCase() &&
                        skill.industryId === selectedIndustry.id
                );

                if (existingSkill) {
                    toast.error('This skill has already been added for this industry', {
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

                setIsProcessing(true);
                const createDTO: CreateSkillDTO = {
                    name: newSkill.trim(),
                    industryId: selectedIndustry.id
                };

                const createdSkill = await skillService.createSkill(createDTO);
                setSkills(prevSkills => [...prevSkills, createdSkill]);
                setNewSkill('');
                setSelectedIndustry(null);
                toast.success('Skill added successfully', {
                    duration: 2000,
                    style: {
                        border: '1px solid #10B981',
                        padding: '12px',
                        color: '#059669',
                        backgroundColor: '#ECFDF5'
                    },
                });
            } catch (error: any) {
                if (error.response?.data?.message === "Skill with this name already exists in this industry") {
                    toast.error('This skill has already been added for this industry', {
                        duration: 2000,
                        style: {
                            border: '1px solid #EF4444',
                            padding: '12px',
                            color: '#DC2626',
                            backgroundColor: '#FEE2E2'
                        },
                    });
                } else {
                    const errorMessage = error.response?.data?.message || 'Failed to add skill';
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
            } finally {
                setIsProcessing(false);
            }
        }
    };

    // Benzer şekilde diğer işlem fonksiyonlarını da güncelleyin
    const handleUpdateSkill = async (skillId: number, newName: string, newIndustryId: number) => {
        try {
            setIsProcessing(true);
            const updateDTO: CreateSkillDTO = {
                name: newName.trim(),
                industryId: newIndustryId
            };

            const updatedSkill = await skillService.updateSkill(skillId, updateDTO);
            setSkills(prevSkills => prevSkills.map(skill =>
                skill.id === skillId ? updatedSkill : skill
            ));
            setEditingSkill(null);

            toast.success('Skill updated successfully', {
                duration: 2000,
                style: {
                    border: '1px solid #10B981',
                    padding: '12px',
                    color: '#059669',
                    backgroundColor: '#ECFDF5'
                },
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update skill';
            toast.error(errorMessage, {
                duration: 2000,
                style: {
                    border: '1px solid #EF4444',
                    padding: '12px',
                    color: '#DC2626',
                    backgroundColor: '#FEE2E2'
                },
            });
        } finally {
            setIsProcessing(false);
        }
    };
    const handleDeleteSkill = async (skillId: number) => {
        try {
            setIsProcessing(true);
            const result = await skillService.deleteSkill(skillId);

            if (result.success) {
                setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId));
                closeDeleteModal();
                toast.success('Skill deleted successfully', {
                    duration: 2000,
                    style: {
                        border: '1px solid #10B981',
                        padding: '12px',
                        color: '#059669',
                        backgroundColor: '#ECFDF5'
                    },
                });
            } else if (result.error) {
                setDeleteError(result.error.message);
                closeDeleteModal();
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleIndustry = (industry: Industry) => {
        setSelectedIndustry(industry);
        setIsDropdownOpen(false);
    };

    const filteredSkills = filterIndustry
        ? skills.filter(skill => skill.industryId === filterIndustry.id)
        : skills;

    if (isInitialLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">

            <AlertDialog open={deleteModalOpen}>
                <AlertDialogContent className="flex flex-col items-center justify-center p-6 bg-white">
                    <AlertDialogTitle className="text-xl font-semibold text-purple-600 mb-4">
                        Delete Skill
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-lg text-purple-500 mb-6">
                        Are you sure you want to delete this skill?
                    </AlertDialogDescription>
                    <div className="flex gap-4">
                        <button
                            onClick={confirmDelete}
                            disabled={isProcessing}
                            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                            {isProcessing ? (
                                <div className="flex items-center">
                                    <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white"></div>
                                    <span>Deleting...</span>
                                </div>
                            ) : (
                                'Delete'
                            )}
                        </button>
                        <button
                            onClick={closeDeleteModal}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
            {/* Error Modal - Bunu ekleyin */}
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




        </div>
)
    ;
};

export default AddSkill;