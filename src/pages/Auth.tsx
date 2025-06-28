
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Check if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        setError(error.message || 'Invalid email or password');
      } else {
        // Navigation will be handled by the useEffect above
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center">
          <div className="mb-4">
            <img 
              src="/lovable-uploads/078af04c-c3bd-4605-9cee-39fb18d92842.png" 
              alt="Bayhood Preparatory School Logo" 
              className="h-16 w-auto mx-auto"
            />
          </div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm sm:max-w-md space-y-4">
        {/* Main Login Card */}
        <Card className="border shadow-lg">
          <CardHeader className="text-center bg-white text-gray-800 rounded-t-lg p-4 sm:p-6 border-b">
            <div className="mb-2 sm:mb-4">
              <div className="flex justify-center mb-2 sm:mb-4">
                <img 
                  src="/lovable-uploads/0054f70d-58c4-4fcc-bd7c-426a6f6d8b13.png" 
                  alt="Bayhood Preparatory School Logo" 
                  className="h-16 sm:h-20 w-auto"
                />
              </div>
            </div>
            <CardTitle className="text-lg sm:text-2xl font-bold text-blue-800">BAYHOOD PREPARATORY SCHOOL</CardTitle>
            <p className="text-gray-600 text-sm sm:text-base">Fee Receipt Management System</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 bg-white">
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
                  className="border-2 border-gray-300 focus:border-orange-500 w-full"
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
                  className="border-2 border-gray-300 focus:border-orange-500 w-full"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-semibold py-3 text-sm sm:text-base"
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </Button>
            </form>

            {error && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700 text-sm">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
