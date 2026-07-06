"use client";

import Link from 'next/link';
import { ArrowLeft, Sprout, ShieldCheck, CloudSunRain, Activity, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const WisprFlowBackground = dynamic(() => import('@/components/WisprFlowBackground'), { ssr: false });

export default function ArchitecturePage() {
  const features = [
    {
      icon: <Sprout className="w-8 h-8 text-black" />,
      title: "Crop Vision Agent",
      description: "Utilizes advanced computer vision to identify crop types, determine precise growth stages, and visually detect early symptoms of disease or nutrient deficiency."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-black" />,
      title: "Disease & Protection Agent",
      description: "Cross-references visual symptoms with a vast agricultural database to recommend targeted treatments, pesticides, and sustainable organic alternatives."
    },
    {
      icon: <CloudSunRain className="w-8 h-8 text-black" />,
      title: "Weather Intelligence Agent",
      description: "Analyzes global weather patterns and local microclimates to predict drought, rainfall impacts, and humidity risks specific to your farm's location."
    },
    {
      icon: <Activity className="w-8 h-8 text-black" />,
      title: "Farm Planner Agent",
      description: "Aggregates all insights to generate a comprehensive health score and actionable, day-by-day weekly strategies to optimize yield."
    }
  ];

  const useCases = [
    "Early disease detection and intervention to prevent crop loss.",
    "Optimizing fertilizer and pesticide usage for sustainable farming.",
    "Adapting farming schedules to unpredictable microclimate weather patterns.",
    "Providing expert-level agronomy advice to smallholder farmers via AI."
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-black font-sans pb-24">
      {/* Background */}
      <div className="fixed inset-0 z-0 opacity-40">
        <WisprFlowBackground />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/70 backdrop-blur-lg border-b border-emerald-100/50 sticky top-0 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center">
          <Link href="/" className="text-gray-500 hover:text-black transition-colors p-2 hover:bg-emerald-50 rounded-full mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#105921] drop-shadow-sm" style={{ fontFamily: 'var(--font-outfit)' }}>
            System Architecture
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 pt-16 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>
            The Engine Behind AgriIQ
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AgriIQ uses a powerful Multi-Agent Architecture. Instead of relying on a single AI model, we orchestrate specialized AI agents that collaborate to deliver precision farming insights.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white/80 backdrop-blur-xl border border-emerald-100/60 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>{feature.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Use Cases */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-black rounded-3xl p-10 md:p-16 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
          
          <h2 className="text-4xl font-extrabold mb-8" style={{ fontFamily: 'var(--font-outfit)' }}>
            Real-World Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, idx) => (
              <div key={idx} className="flex items-start space-x-4 bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-200">{useCase}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/analyze" className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold transition-all duration-500 bg-white text-black rounded-full shadow-lg hover:bg-gray-200 hover:shadow-white/20 focus:outline-none">
              Try It Now
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
