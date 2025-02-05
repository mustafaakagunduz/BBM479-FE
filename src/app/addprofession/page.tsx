"use client"


import AddProfession2 from "@/app/addprofession/AddProfessionYeni";
import AdminGuard from "@/app/components/guards/AdminGuard";

function AddProfessionPage() {
    return (
        <>
            <AdminGuard>
          <AddProfession2></AddProfession2>
            </AdminGuard>

        </>
    );
}

export default AddProfessionPage;
