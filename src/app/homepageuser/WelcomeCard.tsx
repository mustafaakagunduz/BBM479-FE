'use client';


// app/homepageuser/WelcomeCard.tsx
import React from 'react';
import Link from 'next/link';

const WelcomeCard: React.FC = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 flex items-start justify-center pt-24"> {/* items-center yerine items-start ve pt-24 eklendi */}
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-12 space-y-12">
                <div className="space-y-6">
                    <h1 className="text-5xl font-bold text-purple-600 text-center">
                        Welcome to DX-HRSAM Skills Assessment
                    </h1>
                    <h2 className="text-2xl text-gray-600 text-center">
                        Digital Transformation Human Resource Skills Assessment Model
                    </h2>
                </div>

                <div className="space-y-8">
                    <p className="text-xl text-gray-700 text-center leading-relaxed">
                        Welcome to our comprehensive skills assessment platform. This survey will help evaluate your
                        current skill set in the context of digital transformation and emerging technologies.
                    </p>

                    <p className="text-xl text-gray-700 text-center leading-relaxed">
                        By completing this assessment, you'll receive insights about your competencies and discover
                        potential career paths aligned with your abilities in the digital transformation era.
                    </p>
                </div>

                <div className="flex justify-center pt-8">
                    <Link href="/applysurvey">
                        <button className="px-12 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white
                                       rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105
                                       transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
                            View the Surveys →
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WelcomeCard;