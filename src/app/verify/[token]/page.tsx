'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function VerifyEmail({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [status, setStatus] = useState('Verifying your email...');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/auth/verify/${params.token}`);
        
        if (response.data.success) {
          setStatus('Email verified successfully! Redirecting to login...');
          setTimeout(() => router.push('/login'), 3000);
        } else {
          setError('Verification failed. Please try again.');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || 'Verification failed');
        } else {
          setError('An unexpected error occurred');
        }
      }
    };

    verifyEmail();
  }, [params.token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {!error ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>{status}</p>
            </div>
          ) : (
            <p className="text-red-500">{error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}