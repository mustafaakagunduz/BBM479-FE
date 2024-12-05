'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import { AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserUpdateData {
    name: string;
    email: string;
    username: string;
}

interface PasswordUpdate {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ProfilePageComponent: React.FC = () => {
    const { user, updateUserData } = useAuth();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserUpdateData>({
        name: user?.name || '',
        email: user?.email || '',
        username: user?.username || ''
    });
    const [passwordData, setPasswordData] = useState<PasswordUpdate>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        if (user) {
            setUserData({
                name: user.name || '',
                email: user.email || '',
                username: user.username || ''
            });
        }
    }, [user]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'File size should not exceed 5MB' });
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
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.status === 200) {
                await updateUserData(user.id);
                setSelectedFile(null);
                setPreviewImage(null);
                setMessage({ type: 'success', text: 'Profile picture updated successfully' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to upload profile picture' });
        }
    };

    const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const updateUserInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        try {
            const response = await axios.put(`http://localhost:8081/api/users/${user.id}`, userData);
            if (response.status === 200) {
                await updateUserData(user.id);
                setMessage({ type: 'success', text: 'Profile updated successfully' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        }
    };

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8081/api/users/${user.id}/password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (response.status === 200) {
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setMessage({ type: 'success', text: 'Password updated successfully' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update password' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {message && (
                <Alert className={`mb-4 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                    {message.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Profile Picture</h2>
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

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                <form onSubmit={updateUserInfo} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleUserDataChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleUserDataChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleUserDataChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    >
                        Update Profile
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                <form onSubmit={updatePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePageComponent;