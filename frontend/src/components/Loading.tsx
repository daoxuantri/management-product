// /src/components/loading.tsx
import React from 'react';
import Spinner from '@/components/ui/spinner'; // Sử dụng import default

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen bg-gray-50 ${className}`}
      aria-live="polite"
      aria-label="Loading content"
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loading;