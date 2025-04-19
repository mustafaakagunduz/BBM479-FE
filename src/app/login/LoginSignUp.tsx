'use client'
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, ArrowLeft, User, Building, Search, Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/app/context/AuthContext';
import { PasswordValidation, validatePassword } from "@/app/login/passwordValidation";
import LoginButton from "@/app/login/LoginButton";
import { useSearchParams } from 'next/navigation';
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";

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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const { login } = useAuth();
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();

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
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    isMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    isValid: false
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get('/api/companies');
        // Parse response data and get only the fields we need
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

  useEffect(() => {
    setPasswordValidation(validatePassword(password));
  }, [password]);

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
      // Simplified error handling - no email verification check
      setError('Invalid email or password');
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
      const response = await axiosInstance.post('/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
        companyId: selectedCompany.id
      });

      if (response.data.success) {
        setSuccess('Registration successful! You can now log in.');

        // Option 1: Auto-login after registration
        try {
          const loginResult = await login(email, password);
          if (loginResult && loginResult.success && loginResult.user) {
            const destination = loginResult.user.role.name === 'ADMIN' ? '/homepageadmin' : '/homepageuser';
            router.push(destination);
            return; // Stop execution after router push
          }
        } catch (loginError) {
          console.error('Auto login failed:', loginError);
          // If auto-login fails, redirect to login screen
        }

        // Option 2: Return to login form if auto-login fails
        setTimeout(() => {
          setIsLogin(true);
          // Reset form
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setSelectedCompany(null);
        }, 2000);
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
      const response = await axiosInstance.post('/api/auth/forgot-password', {
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
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="email"
                        placeholder="Email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                    />
                  </div>
                  <LoginButton isLoading={isLoading || resetEmailSent}>
                    {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                    {resetEmailSent ? 'Email Sent' : 'Send Reset Link'}
                  </LoginButton>
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
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                          <input
                              type="email"
                              placeholder="Email"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              required
                          />
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                          <input
                              type={showLoginPassword ? "text" : "password"}
                              placeholder="Password"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              required
                          />
                          <button
                              type="button"
                              onClick={() => setShowLoginPassword(!showLoginPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showLoginPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                          </button>
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
                        <LoginButton isLoading={isLoading}>
                          {isLoading ? <Loader2 className="animate-spin mr-2" size={20}/> : null}
                          Login
                        </LoginButton>
                      </form>
                  ) : (
                      // Sign Up Form
                      <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="flex space-x-4">
                          <div className="relative flex-1">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                          </div>
                          <div className="relative flex-1">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
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
                              required
                          />
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                          <input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                  password && !passwordValidation.isValid ? 'border-red-300' : 'border-gray-200'
                              }`}
                              required
                          />
                          <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                          </button>
                        </div>

                        {/* Password validation feedback */}
                        {password && (
                            <div className="space-y-2 text-sm rounded-lg bg-gray-50 p-3">
                              <div className={`flex items-center ${passwordValidation.isMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordValidation.isMinLength ? '✓' : '○'}</span>
                                At least 8 characters
                              </div>
                              <div className={`flex items-center ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordValidation.hasUpperCase ? '✓' : '○'}</span>
                                One uppercase letter
                              </div>
                              <div className={`flex items-center ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordValidation.hasLowerCase ? '✓' : '○'}</span>
                                One lowercase letter
                              </div>
                              <div className={`flex items-center ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordValidation.hasNumber ? '✓' : '○'}</span>
                                One number
                              </div>
                            </div>
                        )}

                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                          <input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm Password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                  confirmPassword && password !== confirmPassword ? 'border-red-300' : 'border-gray-200'
                              }`}
                              required
                          />
                          <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                          </button>
                        </div>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                          <select
                              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                              value={selectedCompany?.id || ''}
                              onChange={(e) => {
                                const company = companies.find(c => c.id === Number(e.target.value));
                                setSelectedCompany(company || null);
                              }}
                              required
                          >
                            <option value="">Select a Company</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                  {company.name}
                                </option>
                            ))}
                          </select>
                        </div>
                        <LoginButton isLoading={isLoading || !passwordValidation.isValid || password !== confirmPassword}>
                          {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                          Sign Up
                        </LoginButton>
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