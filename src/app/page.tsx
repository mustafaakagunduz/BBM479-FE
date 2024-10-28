// src/components/AdvancedComponent.tsx
'use client'; // Add this line to indicate it's a client component

import React from "react";
import { useState } from 'react';

import SurveyBuilder from './components/admin/SurveyBuilder';
import SurveyBuilder2 from "@/app/components/admin/SurveyBuilder2";
import AddSkill from "@/app/components/admin/AddSkill";
import AddProfession from "@/app/components/admin/AddProfession";
import LoginSignUp from "@/app/components/auth/LoginSignUp";

const AdvancedComponent = () => {
  return (
     <LoginSignUp />
  );
};

export default AdvancedComponent;
