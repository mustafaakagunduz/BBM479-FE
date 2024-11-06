'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const WelcomeCard = () => {
    return (
        <Card className="max-w-4xl mx-auto mt-16">
            <CardHeader className="py-8">
                <CardTitle className="text-center text-3xl lg:text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Welcome to DX-HRSAM Skills Assessment
                </CardTitle>
                <p className="text-center text-lg text-gray-600 mt-4">
                    Digital Transformation Human Resource Skills Assessment Model
                </p>
            </CardHeader>
            <CardContent className="text-center space-y-6 px-8 lg:px-16">
                <p className="text-gray-600 text-lg">
                    Welcome to our comprehensive skills assessment platform. This survey will help evaluate your current skill set in the context of digital transformation and emerging technologies.
                </p>
                <p className="text-gray-600 text-lg">
                    By completing this assessment, you'll receive insights about your competencies and discover potential career paths aligned with your abilities in the digital transformation era.
                </p>
            </CardContent>
            <CardFooter className="flex justify-center py-8">
                <Link href="/applysurvey">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-200 py-6 px-8 text-lg">
                        View the Surveys
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default WelcomeCard;