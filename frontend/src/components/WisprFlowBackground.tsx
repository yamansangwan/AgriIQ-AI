'use client';

import { useEffect, useState, useRef } from 'react';

export default function WisprFlowBackground() {
  const [mounted, setMounted] = useState(false);
  
  const offsetRef1 = useRef(0);
  const offsetRef2 = useRef(-100);
  const offsetRef3 = useRef(0);
  
  const [offsets, setOffsets] = useState([0, -100, 0]);

  useEffect(() => {
    setMounted(true);
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      // Calculate delta time to ensure smooth speed regardless of frame rate
      const dt = time - lastTime;
      lastTime = time;

      // Update offsets (pixels/percentage equivalent per ms)
      offsetRef1.current -= (0.0008 * dt);
      if (offsetRef1.current <= -100) offsetRef1.current += 100;

      offsetRef2.current += (0.0010 * dt);
      if (offsetRef2.current >= 0) offsetRef2.current -= 100;

      offsetRef3.current -= (0.0007 * dt);
      if (offsetRef3.current <= -100) offsetRef3.current += 100;

      setOffsets([offsetRef1.current, offsetRef2.current, offsetRef3.current]);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  if (!mounted) return null;

  const textContent = "Crop Vision Agent • Disease & Protection Agent • Weather Intelligence Agent • Farm Planner Agent • ".repeat(15);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 pointer-events-none">
      
      {/* Background gradients for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/20 blur-3xl rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-200/20 blur-3xl rounded-full" />

      {/* SVG Flow Animations */}
      <svg className="absolute w-[200vw] h-[150vh] left-[-50vw] top-[-25vh] opacity-30" viewBox="0 0 2000 1000" preserveAspectRatio="xMidYMid slice">
        
        {/* Path 1: Top swoosh */}
        <path
          id="flowPath1"
          d="M -200,800 C 300,1000 600,100 1000,300 C 1400,500 1700,-100 2200,200"
          fill="transparent"
          stroke="none"
        />
        <text className="text-2xl font-extrabold fill-black/60 tracking-widest uppercase" style={{ fontFamily: 'var(--font-outfit)' }}>
          <textPath href="#flowPath1" startOffset={`${offsets[0]}%`}>
            {textContent}
          </textPath>
        </text>

        {/* Path 2: Middle swirl */}
        <path
          id="flowPath2"
          d="M -200,200 C 400,-100 500,800 1000,700 C 1500,600 1600,200 2200,500"
          fill="transparent"
          stroke="none"
        />
        <text className="text-2xl font-extrabold fill-emerald-800/40 tracking-widest uppercase" style={{ fontFamily: 'var(--font-outfit)' }}>
          <textPath href="#flowPath2" startOffset={`${offsets[1]}%`}>
            {textContent}
          </textPath>
        </text>

        {/* Path 3: Bottom wave */}
        <path
          id="flowPath3"
          d="M -200,900 C 200,600 800,1100 1200,800 C 1600,500 1800,900 2200,700"
          fill="transparent"
          stroke="none"
        />
        <text className="text-2xl font-extrabold fill-black/40 tracking-widest uppercase" style={{ fontFamily: 'var(--font-outfit)' }}>
          <textPath href="#flowPath3" startOffset={`${offsets[2]}%`}>
            {textContent}
          </textPath>
        </text>

      </svg>
    </div>
  );
}
