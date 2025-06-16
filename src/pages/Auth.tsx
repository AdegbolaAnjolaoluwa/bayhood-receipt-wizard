
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    username: '',
    role: ''
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signUp(
      signupData.email, 
      signupData.password, 
      signupData.username, 
      signupData.role
    );
    
    if (error) {
      setError(error.message);
    } else {
      setError('Please check your email to confirm your account.');
    }
    setIsLoading(false);
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
      <Card className="w-full max-w-md border-2 border-blue-200 shadow-2xl">
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
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
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
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
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
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    placeholder="Enter your password"
                    className="border-2 border-gray-300 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <Input
                    type="text"
                    value={signupData.username}
                    onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                    placeholder="Enter your username"
                    className="border-2 border-gray-300 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <Select value={signupData.role} onValueChange={(value) => setSignupData({...signupData, role: value})}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CEO">CEO</SelectItem>
                      <SelectItem value="Head Teacher">Head Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3"
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
