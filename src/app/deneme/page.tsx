'use client';
import React, { useState, useLayoutEffect } from "react";
import NavbarAdminDeneme from "@/app/components/navbars/NavbarAdminDeneme";
import AdminPanelDeneme from "@/app/components/adminpanel/AdminPanelDeneme";
import { PenTool, Briefcase, Building2, FileSpreadsheet } from 'lucide-react';

const defaultThemeColor = '#9333EA';

const getIconForItem = (id: string, color: string) => {
    switch(id) {
        case '1': return <Building2 className="w-12 h-12 mb-4" style={{ color }} />;
        case '2': return <PenTool className="w-12 h-12 mb-4" style={{ color }} />;
        case '3': return <Briefcase className="w-12 h-12 mb-4" style={{ color }} />;
        case '4':
        case '5': return <FileSpreadsheet className="w-12 h-12 mb-4" style={{ color }} />;
        default: return null;
    }
};

const defaultItems = [
    {
        id: '1',
        title: "Add & Edit Industry to the System",
        href: "/addindustry",
        description: "Define new industry sectors",
        icon: getIconForItem('1', defaultThemeColor)
    },
    {
        id: '2',
        title: "Add & Edit Skill to the System",
        href: "/addskill",
        description: "Add and manage skills in various industries",
        icon: getIconForItem('2', defaultThemeColor)
    },
    {
        id: '3',
        title: "Add & Edit Profession to the System",
        href: "/addprofession",
        description: "Create and update professional roles",
        icon: getIconForItem('3', defaultThemeColor)
    },
    {
        id: '4',
        title: "Survey Management System",
        href: "/surveymanagement",
        description: "Create/Edit surveys",
        icon: getIconForItem('4', defaultThemeColor)
    },
    {
        id: '5',
        title: "Authorization System",
        href: "/authorization-system",
        description: "Manage user permissions",
        icon: getIconForItem('5', defaultThemeColor)
    }
];

const defaultColors = {
    navbar: defaultThemeColor,
    background: {
        from: '#FAF5FF',
        to: '#EFF6FF'
    },
    theme: {
        primary: defaultThemeColor,    // navbar rengi için
        contentColor: '#6D28D9'        // tüm metin ve ikonlar için
    }
};

type ColorChangeType =
    | 'themePrimary'
    | 'themeContent'
    | 'backgroundFrom'
    | 'backgroundTo';

interface Colors {
    navbar: string;
    background: {
        from: string;
        to: string;
    };
    theme: {
        primary: string;
        contentColor: string;
    };
}

const Home: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [colors, setColors] = useState(defaultColors);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [items, setItems] = useState(defaultItems);

    useLayoutEffect(() => {
        try {
            const savedColors = localStorage.getItem('themeColors');
            if (savedColors) {
                const parsedColors = JSON.parse(savedColors);
                const mergedColors = {
                    ...defaultColors,
                    ...parsedColors,
                    theme: {
                        ...defaultColors.theme,
                        ...(parsedColors.theme || {})
                    }
                };
                setColors(mergedColors);
                updateItemIcons(mergedColors.theme.contentColor);

                const savedLayout = localStorage.getItem('cardLayout');
                if (savedLayout) {
                    const parsedLayout = JSON.parse(savedLayout);
                    setItems(parsedLayout.map((item: any) => ({
                        ...item,
                        icon: getIconForItem(item.id, mergedColors.theme.contentColor)
                    })));
                }
            }
        } catch (error) {
            console.error('Error loading saved settings:', error);
            setColors(defaultColors);
            updateItemIcons(defaultColors.theme.contentColor);
        }
        setIsLoaded(true);
    }, []);

    const updateItemIcons = (color: string) => {
        setItems(prevItems => prevItems.map(item => ({
            ...item,
            icon: getIconForItem(item.id, color)
        })));
    };

    const handleColorChange = (type: ColorChangeType, color: string) => {
        const newColors: Colors = { ...colors };

        switch(type) {
            case 'themePrimary':
                newColors.navbar = color;
                newColors.theme.primary = color;
                break;
            case 'themeContent':
                newColors.theme.contentColor = color;
                updateItemIcons(color); // İkonları content color ile güncelle
                break;
            case 'backgroundFrom':
                newColors.background.from = color;
                break;
            case 'backgroundTo':
                newColors.background.to = color;
                break;
        }

        setColors(newColors);
        localStorage.setItem('themeColors', JSON.stringify(newColors));
    };

    const resetColors = () => {
        const defaultContentColor = defaultColors.theme.contentColor;
        setColors(defaultColors);
        localStorage.setItem('themeColors', JSON.stringify(defaultColors));
        updateItemIcons(defaultContentColor); // Reset yaparken de content color kullan
    };

    const saveLayout = () => {
        const cleanItems = items.map(item => ({
            id: item.id,
            title: item.title,
            href: item.href,
            description: item.description
        }));
        localStorage.setItem('cardLayout', JSON.stringify(cleanItems));
        setIsEditMode(false);
        setIsSettingsOpen(false);
    };

    const updateItems = (newItems: typeof items) => {
        setItems(newItems.map(item => ({
            ...item,
            icon: getIconForItem(item.id, colors.theme.primary)
        })));
    };

    if (!isLoaded) return null;

    return (
        <div>
            <NavbarAdminDeneme
                colors={colors}
                isSettingsOpen={isSettingsOpen}
                setIsSettingsOpen={setIsSettingsOpen}
                isColorPickerOpen={isColorPickerOpen}
                setIsColorPickerOpen={setIsColorPickerOpen}
                handleColorChange={handleColorChange}
                resetColors={resetColors}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
                saveLayout={saveLayout}
            />
            <AdminPanelDeneme
                backgroundColors={colors.background}
                themeColors={colors.theme}
                isEditMode={isEditMode}
                items={items}
                updateItems={updateItems}
                saveLayout={saveLayout}
            />
        </div>
    );
};

export default Home;