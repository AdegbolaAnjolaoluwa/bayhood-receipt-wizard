
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInitialSetup, setShowInitialSetup] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Initial CEO setup state
  const [setupData, setSetupData] = useState({
    email: 'biolafaan@gmail.com',
    username: 'CEO Admin',
    password: 'subomi07'
  });

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const handleInitialSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Create the CEO account using Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: setupData.email,
        password: setupData.password,
        options: {
          data: {
            username: setupData.username,
            role: 'CEO',
            must_change_password: false
          }
        }
      });

      if (signUpError) throw signUpError;

      setError('');
      alert('CEO account created successfully! You can now log in.');
      setShowInitialSetup(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">BPS</span>
          </div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Main Login Card */}
        <Card className="border-2 border-blue-200 shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-blue-600">BPS</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">BAYHOOD PREPARATORY SCHOOL</CardTitle>
            <p className="text-blue-100">Fee Receipt Management System</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  placeholder="Enter your email"
                  className="border-2 border-gray-300 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="Enter your password"
                  className="border-2 border-gray-300 focus:border-blue-500"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3"
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </Button>
            </form>

            {error && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {/* Initial Setup Button */}
            <div className="mt-4 text-center">
              <Button
                onClick={() => setShowInitialSetup(!showInitialSetup)}
                variant="outline"
                className="text-sm"
              >
                {showInitialSetup ? 'Hide Setup' : 'Initial CEO Setup'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Initial CEO Setup Card */}
        {showInitialSetup && (
          <Card className="border-2 border-green-200 shadow-2xl">
            <CardHeader className="text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold">Create Initial CEO Account</CardTitle>
              <p className="text-green-100">Set up the first administrator account</p>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleInitialSetup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={setupData.email}
                    onChange={(e) => setSetupData({...setupData, email: e.target.value})}
                    placeholder="Enter CEO email"
                    className="border-2 border-gray-300 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <Input
                    type="text"
                    value={setupData.username}
                    onChange={(e) => setSetupData({...setupData, username: e.target.value})}
                    placeholder="Enter username"
                    className="border-2 border-gray-300 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={setupData.password}
                    onChange={(e) => setSetupData({...setupData, password: e.target.value})}
                    placeholder="Enter password"
                    className="border-2 border-gray-300 focus:border-green-500"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3"
                >
                  {isLoading ? 'Creating CEO Account...' : 'Create CEO Account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Auth;
