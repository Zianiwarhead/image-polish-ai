import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center transform transition-transform group-hover:rotate-12 duration-500">
             <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <h1 className="text-lg font-medium tracking-tight text-gray-900">
            ProductPolish<span className="text-gray-400 font-light">AI</span>
          </h1>
        </div>
        
        <nav className="hidden sm:flex items-center gap-8">
          <span className="text-xs font-medium tracking-widest uppercase text-gray-400">v2.5 Flash Image</span>
          <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">Documentation</a>
          <button className="text-sm bg-black text-white px-5 py-2 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg shadow-gray-200">
            Get API Key
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;