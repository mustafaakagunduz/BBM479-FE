import { Card } from "@/app/components/ui/card";
import SurveySpiderChart from "@/app/components/charts/SurveySpiderChart";

export default function SpiderChartDemo() {
    // Dummy data with various professions
    const dummyProfessionMatches = [
        {
            id: 1,
            professionId: 1,
            professionName: "Software Engineer",
            matchPercentage: 85.5
        },
        {
            id: 2,
            professionId: 2,
            professionName: "Data Scientist",
            matchPercentage: 78.3
        },
        {
            id: 3,
            professionId: 3,
            professionName: "UI/UX Designer",
            matchPercentage: 92.1
        },
        {
            id: 4,
            professionId: 4,
            professionName: "Product Manager",
            matchPercentage: 67.8
        },
        {
            id: 5,
            professionId: 5,
            professionName: "DevOps Engineer",
            matchPercentage: 72.4
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
            <Card className="max-w-4xl mx-auto">
                <div className="p-6">
                    <SurveySpiderChart professionMatches={dummyProfessionMatches} />
                </div>
            </Card>
        </div>
    );
}