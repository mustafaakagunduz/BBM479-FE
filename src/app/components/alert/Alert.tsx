// app/components/ui/alert.tsx
'use client';

import React, { ReactNode } from 'react';

interface AlertProps {
    children: ReactNode;
    className?: string;
}

export const Alert: React.FC<AlertProps> = ({ children, className = '' }) => (
    <div className={`p-4 rounded-lg border ${className}`} role="alert">
        {children}
    </div>
);

export const AlertTitle: React.FC<AlertProps> = ({ children, className = '' }) => (
    <h5 className={`font-medium mb-1 flex items-center gap-2 ${className}`}>
        {children}
    </h5>
);

export const AlertDescription: React.FC<AlertProps> = ({ children, className = '' }) => (
    <div className={className}>{children}</div>
);