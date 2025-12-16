import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`
        relative h-8 w-14 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
        ${theme === 'dark' ? 'bg-gray-800 ring-offset-gray-900' : 'bg-gray-200 ring-offset-white'}
      `}
      aria-label="Toggle Dark Mode"
    >
      <div className="flex justify-between items-center w-full h-full px-1">
        <Moon size={12} className="text-gray-400" />
        <Sun size={12} className="text-yellow-500" />
      </div>
      
      <div
        className={`
          absolute top-1 left-1 h-6 w-6 rounded-full shadow-md transform transition-transform duration-300 ease-spring
          flex items-center justify-center
          ${theme === 'dark' ? 'translate-x-6 bg-gray-900 border border-gray-700' : 'translate-x-0 bg-white border border-gray-100'}
        `}
      >
        {theme === 'dark' ? (
          <Moon size={12} className="text-white" strokeWidth={2} />
        ) : (
          <Sun size={12} className="text-black" strokeWidth={2} />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;