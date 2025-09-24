import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Check if admin user exists on component mount
  useEffect(() => {
    checkAdminUser();
  }, []);

  const checkAdminUser = async () => {
    try {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      
      const adminUser = users.find(user => user.email === 'admin@jptt.edu');
      if (!adminUser) {
        console.log('Admin user not found. You need to create it first.');
      }
    } catch (error) {
      console.error('Error checking admin user:', error);
    }
  };

  const createAdminUser = async () => {
    setIsCreatingUser(true);
    setError('');

    try {
      // First, check if user already exists
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existingUser = users.find(user => user.email === 'admin@jptt.edu');
      
      if (existingUser) {
        setError('Admin user already exists. Please use the login form.');
        setIsCreatingUser(false);
        return;
      }

      // Create the admin user
      const { data, error } = await supabase.auth.admin.createUser({
        email: 'admin@jptt.edu',
        password: 'admin123',
        email_confirm: true, // Auto-confirm the email
        user_metadata: { role: 'admin' }
      });

      if (error) throw error;

      if (data.user) {
        setError('Admin user created successfully! You can now login.');
        setEmail('admin@jptt.edu');
        setPassword('admin123');
      }
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      setError(error.message || 'Failed to create admin user');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          setError('Invalid email or password. Please check your credentials.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please verify your email address before logging in.');
        } else {
          setError(error.message);
        }
        return;
      }

      // Login successful - redirect or handle session
      console.log('Login successful:', data.user);
      
      // Redirect to admin dashboard or home page
      window.location.href = '/dashboard';
      
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@jptt.edu');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Lock className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the administrative panel
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className={`rounded-md p-4 ${error.includes('successfully') ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className={`text-sm ${error.includes('successfully') ? 'text-green-700' : 'text-red-700'}`}>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>

              <button
                type="button"
                onClick={createAdminUser}
                disabled={isCreatingUser}
                className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {isCreatingUser ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Creating Admin...
                  </div>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Admin User
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Demo credentials: admin@jptt.edu / admin123
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Auto-fill Demo Credentials
              </button>
            </div>
          </form>
        </div>
        
        <div className="text-center text-xs text-gray-500">
          <p>For first-time setup, click "Create Admin User" before logging in.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
