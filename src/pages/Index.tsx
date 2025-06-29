
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard';
import SplashScreen from '../components/SplashScreen';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<{username: string, role: string} | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('username, role')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            setUserProfile({
              username: user.email || 'User',
              role: 'User'
            });
          } else {
            setUserProfile({
              username: data.username || user.email || 'User',
              role: data.role || 'User'
            });
          }
        } catch (err) {
          console.error('Profile fetch error:', err);
          setUserProfile({
            username: user.email || 'User',
            role: 'User'
          });
        } finally {
          setProfileLoading(false);
        }
      };

      fetchProfile();
    }
  }, [user, loading, navigate]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="mb-6">
            <img 
              src="/lovable-uploads/5c6ce8b6-a29d-4cde-9dcd-8a3d504cd230.png" 
              alt="Bayhood Preparatory School Logo" 
              className="h-20 w-auto mx-auto animate-pulse"
            />
          </div>
          <div className="flex items-center space-x-2 justify-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} user={user} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Dashboard user={userProfile} />
    </div>
  );
};

export default Index;
