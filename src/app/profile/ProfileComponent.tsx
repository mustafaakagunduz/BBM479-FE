'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import { AlertCircle, Check, Pencil } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Button,
    Typography,
    Box,
    Slider,
    Select,
    MenuItem,
    FormControl,
    SelectChangeEvent
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Cropper from 'react-easy-crop';

// Type Definitions
interface Point {
    x: number;
    y: number;
}

type SelectValue = string | number | null;

interface ProfileInputProps {
    label: string;
    name: string;
    value: string | SelectValue;
    onChange: (e: CustomChangeEvent) => void;
    type?: "text" | "email" | "select";
}

interface Area {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Company {
    id: number;
    name: string;
    description?: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    profileImage?: string;
    company?: {  // Bu kısmı daha önce tanımlamıştık ama AuthContext'teki User tipi ile uyumsuz
        id: number;
        name: string;
    };
}

interface UserUpdateData {
    name: string;
    email: string;
    username: string;
    companyId: number | null;
}

interface PasswordUpdate {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Custom event type for both input and select changes
type CustomChangeEvent = React.ChangeEvent<HTMLInputElement> | SelectChangeEvent;

interface ProfileInputProps {
    label: string;
    name: string;
    value: string | number | null;
    onChange: (e: CustomChangeEvent) => void;
    type?: "text" | "email" | "select";
}

const ProfilePageComponent: React.FC = () => {
    const { user, updateUserData } = useAuth();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1.5);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [companies, setCompanies] = useState<Company[]>([]);

    const [formData, setFormData] = useState<UserUpdateData>({
        name: '',
        email: '',
        username: '',
        companyId: null
    });

    const [passwordData, setPasswordData] = useState<PasswordUpdate>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    // Fetch companies when editing mode is activated
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/companies');
                setCompanies(response.data);
            } catch (error) {
                console.error('Error fetching companies:', error);
                setMessage({ type: 'error', text: 'Failed to load companies' });
            }
        };

        if (isEditing) {
            fetchCompanies();
        }
    }, [isEditing]);

    // Initial user data fetch
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (user?.id && isMounted) {
                try {
                    await updateUserData(user.id);
                } catch (error) {
                    console.error('Error updating user data:', error);
                }
            }
        };

        if (user?.id) {
            fetchData();
        }

        return () => {
            isMounted = false;
        };
    }, []);

    // Update form data when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                username: user.username || '',
                companyId: user.company?.id || null
            });
        }
    }, [user]);

    // Form handlers
    const handleUserDataChange = useCallback((e: CustomChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    // Image handling functions
    const handleEditPicture = useCallback(() => {
        if (user?.profileImage) {
            const imageUrl = `data:image/jpeg;base64,${user.profileImage}`;
            setOriginalImage(imageUrl);
            setPreviewImage(imageUrl);
            setShowCropper(true);
            setCrop({ x: 0, y: 0 });
            setZoom(1.5);
        }
    }, [user?.profileImage]);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', error => reject(error));
            image.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob as Blob);
            }, 'image/jpeg');
        });
    };

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'File size should not exceed 5MB' });
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                setOriginalImage(imageUrl);
                setPreviewImage(imageUrl);
                setShowCropper(true);
                setCrop({ x: 0, y: 0 });
                setZoom(1.5);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    // API calls
    const handleCropSave = async () => {
        if (originalImage && croppedAreaPixels) {
            try {
                const croppedImg = await getCroppedImg(originalImage, croppedAreaPixels);
                await uploadProfilePicture(croppedImg);
            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to crop image' });
            }
        }
    };

    const handleCropCancel = useCallback(() => {
        setShowCropper(false);
        setPreviewImage(null);
        setOriginalImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1.5);
    }, []);

    const uploadProfilePicture = async (file: Blob) => {
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
                setMessage({ type: 'success', text: 'Profile picture updated successfully' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to upload profile picture' });
        } finally {
            setSelectedFile(null);
            setPreviewImage(null);
            setOriginalImage(null);
            setShowCropper(false);
            setCrop({ x: 0, y: 0 });
            setZoom(1.5);
        }
    };

    const updateUserInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        try {
            const response = await axios.put(`http://localhost:8081/api/users/${user.id}`, formData);
            if (response.status === 200) {
                await updateUserData(user.id);
                setIsEditing(false);
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

    // ProfileInput component
    const ProfileInput: React.FC<ProfileInputProps> = useCallback(({ label, name, value, onChange, type = "text" }) => (
        <Box className="space-y-4">
            <Typography variant="subtitle1" className="font-medium">{label}</Typography>
            {isEditing ? (
                type === "select" ? (
                    <FormControl fullWidth>
                        <Select
                            name={name}
                            value={String(value ?? '')}
                            onChange={onChange}
                            className="w-full"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {companies.map((company) => (
                                <MenuItem key={company.id} value={company.id}>
                                    {company.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value?.toString() ?? ''}
                        onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        className="w-full p-2 border rounded"
                        autoComplete="off"
                    />
                )
            ) : (
                <Typography className="p-2">
                    {type === "select"
                        ? companies.find(c => c.id === value)?.name || "No Company"
                        : value?.toString()}
                </Typography>
            )}
        </Box>
    ), [isEditing, companies]);

    // JSX
    return (
        <Box className="max-w-4xl mx-auto p-6">
            {/* Alert Messages */}
            {message && (
                <Alert className={`mb-4 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                    {message.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            )}

            {/* Profile Picture Section */}
            <Box className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <Box className="flex justify-between items-center mb-6">
                    <Typography variant="h4">Profile Picture</Typography>
                    {!showCropper && user?.profileImage && (
                        <Button
                            onClick={handleEditPicture}
                            sx={{ minWidth: 'auto', padding: '8px' }}
                        >
                            <Pencil className="h-5 w-5" />
                        </Button>
                    )}
                </Box>

                <Box className="flex flex-col items-center space-y-4">
                    {showCropper ? (
                        <Box className="w-full relative mb-8">
                            <Box className="relative h-[400px] mb-4">
                                <Cropper
                                    image={originalImage || ''}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                    cropShape="round"
                                    showGrid={false}
                                    objectFit="contain"
                                    cropSize={{ width: 250, height: 250 }}
                                    style={{
                                        containerStyle: {
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            height: '100%',
                                            width: '100%'
                                        },
                                        cropAreaStyle: {
                                            border: '2px solid #fff',
                                            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                                        },
                                        mediaStyle: {
                                            height: '100%'
                                        }
                                    }}
                                />
                            </Box>
                            <Box className="flex flex-col gap-4">
                                <Box className="w-full px-4">
                                    <Typography variant="subtitle1" className="mb-2">Zoom</Typography>
                                    <Slider
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        onChange={(e, value) => setZoom(value as number)}
                                        sx={{
                                            '& .MuiSlider-track': { backgroundColor: '#9333ea' },
                                            '& .MuiSlider-thumb': { backgroundColor: '#9333ea' }
                                        }}
                                    />
                                </Box>
                                <Box className="flex justify-center gap-2">
                                    <Button
                                        variant="contained"
                                        onClick={handleCropSave}
                                        sx={{ backgroundColor: '#9333ea', '&:hover': { backgroundColor: '#7e22ce' } }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={handleCropCancel}
                                        sx={{ borderColor: '#9333ea', color: '#9333ea' }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <Box className="w-32 h-32 relative">
                                {user?.profileImage ? (
                                    <img
                                        src={`data:image/jpeg;base64,${user.profileImage}`}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <Box className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                        <Typography>No Image</Typography>
                                    </Box>
                                )}
                            </Box>
                            <Button
                                component="label"
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                                sx={{ backgroundColor: '#9333ea', '&:hover': { backgroundColor: '#7e22ce' } }}
                            >
                                Choose Photo
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </>
                    )}
                </Box>
            </Box>

            {/* Profile Information Section */}
            <Box className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <Box className="flex justify-between items-center mb-6">
                    <Typography variant="h4">My Profile</Typography>
                    {!isEditing && (
                        <Button
                            onClick={() => setIsEditing(true)}
                            sx={{ minWidth: 'auto', padding: '8px' }}
                        >
                            <Pencil className="h-5 w-5" />
                        </Button>
                    )}
                </Box>
                <form onSubmit={updateUserInfo} className="space-y-4">
                    <ProfileInput
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleUserDataChange}
                        type="text"
                    />
                    <ProfileInput
                        label="E-Mail"
                        name="email"
                        value={formData.email}
                        onChange={handleUserDataChange}
                        type="email"
                    />

                    <ProfileInput
                        label="Company"
                        name="companyId"
                        value={formData.companyId}
                        onChange={handleUserDataChange}
                        type="select"
                    />

                    {isEditing && (
                        <Box className="flex gap-2">
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ backgroundColor: '#9333ea', '&:hover': { backgroundColor: '#7e22ce' } }}
                            >
                                Update Profile
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => setIsEditing(false)}
                                sx={{ borderColor: '#9333ea', color: '#9333ea' }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                </form>
            </Box>

            {/* Password Change Section */}
            <Box className="bg-white rounded-lg shadow-lg p-6">
                <Typography variant="h4" className="mb-6">Change Password</Typography>
                <form onSubmit={updatePassword} className="space-y-4">
                    <Box className="space-y-4">
                        <Typography variant="subtitle1" className="font-medium">Current Password</Typography>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 border rounded"
                        />
                    </Box>
                    <Box className="space-y-4">
                        <Typography variant="subtitle1" className="font-medium">New Password</Typography>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 border rounded"
                        />
                    </Box>
                    <Box className="space-y-4">
                        <Typography variant="subtitle1" className="font-medium">Confirm New Password</Typography>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 border rounded"
                        />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ backgroundColor: '#9333ea', '&:hover': { backgroundColor: '#7e22ce' } }}
                    >
                        Update Password
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default ProfilePageComponent;