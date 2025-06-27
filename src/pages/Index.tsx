
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<{username: string, role: string} | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      // Fetch user profile from Supabase
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('username, role')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            // Fallback to email and default role
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

  if (loading || profileLoading) {
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

  if (!user || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Dashboard user={userProfile} />
    </div>
  );
};

export default Index;
