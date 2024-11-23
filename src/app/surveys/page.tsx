// app/surveys/page.tsx
"use client"

import NavbarAdmin from "@/app/components/navbars/NavbarAdmin";
import { SurveyList } from "./components/SurveyList";
import AddProfession from "@/app/addprofession/AddProfession";
import AdminGuard from "@/app/components/guards/AdminGuard";  // Import yolunu düzelttik

function SurveyPage() {
    return (
        <>
            <AdminGuard>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    Available Surveys
                </h1>
                <SurveyList />
            </div>
        </div>
            </AdminGuard>
        </>
    );
}

export default SurveyPage;