import React, { useRef } from 'react';
import { Upload, Plus } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file);
      }
    }
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative group cursor-pointer overflow-hidden transition-all duration-500 h-full min-h-[400px] flex flex-col items-center justify-center
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-gray-800/50'}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl m-2 transition-all duration-500 group-hover:border-gray-400 dark:group-hover:border-gray-500 group-hover:m-0"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-gray-100 dark:border-gray-700">
          <Plus className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors" strokeWidth={1.5} />
        </div>
        
        <h3 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white mb-2">Upload Source</h3>
        <p className="text-gray-400 dark:text-gray-500 text-sm font-light text-center max-w-[200px] leading-relaxed">
          Drag & drop or click to browse files.
        </p>
        
        <div className="mt-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
           <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
           <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
           <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;