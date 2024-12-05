// ProfilePageComponent.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';

const ProfilePageComponent: React.FC = () => {
    const { user, updateUserData } = useAuth();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        console.log("Current user:", user);
    }, [user]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('File size should not exceed 5MB');
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const uploadProfilePicture = async (file: File) => {
        if (!user?.id) return;

        const formData = new FormData();
        formData.append("profileImage", file);
        formData.append("userId", user.id.toString());

        try {
            const response = await axios.post(
                "http://localhost:8081/api/users/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                await updateUserData(user.id);
                setSelectedFile(null);
                setPreviewImage(null);
            }
        } catch (error: any) {
            console.error("Error uploading file:", error.response?.data || error.message);
            alert('Failed to upload profile picture. Please try again.');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">My Profile</h1>
            <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 relative">
                    {(previewImage || user?.profileImage) ? (
                        <img
                            src={previewImage || (user?.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : '')}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                            No Image
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full max-w-xs"
                />
                {selectedFile && (
                    <button
                        onClick={() => selectedFile && uploadProfilePicture(selectedFile)}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    >
                        Upload
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProfilePageComponent;