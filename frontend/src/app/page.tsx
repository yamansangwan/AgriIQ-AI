"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const WisprFlowBackground = dynamic(() => import('@/components/WisprFlowBackground'), { ssr: false });

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white text-black font-sans">
      {/* 3D Background */}
      <WisprFlowBackground />
      
      {/* Content */}
      <div className="z-10 container mx-auto px-6 pt-32 pb-24 text-center max-w-5xl">
        <div className="flex justify-center mb-8 drop-shadow-sm hover:scale-[1.02] transition-transform duration-500">
          <img src="/logo.png" alt="AgriIQ AI Logo" className="h-48 md:h-64 object-contain" />
        </div>
        <p className="text-xl md:text-2xl text-gray-700 font-medium mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
          The next-generation agricultural intelligence platform. Powered by a multi-agent AI architecture to analyze crops, predict weather risks, and deliver precision farming strategies.
        </p>
        
        <div className="flex justify-center space-x-6 mb-24">
          <Link href="/analyze" className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold transition-all duration-500 bg-black text-white rounded-full shadow-2xl hover:bg-white hover:text-black hover:shadow-black/20 border-2 border-black focus:outline-none overflow-hidden">
            <span className="relative z-10 flex items-center">
              Start Analysis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </span>
          </Link>
          <Link href="/architecture" className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-black transition-all duration-500 bg-white/50 backdrop-blur-sm border-2 border-black rounded-full hover:bg-black hover:text-white shadow-lg focus:outline-none">
            View Architecture
          </Link>
        </div>
      </div>
    </main>
  );
}
