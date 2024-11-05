// app/components/ui/button.tsx
'use client';
import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'default' | 'icon';
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  variant = 'primary',
                                                  size = 'default',
                                                  className = '',
                                                  ...props
                                              }) => {
    const baseStyles = "rounded-lg font-medium transition-all duration-200 flex items-center gap-2";
    const variants = {
        primary: "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 shadow-lg hover:shadow-xl",
        secondary: "bg-white text-violet-600 hover:bg-violet-50 border border-violet-200",
        ghost: "text-gray-600 hover:bg-gray-100"
    };

    const sizes = {
        default: "px-6 py-3",
        icon: "p-2"
    };

    const variantStyles = variants[variant] || variants.primary;
    const sizeStyles = sizes[size] || sizes.default;

    return (
        <button className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`} {...props}>
            {children}
        </button>
    );
};