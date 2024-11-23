// app/addindustry/page.tsx
"use client";
import AddIndustry from "@/app/addindustry/AddIndustry";
import AdminGuard from "@/app/components/guards/AdminGuard";

function AddIndustryPage() {
    return (
        <AdminGuard>
            <AddIndustry />
        </AdminGuard>
    );
}

export default AddIndustryPage;