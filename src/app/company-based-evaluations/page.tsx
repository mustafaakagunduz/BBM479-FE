"use client";

import AdminGuard from "@/app/components/guards/AdminGuard";
import CompanyBasedEvaluationsComponent from "@/app/company-based-evaluations/CompanyBasedEvaluations";

function CompanyBasedEvaluationsPage() {
    return (
        <AdminGuard>
            <CompanyBasedEvaluationsComponent>

            </CompanyBasedEvaluationsComponent>
        </AdminGuard>
    );
}

export default CompanyBasedEvaluationsPage;