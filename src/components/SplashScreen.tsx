
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useAuth();
  
  // Check if current user is the CEO
  const isCEO = user?.email === 'biolafaan@gmail.com';
  const splashDuration = isCEO ? 1678 : 1200; // 1.678 seconds for CEO, 1.2 seconds for others

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Small delay for fade out animation
    }, splashDuration);

    return () => clearTimeout(timer);
  }, [onComplete, splashDuration]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center animate-fade-in">
      <div className="text-center">
        <div className="mb-8 animate-scale-in">
          <img 
            src="/lovable-uploads/5c6ce8b6-a29d-4cde-9dcd-8a3d504cd230.png" 
            alt="Bayhood Preparatory School Logo" 
            className="h-40 w-auto mx-auto drop-shadow-lg"
          />
        </div>
        <div className="animate-pulse">
          {isCEO ? (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, CEO!</h2>
              <p className="text-gray-600 font-medium">Excellence in education starts with your leadership</p>
            </div>
          ) : null}
          <div className="flex items-center space-x-2 justify-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">
            {isCEO ? 'Preparing your executive dashboard...' : 'Loading...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
