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
    // Güncel kod
    const verifyEmail = async () => {
      try {
        // İstek başlamadan önce loading state
        setStatus('Verifying your email...');
        console.log('Verification started for token:', params.token); // Debug log
    
        const response = await axios.get(`http://localhost:8081/api/auth/verify/${params.token}`);
        console.log('Verification response:', response.data); // Debug log
        
        if (response.data.success) {
          setStatus('Email verified successfully! Redirecting to login...');
          // Daha güvenli yönlendirme
          await new Promise(resolve => setTimeout(resolve, 2000));
          router.replace('/login'); // replace kullanarak tarayıcı geçmişini temizle
        } else {
          throw new Error(response.data.message || 'Verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error); // Debug log
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || 'Verification failed. Please try again.');
          // Hata durumunda da yönlendirme yap
          await new Promise(resolve => setTimeout(resolve, 3000));
          router.replace('/login');
        } else {
          setError('An unexpected error occurred. Please try again.');
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