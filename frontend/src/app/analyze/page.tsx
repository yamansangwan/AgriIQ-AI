"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, MapPin, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import FarmingLoader from '@/components/FarmingLoader';
import { analyzeCrop } from '@/lib/api';

export default function AnalyzePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setError(null);
    setIsAnalyzing(true);
    setCurrentStep('Uploading image to secure cloud...');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('location', location);
      formData.append('problemDescription', problemDescription);

      setCurrentStep('Multi-Agent AI analyzing crop data...');
      
      const response = await analyzeCrop(formData);
      
      if (response.success && response.data._id) {
        setCurrentStep('Analysis complete! Redirecting...');
        router.push(`/dashboard/${response.data._id}`);
      }
    } catch (err: any) {
      console.error('Analysis failed', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to analyze. Check backend connection.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-200/20 blur-3xl rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl z-10"
      >
        <Card className="border border-black shadow-2xl shadow-black/20 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-8 pt-12 border-b border-black/10 bg-gradient-to-b from-emerald-50/30 to-transparent">
            <CardTitle className="text-4xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm" style={{ fontFamily: 'var(--font-outfit)' }}>
              Crop Analysis
            </CardTitle>
            <CardDescription className="text-gray-500 mt-3 text-lg px-6">
              Upload a clear photo of your crop to begin the multi-agent AI assessment.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium flex items-center shadow-sm">
                <AlertCircle className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" />
                {error}
              </motion.div>
            )}
            <form onSubmit={handleAnalyze} className="space-y-8">
              
              {/* Image Upload Area */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700 ml-1">Crop Image</Label>
                <div className="relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-black/40 rounded-3xl bg-emerald-50/30 hover:bg-emerald-50/80 hover:border-black transition-all duration-300 cursor-pointer overflow-hidden group">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Crop Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-emerald-700/60 group-hover:text-emerald-700 transition-colors">
                      <div className="w-16 h-16 mb-4 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                        <Upload className="w-8 h-8 text-emerald-500" />
                      </div>
                      <p className="mb-2 text-base"><span className="font-bold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs opacity-70">PNG, JPG, JPEG up to 5MB</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/webp"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="location" className="text-sm font-bold text-gray-700 flex items-center ml-1">
                    <MapPin className="w-4 h-4 mr-1.5 text-emerald-500" /> Location (Optional)
                  </Label>
                  <Input 
                    id="location" 
                    placeholder="e.g. Salinas, California" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="rounded-2xl border-black/20 hover:border-black/50 bg-white/50 focus:bg-white focus:ring-black focus:border-black h-14 px-4 transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="problem" className="text-sm font-bold text-gray-700 flex items-center ml-1">
                    <FileText className="w-4 h-4 mr-1.5 text-emerald-500" /> Description (Optional)
                  </Label>
                  <Input 
                    id="problem" 
                    placeholder="e.g. Leaves turning yellow" 
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    className="rounded-2xl border-black/20 hover:border-black/50 bg-white/50 focus:bg-white focus:ring-black focus:border-black h-14 px-4 transition-all shadow-sm"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={!file || isAnalyzing}
                className="w-full h-16 rounded-2xl text-lg font-bold transition-all mt-6 shadow-xl disabled:opacity-70 disabled:hover:scale-100 bg-black text-white hover:bg-white hover:text-black border-2 border-transparent hover:border-black"
              >
                {isAnalyzing ? "Analyzing..." : "Run Multi-Agent Analysis"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      {isAnalyzing && <FarmingLoader text={currentStep} />}
    </div>
  );
}
