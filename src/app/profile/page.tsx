'use client';
import React from "react";
import ProfilePageComponent from "@/app/profile/ProfileComponent";
import {AuthProvider} from "@/app/context/AuthContext";

const ProfilePage: React.FC = () => {
    return (
        <div>
            <AuthProvider>
                <ProfilePageComponent></ProfilePageComponent>
            </AuthProvider>

        </div>
    );
};

export default ProfilePage;