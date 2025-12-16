import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center transform transition-transform group-hover:rotate-12 duration-500">
             <div className="w-3 h-3 bg-white dark:bg-black rounded-full"></div>
          </div>
          <h1 className="text-lg font-medium tracking-tight text-gray-900 dark:text-white">
            ProductPolish<span className="text-gray-400 dark:text-gray-600 font-light">AI</span>
          </h1>
        </div>
        
        <nav className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-6">
             <span className="text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">v2.5 Flash Image</span>
             <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium">Docs</a>
          </div>
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2 hidden sm:block"></div>
          
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          
          <button className="hidden sm:block text-sm bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg shadow-gray-200 dark:shadow-none font-medium">
            Get API Key
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;