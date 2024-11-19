import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle } from '../ui/card';
import {useState} from "react";

interface CardProps {
    id: string;
    card: {
        id: string;
        title: string;
        description: string;
        href: string;
        icon: JSX.Element | null;  // null ekledik
    };
}


export function SortableCard({ id, card }: CardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };


    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="h-72 w-64 transform transition-all duration-300 hover:shadow-xl cursor-move bg-white/90 backdrop-blur-sm border-purple-100">
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
        </div>
    );
}

export default SortableCard;