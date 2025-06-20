
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '../components/Dashboard';
import PasswordChange from '../components/PasswordChange';

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, loading, mustChangePassword } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">BPS</span>
          </div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  // Show password change screen if user must change password
  if (mustChangePassword) {
    return (
      <PasswordChange 
        onPasswordChanged={() => window.location.reload()} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Dashboard user={{ username: profile.username, role: profile.role }} />
    </div>
  );
};

export default Index;
