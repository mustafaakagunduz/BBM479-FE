"use client"


import AddProfession from "@/app/addprofession/AddProfession";
import NavbarAdmin from "@/app/components/navbars/NavbarAdmin";
import AdminGuard from "@/app/components/guards/AdminGuard";

function AddProfessionPage() {
    return (
        <>
            <AdminGuard>
          <AddProfession></AddProfession>
            </AdminGuard>

        </>
    );
}

export default AddProfessionPage;
