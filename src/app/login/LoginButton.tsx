import React from 'react';

const LoginButton = ({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) => {
    return (
        <button
            type="submit"
            disabled={isLoading}
            className="relative w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium
        transition-all duration-300
        hover:shadow-[0_0_25px_rgba(147,51,234,0.8)]
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2"
        >
            {children}
        </button>
    );
};

export default LoginButton;