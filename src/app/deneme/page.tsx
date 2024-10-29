'use client'
import React from "react";
import HomePage from "@/app/components/user/HomePage";
import MakeSurvey from "@/app/components/user/MakeSurvey";
import SurveyResult from "@/app/components/user/SurveyResult";



const Deneme: React.FC = () => {


    return (
        <div>
            BURAYA DENEMESİNİ YAPACAĞIMIZ COMPONENTLERİ KOY.
            HAZIR OLUNCA COMPONENTS KLASÖRÜNE EKLE..
            <HomePage></HomePage>
            <MakeSurvey></MakeSurvey>
            <SurveyResult></SurveyResult>

        </div>
    );
};

export default Deneme;