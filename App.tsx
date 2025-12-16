import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Download, RefreshCw, AlertCircle, ArrowRight, Sparkles, X, Wand2, Upload, MoveRight, Layers, Palette, MousePointerClick } from 'lucide-react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import LoadingSpinner from './components/LoadingSpinner';
import { editImageWithGemini, fileToBase64 } from './services/geminiService';
import { ImageState, ProcessingState } from './types';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<ImageState | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [processing, setProcessing] = useState<ProcessingState>({
    isLoading: false,
    error: null,
    successMessage: null,
  });
  
  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleImageSelect = useCallback(async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const previewUrl = URL.createObjectURL(file);
      
      setSourceImage({
        file,
        previewUrl,
        base64,
        mimeType: file.type,
      });
      setResultImage(null);
      setProcessing({ isLoading: false, error: null, successMessage: null });
    } catch (err) {
      setProcessing(prev => ({ ...prev, isLoading: false, error: "Failed to load image." }));
    }
  }, []);

  const handleClear = () => {
    setSourceImage(null);
    setResultImage(null);
    setPrompt('');
    setProcessing({ isLoading: false, error: null, successMessage: null });
  };

  const handleGenerate = async () => {
    if (!sourceImage?.base64 || !sourceImage?.mimeType) return;
    if (!prompt.trim()) {
      setProcessing(prev => ({ ...prev, error: "Please enter instructions." }));
      return;
    }

    setProcessing({ isLoading: true, error: null, successMessage: null });

    try {
      const { imageUrl, textResponse } = await editImageWithGemini(
        sourceImage.base64,
        sourceImage.mimeType,
        prompt
      );

      if (imageUrl) {
        setResultImage(imageUrl);
        setProcessing({ 
          isLoading: false, 
          error: null, 
          successMessage: "Complete." 
        });
      } else {
        setProcessing({ 
          isLoading: false, 
          error: textResponse || "No image generated. Try again.", 
          successMessage: null 
        });
      }
    } catch (error: any) {
      setProcessing({ 
        isLoading: false, 
        error: error.message || "An unexpected error occurred.", 
        successMessage: null 
      });
    }
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `polished-product-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyPreset = (text: string) => {
    setPrompt(text);
  };

  // Drag and drop logic
  useEffect(() => {
    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current += 1;
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) setIsDragging(true);
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        setIsDragging(false);
        dragCounter.current = 0;
      }
    };

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleWindowDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;
      if (processing.isLoading) return;

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          handleImageSelect(file);
          return;
        }
      }

      const imageUrl = e.dataTransfer?.getData('text/uri-list') || e.dataTransfer?.getData('text/plain');
      if (imageUrl && (imageUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:') || imageUrl.startsWith('http'))) {
        try {
          setProcessing({ isLoading: true, error: null, successMessage: null });
          const response = await fetch(imageUrl);
          if (!response.ok) throw new Error("Failed to fetch");
          const blob = await response.blob();
          if (!blob.type.startsWith('image/')) throw new Error("Not an image");
          const file = new File([blob], "dropped-image.png", { type: blob.type });
          await handleImageSelect(file);
        } catch (err) {
          setProcessing(prev => ({ ...prev, isLoading: false, error: "Could not load web image. Try saving it first." }));
        }
      }
    };

    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [handleImageSelect, processing.isLoading]);

  return (
    <div className="min-h-screen text-gray-800 flex flex-col relative overflow-x-hidden selection:bg-gray-200">
      
      {/* Refined Glass Overlay for Drag */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-300">
          <div className="text-center transform transition-transform duration-500 scale-100">
            <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-8 border border-gray-100 animate-bounce">
              <Upload className="w-12 h-12 text-black" strokeWidth={1} />
            </div>
            <h2 className="text-3xl font-light tracking-tighter text-black mb-2">Release to Upload</h2>
            <p className="text-gray-400 font-light">Magic awaits.</p>
          </div>
        </div>
      )}

      <Header />

      <main className="flex-grow pt-32 pb-20 px-6 sm:px-8 max-w-[1400px] mx-auto w-full">
        
        {/* Intro Section */}
        <div className="mb-16 text-center max-w-2xl mx-auto animate-fade-in-up">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-500 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Gemini 2.5 Active
           </div>
           <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-gray-900 mb-6 leading-[0.9]">
             Studio quality, <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-800 font-light italic">minus the studio.</span>
           </h1>
           <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg mx-auto">
             Upload a product shot. Describe the scene. We handle the lighting, background, and shadows instantly.
           </p>
        </div>

        {/* Error Toast */}
        {processing.error && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white border border-red-100 shadow-2xl rounded-full py-3 px-6 flex items-center gap-3 animate-fade-in-up">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <p className="text-sm text-red-600 font-medium">{processing.error}</p>
            <button onClick={() => setProcessing(p => ({ ...p, error: null }))}>
              <X className="w-4 h-4 text-gray-400 hover:text-black" />
            </button>
          </div>
        )}

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px] mb-24">
          
          {/* LEFT: Editor Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-2 shadow-[0_2px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100 h-full flex flex-col transition-all duration-500 hover:shadow-[0_8px_40px_-10px_rgba(0,0,0,0.08)]">
              
              {/* Image Preview / Upload */}
              <div className="relative flex-grow bg-gray-50/50 rounded-2xl overflow-hidden min-h-[300px]">
                {sourceImage ? (
                  <div className="relative w-full h-full group">
                    <img 
                      src={sourceImage.previewUrl!} 
                      alt="Source" 
                      className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button 
                        onClick={handleClear}
                        className="bg-white text-black px-6 py-3 rounded-full shadow-xl border border-gray-100 flex items-center gap-2 hover:scale-105 transition-transform"
                      >
                        <RefreshCw className="w-4 h-4" /> Replace Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <ImageUpload onImageSelected={handleImageSelect} disabled={processing.isLoading} />
                )}
              </div>

              {/* Controls */}
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                   <label className="text-sm font-medium text-gray-900 tracking-tight">Instructions</label>
                   <span className="text-xs text-gray-400 font-mono">PROMPT</span>
                </div>
                
                <div className="relative group">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the desired background and lighting..."
                    className="w-full bg-gray-50 border-0 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-black/5 focus:bg-white transition-all resize-none h-32 text-sm leading-relaxed font-light"
                    disabled={processing.isLoading}
                  />
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Wand2 className="w-4 h-4 text-gray-300" />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                   {["White Studio Background", "Luxury Marble Table", "Sunlight & Shadows"].map((preset, i) => (
                     <button key={i} onClick={() => applyPreset(preset)} className="text-[10px] uppercase tracking-wider font-medium text-gray-500 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 hover:text-black transition-colors bg-white">
                       {preset}
                     </button>
                   ))}
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleGenerate}
                    disabled={!sourceImage || !prompt || processing.isLoading}
                    className={`w-full py-4 rounded-xl font-medium text-sm tracking-wide transition-all duration-500 flex items-center justify-center gap-2 group
                      ${!sourceImage || !prompt || processing.isLoading 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-black text-white shadow-xl hover:shadow-2xl hover:-translate-y-1'
                      }`}
                  >
                    {processing.isLoading ? (
                      <span className="flex items-center gap-2">Processing <span className="animate-pulse">...</span></span>
                    ) : (
                      <>
                        Generate Assets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Result Panel */}
          <div className="lg:col-span-7">
             <div className="h-full bg-white rounded-3xl border border-gray-100 shadow-[0_2px_40px_-10px_rgba(0,0,0,0.05)] overflow-hidden relative group">
                {processing.isLoading ? (
                  <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-xl flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : null}

                {resultImage ? (
                  <div className="relative w-full h-full flex flex-col">
                    <div className="flex-grow relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50 p-12 flex items-center justify-center">
                       <img 
                        src={resultImage} 
                        alt="Result" 
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-fade-in-up"
                       />
                       
                       {/* Floating Toolbar */}
                       <div className="absolute bottom-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                          <button onClick={downloadImage} className="bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-medium hover:scale-105 transition-transform">
                             <Download className="w-4 h-4" /> Download High-Res
                          </button>
                          <button onClick={() => setResultImage(null)} className="bg-white text-black px-4 py-3 rounded-full shadow-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                             <RefreshCw className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  </div>
                ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 p-12 border-dashed border-2 border-transparent">
                      <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6 animate-float">
                        <Sparkles className="w-8 h-8 text-gray-300" strokeWidth={1} />
                      </div>
                      <p className="font-light tracking-tight text-lg text-gray-400">Your masterpiece appears here.</p>
                   </div>
                )}
             </div>
          </div>
        </div>

        {/* BENTO GRID Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
           <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-500 group">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                 <Layers className="w-6 h-6 text-orange-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Smart Segmentation</h3>
              <p className="text-gray-500 font-light text-sm leading-relaxed">
                 Our AI identifies the product subject with pixel-perfect precision, separating it from the original background instantly.
              </p>
           </div>
           
           <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-500 group md:col-span-2 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-bl-[100px] -z-0 opacity-50"></div>
               <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                  <div className="flex-1">
                     <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Palette className="w-6 h-6 text-purple-600" strokeWidth={1.5} />
                     </div>
                     <h3 className="text-xl font-medium text-gray-900 mb-2">Contextual Lighting</h3>
                     <p className="text-gray-500 font-light text-sm leading-relaxed max-w-md">
                        Describe the scene, and we don't just paste the image—we adjust shadows, reflections, and color grading to match the environment.
                     </p>
                  </div>
                  <div className="hidden md:block w-32 h-20 bg-gray-50 rounded-xl border border-gray-200 shadow-sm transform rotate-3 group-hover:rotate-6 transition-transform duration-700"></div>
                  <div className="hidden md:block w-32 h-20 bg-white rounded-xl border border-gray-200 shadow-lg transform -rotate-3 -translate-x-12 translate-y-4 group-hover:-rotate-6 transition-transform duration-700"></div>
               </div>
           </div>

           <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-500 group md:col-span-3 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <MousePointerClick className="w-6 h-6 text-green-600" strokeWidth={1.5} />
                 </div>
                 <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-1">Drag, Drop, Done.</h3>
                    <p className="text-gray-500 font-light text-sm">Works with JPG, PNG, and WebP formats.</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 pr-4">
                 <div className="text-xs font-mono text-gray-300">PROCESSING SPEED</div>
                 <div className="h-1 w-32 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-black w-3/4 rounded-full animate-pulse"></div>
                 </div>
                 <div className="text-xs font-mono text-black">~1.2s</div>
              </div>
           </div>
        </div>

      </main>

      {/* Simple Footer */}
      <footer className="text-center py-8 text-gray-400 text-xs font-light tracking-wide">
         &copy; 2024 ProductPolish AI. Built with Google Gemini.
      </footer>
    </div>
  );
};

export default App;