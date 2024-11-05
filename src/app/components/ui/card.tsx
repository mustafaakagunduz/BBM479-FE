// app/components/ui/card.tsx
'use client';
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;  // onClick prop'unu ekledik
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => (
    <div
        className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl ${className}`}
        onClick={onClick}  // onClick'i div'e ekledik
    >
      {children}
    </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
    <h3 className={`text-xl font-semibold text-gray-800 ${className}`}>
      {children}
    </h3>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
);