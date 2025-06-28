
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Small delay for fade out animation
    }, 1200); // 1.2 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center animate-fade-in">
      <div className="text-center">
        <div className="mb-4 animate-scale-in">
          <img 
            src="/lovable-uploads/0054f70d-58c4-4fcc-bd7c-426a6f6d8b13.png" 
            alt="Bayhood Preparatory School Logo" 
            className="h-32 w-auto mx-auto"
          />
        </div>
        <div className="animate-pulse">
          <div className="w-8 h-8 mx-auto bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
