
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface CreateUserResult {
  success: boolean;
  user_id?: string;
  email?: string;
  username?: string;
  role?: string;
  temp_password?: string;
  error?: string;
}

const UserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreateUserResult | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    role: ''
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: formData
      });

      if (error) throw error;

      setResult(data);
      
      // Reset form on success
      if (data.success) {
        setFormData({ email: '', username: '', role: '' });
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create School User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter email address"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CEO">CEO</SelectItem>
                <SelectItem value="Head Teacher">Head Teacher</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            disabled={loading || !formData.email || !formData.username || !formData.role}
            className="w-full"
          >
            {loading ? 'Creating User...' : 'Create User'}
          </Button>
        </form>

        {result && (
          <div className="mt-4">
            {result.success ? (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">
                  <div className="space-y-2">
                    <p><strong>User created successfully!</strong></p>
                    <p><strong>Email:</strong> {result.email}</p>
                    <p><strong>Username:</strong> {result.username}</p>
                    <p><strong>Role:</strong> {result.role}</p>
                    <p><strong>Temporary Password:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{result.temp_password}</code></p>
                    <p className="text-sm text-gray-600">
                      ⚠️ Save this password! The user will be required to change it on first login.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  Error: {result.error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
