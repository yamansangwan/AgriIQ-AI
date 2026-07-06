'use client';

import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';

export default function FarmingLoader({ text }: { text: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0] 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="w-24 h-24 bg-black rounded-full flex items-center justify-center mb-6 shadow-2xl"
      >
        <Sprout className="w-12 h-12 text-white" />
      </motion.div>
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-extrabold text-black"
        style={{ fontFamily: 'var(--font-outfit)' }}
      >
        {text}
      </motion.h3>
      <motion.div 
        className="flex space-x-2 mt-4"
        initial="initial"
        animate="animate"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-black rounded-full"
            variants={{
              initial: { y: 0 },
              animate: {
                y: [0, -10, 0],
                transition: {
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }
              }
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
