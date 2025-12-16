import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px]">
      <div className="relative w-32 h-32">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-[0.5px] border-gray-200 dark:border-gray-700 rounded-full animate-[spin_10s_linear_infinite]"></div>
        
        {/* Middle Ring with Pulse */}
        <div className="absolute inset-4 border border-gray-300 dark:border-gray-600 rounded-full opacity-50 animate-pulse"></div>
        
        {/* Inner Animated Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
           <svg className="w-16 h-16 text-black dark:text-white animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
              <circle cx="12" cy="12" r="4" className="fill-black dark:fill-white animate-ping opacity-20" />
           </svg>
        </div>
        
        {/* Orbiting Particle */}
        <div className="absolute top-0 left-1/2 -ml-1.5 w-3 h-3 bg-black dark:bg-white rounded-full shadow-lg animate-[spin_3s_linear_infinite_reverse] origin-[50%_400%]"></div>
      </div>
      
      <div className="mt-8 text-center space-y-2">
        <h3 className="text-lg font-light tracking-tight text-gray-900 dark:text-white">Generating Assets</h3>
        <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">Processing pixels...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;