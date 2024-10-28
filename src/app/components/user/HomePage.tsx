import React from 'react';
import Link from 'next/link';

interface Survey {
  id: number;
  title: string;
  description: string;
}

interface UserProfile {
  name: string;
  profilePictureUrl: string;
}

// Mock survey data
const surveys: Survey[] = [
  { id: 1, title: 'Survey 1', description: 'This is the description for survey 1.' },
  { id: 2, title: 'Survey 2', description: 'This is the description for survey 2.' },
  { id: 3, title: 'Survey 3', description: 'This is the description for survey 3.' },
];

// Mock user data
const userProfile: UserProfile = {
  name: 'John Doe',
  profilePictureUrl: 'https://via.placeholder.com/40',
};

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <h1 className="text-2xl font-bold mb-4">Available Surveys</h1>
      
      <div className="grid gap-4">
        {surveys.map((survey) => (
          <div key={survey.id} className="p-4 bg-white shadow rounded-md">
            <h2 className="text-xl font-semibold">{survey.title}</h2>
            <p className="text-gray-600">{survey.description}</p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 flex items-center space-x-3">
        <Link href="/profile" className="flex items-center space-x-3">
          <img
            src={userProfile.profilePictureUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-lg font-medium text-gray-800">{userProfile.name}</span>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
