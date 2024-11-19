"use client"

import { Card, CardHeader, CardTitle } from '../ui/card';
import { PenTool, Briefcase, Building2, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {
    DndContext, closestCenter, KeyboardSensor,
    PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext,
    sortableKeyboardCoordinates, rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableCard } from '@/app/components/sortable/SortableCard';
import { Button } from '../ui/button';

const getIconForItem = (id: string) => {
    switch(id) {
        case '1': return <Building2 className="w-12 h-12 mb-4 text-purple-600" />;
        case '2': return <PenTool className="w-12 h-12 mb-4 text-purple-600" />;
        case '3': return <Briefcase className="w-12 h-12 mb-4 text-purple-600" />;
        case '4':
        case '5': return <FileSpreadsheet className="w-12 h-12 mb-4 text-purple-600" />;
        default: return null;
    }
};

const defaultItems = [
    {
        id: '1',
        title: "Add & Edit Industry to the System",
        href: "/addindustry",
        description: "Define new industry sectors"
    },
    {
        id: '2',
        title: "Add & Edit Skill to the System",
        href: "/addskill",
        description: "Add and manage skills in various industries"
    },
    {
        id: '3',
        title: "Add & Edit Profession to the System",
        href: "/addprofession",
        description: "Create and update professional roles"
    },
    {
        id: '4',
        title: "Survey Management System",
        href: "/surveymanagement",
        description: "Create/Edit surveys"
    },
    {
        id: '5',
        title: "Authorization System",
        href: "/authorization-system",
        description: "Manage user permissions"
    }
];

function AdminPanelDeneme() {
    const [isLoading, setIsLoading] = useState(true);

    const [isEditMode, setIsEditMode] = useState(false);
    const [items, setItems] = useState(defaultItems.map(item => ({
        ...item,
        icon: getIconForItem(item.id)
    })));
    useEffect(() => {
        const savedLayout = localStorage.getItem('cardLayout');
        if (savedLayout) {
            const parsed = JSON.parse(savedLayout);
            setItems(parsed.map((item: any) => ({
                ...item,
                icon: getIconForItem(item.id)
            })));
        } else {
            setItems(defaultItems.map(item => ({
                ...item,
                icon: getIconForItem(item.id)
            })));
        }
        setIsLoading(false);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
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
    };
    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Admin Control Panel
                    </h1>
                    <p className="mt-4 text-gray-600">
                        Manage your system components and configurations
                    </p>
                </div>

                {isEditMode ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 justify-items-center">
                                {items.map((card) => (
                                    <SortableCard key={card.id} id={card.id} card={card}/>
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 justify-items-center">
                        {items.map((card) => (
                            <Link href={card.href} key={card.id}
                                  className="relative group hover:z-10 transition-all duration-300">
                                <Card className="h-72 w-64 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer bg-white/90 backdrop-blur-sm border-purple-100">
                                    <div className="p-6 flex flex-col items-center text-center h-full">
                                        <div className="w-12 h-12 mb-4">
                                            {card.icon}
                                        </div>
                                        <CardHeader className="p-0">
                                            <CardTitle className="text-xl font-semibold text-purple-700">
                                                {card.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <p className="mt-4 text-gray-600 text-sm">
                                            {card.description}
                                        </p>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-12 flex justify-center gap-4">
                    <Button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={`${isEditMode ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                        {isEditMode ? "Cancel Edit" : "Edit The Formation"}
                    </Button>
                    {isEditMode && (
                        <Button
                            onClick={saveLayout}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Save Layout
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminPanelDeneme;