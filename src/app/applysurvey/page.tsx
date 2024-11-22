// app/applysurvey/page.tsx
'use client';
import React from "react";
import {UserSurveyList} from "@/app/applysurvey/UserSurveyList";

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">

            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Available Surveys
                </h1>
                <UserSurveyList/>
            </div>
        </div>
    );
};

export default Home;