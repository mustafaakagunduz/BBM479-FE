// NavbarAdminDeneme.tsx
"use client"

import Link from 'next/link';
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button as MuiButton, TextField, Divider } from '@mui/material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MuiColorInput } from 'mui-color-input';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

type ColorChangeType =
    | 'themePrimary'
    | 'themeContent'
    | 'backgroundFrom'
    | 'backgroundTo';

interface NavbarAdminDenemeProps {
    colors: {
        navbar: string;
        background: {
            from: string;
            to: string;
        };
        theme: {
            primary: string;
            contentColor: string;
        };
    };
    isSettingsOpen: boolean;
    setIsSettingsOpen: (open: boolean) => void;
    isColorPickerOpen: boolean;
    setIsColorPickerOpen: (open: boolean) => void;
    handleColorChange: (type: ColorChangeType, color: string) => void;
    resetColors: () => void;
    isEditMode: boolean;
    setIsEditMode: (mode: boolean) => void;
    saveLayout: () => void;
}

const NavbarAdminDeneme: React.FC<NavbarAdminDenemeProps> = ({
                                                                 colors,
                                                                 isSettingsOpen,
                                                                 setIsSettingsOpen,
                                                                 isColorPickerOpen,
                                                                 setIsColorPickerOpen,
                                                                 handleColorChange,
                                                                 resetColors,
                                                                 isEditMode,
                                                                 setIsEditMode,
                                                                 saveLayout
                                                             }) => {
    // State for hex inputs
    const [hexInputs, setHexInputs] = useState({
        navbar: colors.navbar,
        backgroundFrom: colors.background.from,
        backgroundTo: colors.background.to,
        themePrimary: colors.theme.primary,
        themeContent: colors.theme.contentColor
    });

    const [hexErrors, setHexErrors] = useState({
        navbar: false,
        backgroundFrom: false,
        backgroundTo: false,
        themePrimary: false,
        themeContent: false
    });

    const handleHexChange = (field: keyof typeof hexInputs, value: string) => {
        let hexValue = value.startsWith('#') ? value : `#${value}`;
        setHexInputs(prev => ({ ...prev, [field]: hexValue }));

        const isValid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexValue);

        if (isValid) {
            setHexErrors(prev => ({ ...prev, [field]: false }));
            handleColorChange(field as any, hexValue);
        } else {
            setHexErrors(prev => ({ ...prev, [field]: true }));
        }
    };

    const resetHexInputs = () => {
        setHexInputs({
            navbar: colors.navbar,
            backgroundFrom: colors.background.from,
            backgroundTo: colors.background.to,
            themePrimary: colors.theme.primary,
            themeContent: colors.theme.contentColor
        });
        setHexErrors({
            navbar: false,
            backgroundFrom: false,
            backgroundTo: false,
            themePrimary: false,
            themeContent: false
        });
    };


return (
    <>
        <nav style={{ backgroundColor: colors.theme.primary }} className="shadow-md p-4 w-full">
            <div className="flex items-center justify-between max-w-screen-xl mx-auto">
                <Link href="/homepageadmin" className="text-xl font-bold text-white hover:text-opacity-80">
                    DX-HRSAM
                </Link>

                <div className="flex-grow text-center space-x-4">
                    <Link href="/homepageadmin">
                        <button
                            style={{ color: colors.theme.primary }}
                            className="px-4 py-2 rounded-lg bg-white hover:bg-opacity-90 transition"
                        >
                            Admin Panel
                        </button>
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="text-white hover:text-opacity-80 transition"
                    >
                        <Settings className="w-6 h-6" />
                    </button>
                    <Link href="/login">
                        <button className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white/10 transition">
                            Logout
                        </button>
                    </Link>
                </div>
            </div>
        </nav>

        <Modal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
            <Box sx={modalStyle}>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" sx={{ color: '#000000' }}>
                        Settings
                    </Typography>
                    <IconButton onClick={() => setIsSettingsOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </div>

                <div className="space-y-4">
                    <MuiButton
                        variant="contained"
                        onClick={() => {
                            setIsColorPickerOpen(true);
                            setIsSettingsOpen(false);
                            resetHexInputs();
                        }}
                        fullWidth
                        sx={{
                            backgroundColor: colors.theme.primary,
                            '&:hover': {
                                backgroundColor: colors.theme.primary,
                                opacity: 0.9
                            }
                        }}
                    >
                        Customize Colors
                    </MuiButton>

                    <Divider />

                    <div>
                        <Typography variant="subtitle1" sx={{ color: '#000000', mb: 2 }}>
                            Layout Settings
                        </Typography>

                        <MuiButton
                            variant="contained"
                            onClick={() => {
                                setIsEditMode(!isEditMode);
                                setIsSettingsOpen(false);
                            }}
                            fullWidth
                            sx={{
                                backgroundColor: isEditMode ? '#DC2626' : colors.theme.primary,
                                '&:hover': {
                                    backgroundColor: isEditMode ? '#B91C1C' : colors.theme.primary,
                                    opacity: 0.9
                                },
                                mb: 2
                            }}
                        >
                            {isEditMode ? "Cancel Edit Mode" : "Edit Layout"}
                        </MuiButton>

                        {isEditMode && (
                            <MuiButton
                                variant="contained"
                                onClick={() => {
                                    saveLayout();
                                    setIsSettingsOpen(false);
                                }}
                                fullWidth
                                sx={{
                                    backgroundColor: '#16A34A',
                                    '&:hover': {
                                        backgroundColor: '#15803D',
                                    }
                                }}
                            >
                                Save Layout
                            </MuiButton>
                        )}
                    </div>
                </div>
            </Box>
        </Modal>

        <Modal open={isColorPickerOpen} onClose={() => setIsColorPickerOpen(false)}>
            <Box sx={modalStyle}>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" sx={{ color: '#000000' }}>
                        Customize Colors
                    </Typography>
                    <IconButton onClick={() => setIsColorPickerOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </div>

                <div className="space-y-6">
                    {/* Navbar Color */}
                    <div className="space-y-2">
                        <Typography variant="subtitle1" sx={{ color: '#000000', fontWeight: 'bold' }}>
                            Navbar Color
                        </Typography>
                        <div className="space-y-4">
                            <div>
                                <Typography variant="subtitle2" gutterBottom sx={{ color: '#000000' }}>
                                    Primary Color
                                </Typography>
                                <div className="flex gap-4">
                                    <MuiColorInput
                                        value={colors.theme.primary}
                                        onChange={(color) => {
                                            handleColorChange('themePrimary', color);
                                            setHexInputs(prev => ({ ...prev, themePrimary: color }));
                                        }}
                                        sx={{ flex: 1 }}
                                    />
                                    <TextField
                                        value={hexInputs.themePrimary.replace('#', '')}
                                        onChange={(e) => handleHexChange('themePrimary', e.target.value)}
                                        error={hexErrors.themePrimary}
                                        helperText={hexErrors.themePrimary ? 'Invalid hex' : ''}
                                        placeholder="Hex code"
                                        size="small"
                                        sx={{ width: '100px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Color */}
                    <div className="space-y-2">
                        <Typography variant="subtitle1" sx={{ color: '#000000', fontWeight: 'bold' }}>
                            Content Color
                        </Typography>
                        <div className="flex gap-4">
                            <MuiColorInput
                                value={colors.theme.contentColor}
                                onChange={(color) => {
                                    handleColorChange('themeContent', color);
                                    setHexInputs(prev => ({ ...prev, themeContent: color }));
                                }}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                value={hexInputs.themeContent?.replace('#', '') || ''}
                                onChange={(e) => handleHexChange('themeContent', e.target.value)}
                                error={hexErrors.themeContent}
                                helperText={hexErrors.themeContent ? 'Invalid hex' : ''}
                                placeholder="Hex code"
                                size="small"
                                sx={{ width: '100px' }}
                            />
                        </div>
                    </div>

                    {/* Background Colors */}
                    <div className="space-y-2">
                        <Typography variant="subtitle1" sx={{ color: '#000000', fontWeight: 'bold' }}>
                            Background Colors
                        </Typography>
                        <div className="space-y-4">
                            <div>
                                <Typography variant="subtitle2" gutterBottom sx={{ color: '#000000' }}>
                                    Starting Color
                                </Typography>
                                <div className="flex gap-4">
                                    <MuiColorInput
                                        value={colors.background.from}
                                        onChange={(color) => {
                                            handleColorChange('backgroundFrom', color);
                                            setHexInputs(prev => ({ ...prev, backgroundFrom: color }));
                                        }}
                                        sx={{ flex: 1 }}
                                    />
                                    <TextField
                                        value={hexInputs.backgroundFrom.replace('#', '')}
                                        onChange={(e) => handleHexChange('backgroundFrom', e.target.value)}
                                        error={hexErrors.backgroundFrom}
                                        helperText={hexErrors.backgroundFrom ? 'Invalid hex' : ''}
                                        placeholder="Hex code"
                                        size="small"
                                        sx={{ width: '100px' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <Typography variant="subtitle2" gutterBottom sx={{ color: '#000000' }}>
                                    Ending Color
                                </Typography>
                                <div className="flex gap-4">
                                    <MuiColorInput
                                        value={colors.background.to}
                                        onChange={(color) => {
                                            handleColorChange('backgroundTo', color);
                                            setHexInputs(prev => ({ ...prev, backgroundTo: color }));
                                        }}
                                        sx={{ flex: 1 }}
                                    />
                                    <TextField
                                        value={hexInputs.backgroundTo.replace('#', '')}
                                        onChange={(e) => handleHexChange('backgroundTo', e.target.value)}
                                        error={hexErrors.backgroundTo}
                                        helperText={hexErrors.backgroundTo ? 'Invalid hex' : ''}
                                        placeholder="Hex code"
                                        size="small"
                                        sx={{ width: '100px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <MuiButton
                        variant="outlined"
                        onClick={() => {
                            resetColors();
                            resetHexInputs();
                        }}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Reset All Colors
                    </MuiButton>
                </div>
            </Box>
        </Modal>
    </>
);

};

export default NavbarAdminDeneme;