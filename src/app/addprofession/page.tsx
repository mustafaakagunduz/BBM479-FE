"use client"


import AddProfession from "@/app/addprofession/AddProfession";
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
