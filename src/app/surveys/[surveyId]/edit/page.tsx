// surveys/[surveyId]/edit/page.tsx
'use client';

import NavbarAdmin from "@/app/components/navbars/NavbarAdmin";
import SurveyEditer from "@/app/surveys/components/SurveyEditer";
import { useParams } from "next/navigation";

export default function EditSurveyPage() {
    const params = useParams();
    const surveyId = params.surveyId as string;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <NavbarAdmin />
            <div className="container mx-auto px-4 py-8">
                <SurveyEditer surveyId={Number(surveyId)} mode="edit" />
            </div>
        </div>
    );
}