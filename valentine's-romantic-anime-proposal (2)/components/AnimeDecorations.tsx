
import React, { useEffect, useState } from 'react';

interface AnimeDecorationsProps {
  isEasterEgg?: boolean;
}

const AnimeDecorations: React.FC<AnimeDecorationsProps> = ({ isEasterEgg }) => {
  const [sparkles, setSparkles] = useState<{ id: number; left: number; top: number; delay: number; size: number }[]>([]);
  const [lanterns, setLanterns] = useState<{ id: number; left: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    // Extra sparkles for Easter Egg
    const sparkleCount = isEasterEgg ? 80 : 40;
    setSparkles(Array.from({ length: sparkleCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      size: (isEasterEgg ? 2 : 1) + Math.random() * (isEasterEgg ? 5 : 3),
    })));

    setLanterns(Array.from({ length: isEasterEgg ? 15 : 8 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * (isEasterEgg ? 10 : 20),
      duration: (isEasterEgg ? 15 : 25) + Math.random() * 15,
      size: (isEasterEgg ? 20 : 15) + Math.random() * 10,
    })));
  }, [isEasterEgg]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <style>{`
        @keyframes shootingStar {
          0% { transform: translateX(0) translateY(0) rotate(-45deg) scale(0); opacity: 0; }
          5% { opacity: 1; scale: 1; }
          15% { transform: translateX(-600px) translateY(600px) rotate(-45deg) scale(1); opacity: 0; }
          100% { transform: translateX(-600px) translateY(600px) rotate(-45deg) scale(0); opacity: 0; }
        }

        @keyframes sparkleTwinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.5); }
        }

        @keyframes floatUp {
          0% { transform: translateY(110vh) translateX(0); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-20vh) translateX(20px); opacity: 0; }
        }

        @keyframes cometTrail {
          0% { stroke-dashoffset: 1000; opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }

        .shooting-star {
          position: absolute;
          width: 150px;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%);
          filter: drop-shadow(0 0 8px white);
          animation: shootingStar 12s linear infinite;
        }

        .sparkle-dot {
          position: absolute;
          background: white;
          border-radius: 50%;
          filter: blur(0.5px);
          animation: sparkleTwinkle 4s ease-in-out infinite;
          will-change: opacity, transform;
        }

        .anime-silhouette {
          position: absolute;
          transition: all 2000ms ease;
          pointer-events: none;
          will-change: opacity, fill, filter;
        }

        .floating-lantern {
          position: absolute;
          background: rgba(255, 200, 100, 0.4);
          border-radius: 4px;
          box-shadow: 0 0 15px rgba(255, 150, 50, 0.3);
          animation: floatUp linear infinite;
          will-change: transform;
        }

        .comet-path {
          stroke: white;
          stroke-width: 0.5;
          stroke-dasharray: 1000;
          fill: none;
          filter: blur(2px);
          animation: cometTrail 20s linear infinite;
        }
      `}</style>

      {/* Comet Path */}
      <svg className={`absolute inset-0 w-full h-full transition-opacity duration-[2000ms] ${isEasterEgg ? 'opacity-40' : 'opacity-20'}`} viewBox="0 0 1000 1000">
        <path className="comet-path" d="M900,100 Q600,200 100,900" style={{ stroke: isEasterEgg ? '#fbbf24' : 'white' }} />
      </svg>

      {/* Shooting Stars */}
      <div className="shooting-star top-[5%] right-[-15%]" style={{ animationDelay: '0s' }}></div>
      <div className="shooting-star top-[35%] right-[-15%]" style={{ animationDelay: '4s' }}></div>
      <div className="shooting-star top-[65%] right-[-15%]" style={{ animationDelay: '8s' }}></div>

      {/* Floating Lanterns */}
      {lanterns.map((l) => (
        <div
          key={`lantern-${l.id}`}
          className="floating-lantern"
          style={{
            left: `${l.left}%`,
            width: `${l.size}px`,
            height: `${l.size * 1.4}px`,
            animationDuration: `${l.duration}s`,
            animationDelay: `${l.delay}s`,
            backgroundColor: isEasterEgg ? 'rgba(251, 191, 36, 0.5)' : 'rgba(255, 200, 100, 0.4)',
            boxShadow: isEasterEgg ? '0 0 20px rgba(251, 191, 36, 0.5)' : '0 0 15px rgba(255, 150, 50, 0.3)',
          }}
        />
      ))}

      {/* Twinkling Sparkles */}
      {sparkles.map((s) => (
        <div
          key={`sparkle-${s.id}`}
          className="sparkle-dot"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            backgroundColor: isEasterEgg ? '#fde68a' : 'white',
          }}
        />
      ))}

      {/* Silhouettes */}
      <svg 
        className="anime-silhouette bottom-[8%] left-[6%] w-72 h-72" 
        style={{ 
          opacity: isEasterEgg ? 0.3 : 0.05, 
          fill: isEasterEgg ? '#fbbf24' : 'white',
          filter: isEasterEgg ? 'blur(0.5px) drop-shadow(0 0 10px #fbbf24)' : 'blur(1.5px)'
        }} 
        viewBox="0 0 200 200"
      >
        <path d="M100,20 C144.18,20 180,55.82 180,100 C180,144.18 144.18,180 100,180 C80.52,180 62.77,173.04 49,161.5 C68.33,161.5 84,145.83 84,126.5 C84,107.17 68.33,91.5 49,91.5 C62.77,39.96 110,20 100,20 Z" />
      </svg>

      <svg 
        className="anime-silhouette top-[15%] left-[20%] w-16 h-16 rotate-[-20deg]" 
        style={{ opacity: isEasterEgg ? 0.4 : 0.05, fill: 'white' }} 
        viewBox="0 0 24 24"
      >
        <path d="M21 3L3 10.53V11.5L9.84 13.71L21 3M9.84 13.71V18.5L12.56 15.14L9.84 13.71Z" />
      </svg>

      <svg 
        className="anime-silhouette top-[12%] right-[15%] w-56 h-56 rotate-[10deg]" 
        style={{ opacity: isEasterEgg ? 0.2 : 0.05, fill: 'white' }} 
        viewBox="0 0 100 100"
      >
        <path d="M50,10 Q20,10 10,40 Q10,45 50,45 Q90,45 90,40 Q80,10 50,10 Z" />
        <rect x="49" y="45" width="2" height="40" />
      </svg>
    </div>
  );
};

export default AnimeDecorations;
