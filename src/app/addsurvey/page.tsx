"use client"


import SurveyBuilder from "@/app/addsurvey/SurveyBuilder";
import NavbarAdmin from "@/app/components/navbars/NavbarAdmin";
import SurveyBuilder2 from "@/app/addsurvey/SurveyBuilder";
import AdminGuard from "@/app/components/guards/AdminGuard";
function SurveyBuilderPage() {
    return (
        <>
            <AdminGuard>
            <SurveyBuilder></SurveyBuilder>
        </AdminGuard>

        </>
    );
}

export default SurveyBuilderPage;
