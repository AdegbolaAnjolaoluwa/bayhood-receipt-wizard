
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple login check
    if (loginData.email === 'biolafaan@gmail.com' && loginData.password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', loginData.email);
      localStorage.setItem('userName', 'CEO Admin');
      localStorage.setItem('userRole', 'CEO');
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Main Login Card */}
        <Card className="border-2 border-orange-200 shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-t-lg">
            <div className="mb-4">
              <div className="flex justify-center mb-4">
                <img 
                  src="/lovable-uploads/078af04c-c3bd-4605-9cee-39fb18d92842.png" 
                  alt="Bayhood Preparatory School Logo" 
                  className="h-20 w-auto"
                />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">BAYHOOD PREPARATORY SCHOOL</CardTitle>
            <p className="text-orange-100">Fee Receipt Management System</p>
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
                  className="border-2 border-gray-300 focus:border-orange-500"
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
                  className="border-2 border-gray-300 focus:border-orange-500"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-semibold py-3"
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </Button>
            </form>

            {error && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
