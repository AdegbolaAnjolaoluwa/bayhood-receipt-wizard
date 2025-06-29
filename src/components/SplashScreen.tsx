
import { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  user?: { email?: string } | null;
}

const SplashScreen = ({ onComplete, user }: SplashScreenProps) => {
  const isCEO = user?.email === 'biolafaan@gmail.com';
  const duration = isCEO ? 1678 : 1200; // 1.678 seconds for CEO, 1.2 seconds for others

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="text-center animate-fade-in">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/5c6ce8b6-a29d-4cde-9dcd-8a3d504cd230.png" 
            alt="Bayhood Preparatory School Logo" 
            className="h-32 w-auto mx-auto animate-bounce"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800 animate-pulse">
            {isCEO ? 'Welcome back CEO!' : 'Bayhood Preparatory School'}
          </h1>
          <p className="text-xl text-gray-600">
            {isCEO ? 'Your leadership drives our excellence' : 'Fee Receipt Management System'}
          </p>
          <div className="flex items-center space-x-2 justify-center mt-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-gray-500 mt-4">
            {isCEO ? 'Preparing your executive dashboard...' : 'Loading...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
