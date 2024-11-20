"use client"

import { Card, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';
import React from 'react';
import {
    DndContext, closestCenter, KeyboardSensor,
    PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext,
    sortableKeyboardCoordinates, rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableCard } from '@/app/components/sortable/SortableCard';
import { Button as MuiButton } from '@mui/material';

interface AdminPanelDenemeProps {
    backgroundColors: {
        from: string;
        to: string;
    };
    themeColors: {
        primary: string;
        contentColor: string;
    };
    isEditMode: boolean;
    items: any[];
    updateItems: (newItems: any[]) => void;
    saveLayout: () => void;
}

function AdminPanelDeneme({
                              backgroundColors,
                              themeColors,
                              isEditMode,
                              items,
                              updateItems,
                              saveLayout
                          }: AdminPanelDenemeProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            const newItems = arrayMove([...items], oldIndex, newIndex);
            updateItems(newItems);
        }
    };

    return (
        <div
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
            style={{
                background: `linear-gradient(to bottom right, ${backgroundColors.from}, ${backgroundColors.to})`
            }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1
                        className="text-4xl font-bold"
                        style={{color: themeColors.contentColor}}
                    >
                        Admin Control Panel
                    </h1>
                    <p
                        className="mt-4"
                        style={{color: themeColors.contentColor}}
                    >
                        Manage your system components and configurations
                    </p>
                </div>

                {isEditMode ? (
                    <>
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

                        <div className="mt-8 flex justify-center">
                            <MuiButton
                                variant="contained"
                                onClick={saveLayout}
                                sx={{
                                backgroundColor: themeColors.primary,
                                '&:hover': {
                                    backgroundColor: themeColors.primary,
                                    opacity: 0.9
                                }
                            }}
                                >
                                Save Layout
                        </MuiButton>
                        </div>
                    </>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 justify-items-center">
                        {items.map((card) => (
                            <Link href={card.href} key={card.id}
                                className="relative group hover:z-10 transition-all duration-300">
                                <div
                                    className="h-72 w-64 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer bg-white/90 backdrop-blur-sm rounded-lg"
                                    style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: themeColors.primary }}
                                >
                                    <Card className="border-0 h-full">
                                        <div className="p-6 flex flex-col items-center text-center h-full">
                                            <div className="w-12 h-12 mb-4">
                                                {card.icon}
                                            </div>
                                            <CardHeader className="p-0">
                                                <div
                                                    className="text-xl font-semibold"
                                                    style={{color: themeColors.contentColor}}
                                                >
                                                    {card.title}
                                                </div>
                                            </CardHeader>
                                            <div
                                                className="mt-4 text-sm"
                                                style={{color: themeColors.contentColor}}
                                            >
                                                {card.description}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPanelDeneme;
