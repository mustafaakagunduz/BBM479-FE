"use client"

import SurveyQuestionsLoader from "@/app/loadsurvey/SurveyQuestionsLoader";
import AdminGuard from "@/app/components/guards/AdminGuard";

function LoadSurveyPage() {
    return (
        <>
            <AdminGuard>
                <SurveyQuestionsLoader />
            </AdminGuard>
        </>
    );
}

export default LoadSurveyPage;