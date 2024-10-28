import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import React, { useEffect, useState } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// Type definitions
type SkillRequirement = {
  level: number;
  weight: number;
};

type ProfessionSkills = {
  requiredSkills: {
    [skill: string]: SkillRequirement;
  };
};

type SkillMatrix = {
  [profession: string]: ProfessionSkills;
};

type Answer = {
  skill: string;
  level: number;
};

// Mock profession-skill matrix
const skillMatrix: SkillMatrix = {
  "Data Scientist": {
    requiredSkills: {
      "Analytical Thinking": { level: 5, weight: 1 },
      "Critical Thinking": { level: 4, weight: 1 },
      "Change Management": { level: 3, weight: 1 },
    }
  },
  "Digital Forensics Analyst": {
    requiredSkills: {
      "Analytical Thinking": { level: 4, weight: 1 },
      "Critical Thinking": { level: 5, weight: 1 },
      "Change Management": { level: 2, weight: 1 },
    }
  },
  "Database Architect": {
    requiredSkills: {
      "Analytical Thinking": { level: 3, weight: 1 },
      "Critical Thinking": { level: 4, weight: 1 },
      "Change Management": { level: 4, weight: 1 },
    }
  }
};

// Mock survey answers
const mockAnswers: Answer[] = [
  { skill: "Analytical Thinking", level: 4 },
  { skill: "Critical Thinking", level: 5 },
  { skill: "Change Management", level: 3 },
];

const calculateProfessionScore = (answers: Answer[], profession: string): number => {
  const professionSkills = skillMatrix[profession]?.requiredSkills;
  if (!professionSkills) return 0;

  let totalScore = 0;
  let totalWeight = 0;

  Object.entries(professionSkills).forEach(([skill, requirement]) => {
    const answer = answers.find(a => a.skill === skill);
    if (answer) {
      const skillScore = (answer.level / requirement.level) * 100;
      const cappedScore = Math.min(skillScore, 100);
      totalScore += cappedScore * requirement.weight;
      totalWeight += requirement.weight;
    }
  });

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-900">
          {`${payload[0].payload.profession}`}
        </p>
        <p className="text-sm text-gray-600">
          {`Uygunluk: ${payload[0].value}%`}
        </p>
      </div>
    );
  }
  return null;
};

const SurveyResult: React.FC<{ answers?: Answer[] }> = ({ answers = mockAnswers }) => {
  const [scores, setScores] = useState<{ profession: string; score: number }[]>([]);

  useEffect(() => {
    const calculatedScores = Object.keys(skillMatrix).map(profession => ({
      profession,
      score: calculateProfessionScore(answers, profession)
    }));
    setScores(calculatedScores);
  }, [answers]);

  // Format data for the radar chart
  const chartData = scores.map(({ profession, score }) => ({
    profession,
    value: score,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Meslek Uygunluk Analizi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                  <PolarGrid gridType="polygon" />
                  <PolarAngleAxis
                    dataKey="profession"
                    tick={{ fill: '#666', fontSize: 12 }}
                    tickLine={false}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#666' }}
                    tickCount={6}
                  />
                  <Radar
                    name="Uygunluk"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scores.map(({ profession, score }) => (
                <Card key={profession} className="bg-white/50">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800">{profession}</h3>
                    <div className="mt-2 flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-600">{score}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SurveyResult;