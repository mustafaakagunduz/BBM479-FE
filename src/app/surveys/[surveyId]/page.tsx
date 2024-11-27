// app/surveys/[surveyId]/SpiderChart.tsx
'use client';

import { SurveyDetail } from "../components/SurveyDetail";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/navbar/Navbar";

export default function SurveyDetailPage() {
    const params = useParams();
    const surveyId = params.surveyId as string;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-black" >

            <div className="container mx-auto px-4 py-8">
                <SurveyDetail surveyId={Number(surveyId)} />
            </div>
        </div>
    );
}