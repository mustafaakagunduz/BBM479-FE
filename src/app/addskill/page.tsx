"use client"

import AddSkill from "@/app/addskill/AddSkill";
import NavbarAdmin from "@/app/components/navbars/NavbarAdmin";
import AdminGuard from "@/app/components/guards/AdminGuard";

function AddSkillPage() {
    return (
        <>
        <AdminGuard>
          <AddSkill></AddSkill>
        </AdminGuard>
        </>
    );
}

export default AddSkillPage;
