
import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  drift: number;
  midDrift: number; // For curved paths
  swaySpeed: number;
  swayAmount: number;
  swayDelay: number;
  opacity: number;
  flipSpeed: number;
  flipDirection: string;
  petalType: 'sakura' | 'heart' | 'leaf';
  colorIndex: number;
  timingFunc: string;
}

interface SakuraPetalsProps {
  isEasterEgg?: boolean;
}

const SakuraPetals: React.FC<SakuraPetalsProps> = ({ isEasterEgg }) => {
  const [petals, setPetals] = useState<Petal[]>([]);

  const timingFunctions = [
    'cubic-bezier(0.25, 0.1, 0.25, 1)',
    'cubic-bezier(0.42, 0, 1, 1)',
    'cubic-bezier(0, 0, 0.58, 1)',
    'cubic-bezier(0.37, 0, 0.63, 1)',
    'ease-in-out'
  ];

  useEffect(() => {
    const count = isEasterEgg ? 180 : 80;
    const types: ('sakura' | 'heart' | 'leaf')[] = ['sakura', 'heart', 'leaf'];
    
    const newPetals = Array.from({ length: count }).map((_, i) => {
      const drift = (Math.random() - 0.5) * (isEasterEgg ? 1000 : 700);
      return {
        id: i,
        left: Math.random() * 120 - 10,
        delay: Math.random() * -45,
        duration: (isEasterEgg ? 5 : 12) + Math.random() * (isEasterEgg ? 8 : 20),
        size: 6 + Math.random() * (isEasterEgg ? 30 : 20),
        rotation: Math.random() * 360,
        drift: drift,
        midDrift: drift * (0.3 + Math.random() * 0.4), // Midway curve
        swaySpeed: 2 + Math.random() * 4,
        swayAmount: 20 + Math.random() * 50,
        swayDelay: Math.random() * -5,
        opacity: (isEasterEgg ? 0.6 : 0.3) + Math.random() * 0.4,
        flipSpeed: 1.5 + Math.random() * 6,
        flipDirection: Math.random() > 0.5 ? 'normal' : 'reverse',
        petalType: types[Math.floor(Math.random() * types.length)],
        colorIndex: Math.floor(Math.random() * 3),
        timingFunc: timingFunctions[Math.floor(Math.random() * timingFunctions.length)],
      };
    });
    setPetals(newPetals);
  }, [isEasterEgg]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes driftFall {
          0% { 
            transform: translate3d(0, -10vh, 0) rotate(0deg); 
            opacity: 0; 
          }
          10% { opacity: var(--op); }
          50% {
            transform: translate3d(var(--mid-drift), 55vh, 0) rotate(calc(var(--rot) * 0.5));
          }
          90% { opacity: var(--op); }
          100% { 
            transform: translate3d(var(--drift), 110vh, 0) rotate(var(--rot)); 
            opacity: 0; 
          }
        }
        
        @keyframes 3dTumble {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(var(--start-rot)); }
          100% { transform: rotateX(360deg) rotateY(180deg) rotateZ(calc(var(--start-rot) + 360deg)); }
        }

        @keyframes organicSway {
          0%, 100% { transform: translate3d(calc(-1 * var(--sway)), 0, 0) rotateZ(-10deg); }
          50% { transform: translate3d(var(--sway), 0, 0) rotateZ(10deg); }
        }

        .petal-container {
          position: absolute;
          perspective: 800px;
          will-change: transform, opacity;
        }

        .petal-sway {
          width: 100%;
          height: 100%;
          animation: organicSway ease-in-out infinite;
          will-change: transform;
        }

        .petal-shape {
          width: 100%;
          height: 100%;
          animation: 3dTumble linear infinite;
          transform-style: preserve-3d;
          will-change: transform;
        }

        /* Shape Variances */
        .type-sakura { border-radius: 150% 15% 150% 15%; }
        .type-heart { clip-path: path('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'); transform: scale(0.6); }
        .type-leaf { border-radius: 100% 0% 100% 0%; }

        /* Color Gradients */
        .color-0 { background: linear-gradient(135deg, #ffd1dc, #ff8fa3); }
        .color-1 { background: linear-gradient(135deg, #fff0f5, #ffb7c5); }
        .color-2 { background: linear-gradient(135deg, #ffc0cb, #ee9ca7); }
        
        /* Easter Egg Gold Colors */
        .magic-0 { background: linear-gradient(135deg, #fff7ad, #ffde59); }
        .magic-1 { background: linear-gradient(135deg, #fde68a, #fbbf24); }
        .magic-2 { background: linear-gradient(135deg, #fef3c7, #f59e0b); }
      `}</style>
      
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal-container"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `driftFall ${p.duration}s ${p.timingFunc} ${p.delay}s infinite`,
            //@ts-ignore
            '--drift': `${p.drift}px`,
            '--mid-drift': `${p.midDrift}px`,
            '--rot': `${360 + p.rotation}deg`,
            '--op': p.opacity,
            '--sway': `${p.swayAmount}px`,
          }}
        >
          <div 
            className="petal-sway" 
            style={{ 
              animationDuration: `${p.swaySpeed}s`,
              animationDelay: `${p.swayDelay}s`,
            }}
          >
            <div 
              className={`petal-shape type-${p.petalType} ${isEasterEgg ? `magic-${p.colorIndex}` : `color-${p.colorIndex}`}`}
              style={{
                animationDuration: `${p.flipSpeed}s`,
                animationDirection: p.flipDirection as any,
                //@ts-ignore
                '--start-rot': `${p.rotation}deg`,
                boxShadow: isEasterEgg ? '0 0 10px rgba(251, 191, 36, 0.4)' : 'none',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SakuraPetals;
