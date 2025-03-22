
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type AnimationType = 'fade' | 'slide-up' | 'slide-down' | 'scale';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  show: boolean;
  type?: AnimationType;
  duration?: number;
  className?: string;
  unmountOnExit?: boolean;
}

export const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  show,
  type = 'fade',
  duration = 300,
  className,
  unmountOnExit = true,
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready for animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      if (unmountOnExit) {
        const timer = setTimeout(() => setShouldRender(false), duration);
        return () => clearTimeout(timer);
      }
    }
  }, [show, duration, unmountOnExit]);

  if (!shouldRender) return null;

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all';
    const durationClass = `duration-${duration}`;
    
    switch (type) {
      case 'fade':
        return `${baseClasses} ${durationClass} ${isAnimating ? 'opacity-100' : 'opacity-0'}`;
      case 'slide-up':
        return `${baseClasses} ${durationClass} ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;
      case 'slide-down':
        return `${baseClasses} ${durationClass} ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`;
      case 'scale':
        return `${baseClasses} ${durationClass} ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`;
      default:
        return `${baseClasses} ${durationClass} ${isAnimating ? 'opacity-100' : 'opacity-0'}`;
    }
  };

  return (
    <div className={cn(getAnimationClasses(), className)}>
      {children}
    </div>
  );
};

export default AnimatedTransition;
