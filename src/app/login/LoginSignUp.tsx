'use client'
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const LoginSignUp = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', {
        email,
        password
      });

      const data = response.data;

      if (data.success) {
        if (data.role === 'ADMIN') {
          router.push('/homepageadmin');
        } else if (data.role === 'USER') {
          router.push('/homepageuser');
        }
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login error:', error.response?.data);
        alert(error.response?.data?.message || 'An error occurred during login');
      } else {
        console.error('Login error:', error);
        alert('An unexpected error occurred');
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin(e);
    } else {
      // Sign up logic here
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm transition-all duration-500">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
              {isForgotPassword ? "Reset Password" : (isLogin ? "Welcome Back" : "Create Account")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isForgotPassword ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <button
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity duration-200"
                  >
                    Send Reset Link
                  </button>
                  <button
                      onClick={() => setIsForgotPassword(false)}
                      className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 w-full"
                  >
                    <ArrowLeft size={20} />
                    Back to Login
                  </button>
                </div>
            ) : (
                <>
                  <div className={`transition-all duration-500 ${isLogin ? 'block' : 'hidden'}`}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity duration-200"
                      >
                        Login
                      </button>
                    </form>
                  </div>

                  <div className={`transition-all duration-500 ${!isLogin ? 'block' : 'hidden'}`}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <button
                          type="submit"
                          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity duration-200"
                      >
                        Sign Up
                      </button>
                    </form>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-gray-600">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}
                      <button
                          onClick={() => setIsLogin(!isLogin)}
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