'use client'
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, ArrowLeft, User, Building, Search, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useAuth } from '@/app/context/AuthContext';

interface Company {
  id: number;
  name: string;
}

interface LoginResult {
  success: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    role: {
      name: string;
    };
  };
}

const LoginSignUp = () => {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]); // Boş dizi ile başlat
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const { login } = useAuth();

  // Sign Up states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/companies');
        // Response data'yı parse edip sadece ihtiyacımız olan alanları alalım
        const companiesData = response.data.map((company: any) => ({
          id: company.id,
          name: company.name
        }));
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError('Failed to fetch companies. Please try again later.');
        setCompanies([]);
      }
    };
    fetchCompanies();
  }, []); 

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await login(loginEmail, loginPassword);

      if (result && result.success && result.user) {
        const destination = result.user.role.name === 'ADMIN' ? '/homepageadmin' : '/homepageuser';
        router.push(destination);
      } else {
        setError('Login failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('verify your email')) {
          setError('Please verify your email address before logging in.');
          setSuccess('Check your email for the verification link.');
        } else if (
            errorMessage.includes('user not found') ||
            errorMessage.includes('invalid credentials') ||
            errorMessage.includes('invalid password')
        ) {
          setError('Invalid email or password');
        } else {
          setError('An error occurred during login. Please try again.');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    if (!selectedCompany?.id) {
      setError("Please select a company!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
        companyId: selectedCompany.id
      });

      if (response.data.success) {
        setSuccess('Registration successful! We have sent a verification link to your email. Please check your inbox and spam folder.');
        // Reset form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setSelectedCompany(null);

        // Switch to login form after delay
        setTimeout(() => {
          setIsLogin(true);
        }, 5000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Registration failed');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
  
    try {
      const response = await axios.post('http://localhost:8081/api/auth/forgot-password', {
        email: resetEmail
      });
  
      if (response.data.success) {
        setResetEmailSent(true);
        setSuccess('Password reset link has been sent to your email. Please check your inbox.');
        setTimeout(() => {
          setIsForgotPassword(false);
          setResetEmailSent(false);
        }, 5000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to send reset email');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
            {isForgotPassword ? "Reset Password" : (isLogin ? "Welcome Back" : "Create Account")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          {isForgotPassword ? (
            // Forgot Password Form
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {companies && companies.length > 0 ? (
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                value={selectedCompany?.id || ''}
                onChange={(e) => {
                  const company = companies.find(c => c.id === Number(e.target.value));
                  setSelectedCompany(company || null);
                }}
              >
                <option value="">Select a Company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Loading companies...
            </div>
          )}
            <button
              type="submit"
              disabled={isLoading || resetEmailSent}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
              {resetEmailSent ? 'Email Sent' : 'Send Reset Link'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                setResetEmail('');
                setResetEmailSent(false);
                setError('');
                setSuccess('');
              }}
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 w-full"
            >
              <ArrowLeft size={20} />
              Back to Login
            </button>
          </form>
          ) : (
            <>
              {isLogin ? (
                // Login Form
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      placeholder="Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-purple-600 hover:text-purple-700 text-sm"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 flex items-center justify-center"
                  >
                    {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                    Login
                  </button>
                </form>
              ) : (
                // Sign Up Form
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="relative flex-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="relative flex-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                    value={selectedCompany?.id || ''}
                    onChange={(e) => {
                      const company = companies.find(c => c.id === Number(e.target.value));
                      setSelectedCompany(company || null);
                    }}
                  >
                    <option value="">Select a Company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 flex items-center justify-center"
                  >
                    {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                    Sign Up
                  </button>
                </form>
              )}

              <div className="text-center mt-4">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                      setSuccess('');
                    }}
                    className="ml-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {isLogin ? "Sign Up" : "Login"}
                  </button>
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginSignUp;