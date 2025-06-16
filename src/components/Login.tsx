
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface User {
  username: string;
  role: string;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const credentials = {
    ceo: { password: 'ceo123', role: 'CEO' },
    headteacher: { password: 'teacher123', role: 'Head Teacher' }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userCreds = credentials[username.toLowerCase() as keyof typeof credentials];
    
    if (userCreds && userCreds.password === password) {
      onLogin({ username, role: userCreds.role });
      setError('');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="border-2 border-gray-300 focus:border-blue-500"
                required
              />
            </div>
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3"
            >
              Login
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            <p className="font-semibold">Demo Credentials:</p>
            <p>CEO: ceo / ceo123</p>
            <p>Head Teacher: headteacher / teacher123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
