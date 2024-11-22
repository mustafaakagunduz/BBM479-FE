// app/homepageuser/page.tsx
'use client';
import React from "react";
import WelcomeCard from "@/app/homepageuser/WelcomeCard";

const Home: React.FC = () => {
    return (
        <div className="flex-1 p-8"> {/* veya sadece <> </> da kullanabilirsiniz */}
            <WelcomeCard />
        </div>
    );
};

export default Home;