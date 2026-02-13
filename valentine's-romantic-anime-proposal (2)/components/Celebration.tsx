
import React, { useEffect, useState } from 'react';
import { Heart, Sparkles, Share2, Check, Star } from 'lucide-react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  shape: 'square' | 'circle' | 'triangle' | 'heart' | 'star';
  tilt: number;
  type: 'burst-center' | 'cannon-left' | 'cannon-right' | 'shower';
  wobble: number;
}

const Celebration: React.FC = () => {
  const [hearts, setHearts] = useState<{ id: number; left: number; size: number; delay: number }[]>([]);
  const [particles, setParticles] = useState<{ id: number; left: number; top: number; delay: number }[]>([]);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isShared, setIsShared] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const colors = [
    '#ff69b4', '#ff1493', '#ffd700', '#ff4500', 
    '#00ced1', '#9370db', '#ff6347', '#ffffff',
    '#ff00ff', '#7fff00', '#00ffff', '#ffa500'
  ];

  const shapes: ('square' | 'circle' | 'triangle' | 'heart' | 'star')[] = ['square', 'circle', 'triangle', 'heart', 'star'];

  useEffect(() => {
    // Generate floating hearts background
    setHearts(Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 15 + Math.random() * 40,
      delay: Math.random() * 8,
    })));

    // Generate shimmer particles background
    setParticles(Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
    })));

    // 1. Center Burst
    const burstPieces = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: 50,
      y: 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 12,
      delay: Math.random() * 0.2,
      duration: 1.5 + Math.random() * 2,
      rotation: Math.random() * 360,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      tilt: Math.random() * 360,
      type: 'burst-center' as const,
      wobble: Math.random() * 10,
    }));

    // 2. Corner Cannons (Left and Right)
    const leftCannon = Array.from({ length: 60 }).map((_, i) => ({
      id: i + 100,
      x: 0,
      y: 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 10 + Math.random() * 10,
      delay: 0.1 + Math.random() * 0.3,
      duration: 2 + Math.random() * 2.5,
      rotation: Math.random() * 360,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      tilt: Math.random() * 360,
      type: 'cannon-left' as const,
      wobble: Math.random() * 15,
    }));

    const rightCannon = Array.from({ length: 60 }).map((_, i) => ({
      id: i + 160,
      x: 100,
      y: 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 10 + Math.random() * 10,
      delay: 0.1 + Math.random() * 0.3,
      duration: 2 + Math.random() * 2.5,
      rotation: Math.random() * 360,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      tilt: Math.random() * 360,
      type: 'cannon-right' as const,
      wobble: Math.random() * 15,
    }));

    // 3. Continuous Shower
    const showerPieces = Array.from({ length: 180 }).map((_, i) => ({
      id: i + 220,
      x: Math.random() * 100,
      y: -20 - Math.random() * 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 10,
      delay: 0.5 + Math.random() * 12,
      duration: 5 + Math.random() * 8,
      rotation: Math.random() * 360,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      tilt: Math.random() * 360,
      type: 'shower' as const,
      wobble: Math.random() * 20,
    }));

    setConfetti([...burstPieces, ...leftCannon, ...rightCannon, ...showerPieces]);

    // Trigger the Cinematic End sequence (zoom out and fade to black)
    // We start the transition 2 seconds after mount so the user sees the initial celebration burst
    const endTimer = setTimeout(() => {
      setIsEnding(true);
    }, 2000);

    return () => clearTimeout(endTimer);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: "Will You Be My Valentine? ❤️",
      text: "Look at this romantic proposal! ✨",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  return (
    <div className="relative z-20 w-full min-h-screen flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-1000 overflow-hidden">
      
      {/* Cinematic Finale Overlay - Set to exactly 5 seconds duration */}
      <div 
        className={`fixed inset-0 bg-black z-[100] transition-opacity duration-[5000ms] ease-in-out pointer-events-none flex flex-col items-center justify-center will-change-opacity ${
          isEnding ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className={`transition-all duration-[3000ms] delay-[3000ms] text-center will-change-[opacity,transform] ${isEnding ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <p className="font-pacifico text-4xl text-rose-300 drop-shadow-[0_0_15px_rgba(255,182,193,0.8)] mb-4">Forever Together.</p>
          <div className="flex justify-center gap-2">
            <Heart size={16} className="text-rose-400 fill-rose-400 animate-pulse" />
            <Heart size={16} className="text-rose-400 fill-rose-400 animate-pulse delay-150" />
            <Heart size={16} className="text-rose-400 fill-rose-400 animate-pulse delay-300" />
          </div>
        </div>
      </div>

      {/* Confetti Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <style>{`
          @keyframes confettiBurstCenter {
            0% { transform: translate3d(0, 0, 0) scale(0) rotate(0deg); opacity: 1; }
            100% { transform: translate3d(var(--tx), var(--ty), 0) scale(1) rotate(var(--tr)); opacity: 0; }
          }
          @keyframes confettiCannonLeft {
            0% { transform: translate3d(0, 0, 0) scale(0) rotate(0deg); opacity: 1; }
            100% { transform: translate3d(var(--tx-cannon), var(--ty-cannon), 0) scale(1.2) rotate(var(--tr)); opacity: 0; }
          }
          @keyframes confettiCannonRight {
            0% { transform: translate3d(0, 0, 0) scale(0) rotate(0deg); opacity: 1; }
            100% { transform: translate3d(var(--tx-cannon), var(--ty-cannon), 0) scale(1.2) rotate(var(--tr)); opacity: 0; }
          }
          @keyframes confettiShower {
            0% { transform: translate3d(0, 0, 0) rotate(0deg) rotateX(0deg); opacity: 1; }
            25% { transform: translate3d(var(--wobble), 25vh, 0) rotate(90deg) rotateX(180deg); }
            50% { transform: translate3d(calc(-1 * var(--wobble)), 50vh, 0) rotate(180deg) rotateX(360deg); }
            75% { transform: translate3d(var(--wobble), 75vh, 0) rotate(270deg) rotateX(540deg); }
            100% { transform: translate3d(0, 120vh, 0) rotate(360deg) rotateX(720deg); opacity: 0; }
          }
          @keyframes floatHeart {
            0% { transform: translate3d(0, 110vh, 0) scale(0.5) rotate(0deg); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.8; }
            100% { transform: translate3d(0, -10vh, 0) scale(1.2) rotate(360deg); opacity: 0; }
          }
          .confetti-piece {
            position: absolute;
            will-change: transform, opacity;
          }
          .animate-confetti-burst-center { animation: confettiBurstCenter cubic-bezier(0.1, 0.9, 0.2, 1) forwards; }
          .animate-confetti-cannon-left { animation: confettiCannonLeft cubic-bezier(0.1, 0.8, 0.3, 1) forwards; }
          .animate-confetti-cannon-right { animation: confettiCannonRight cubic-bezier(0.1, 0.8, 0.3, 1) forwards; }
          .animate-confetti-shower { animation: confettiShower linear infinite; }
          
          .shape-heart { clip-path: path('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'); }
          .shape-star { clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); }
          .shape-triangle { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
          .shape-square { border-radius: 2px; }
          .shape-circle { border-radius: 50%; }
        `}</style>

        {confetti.map((c) => {
          const tx = (Math.random() - 0.5) * 1200;
          const ty = (Math.random() - 0.7) * 1000;
          const tr = 720 + Math.random() * 1080;
          const txCannon = c.type === 'cannon-left' ? (400 + Math.random() * 600) : (-400 - Math.random() * 600);
          const tyCannon = -600 - Math.random() * 500;
          const animationClass = `animate-confetti-${c.type}`;
          
          return (
            <div
              key={`confetti-${c.id}`}
              className={`confetti-piece shape-${c.shape} ${animationClass}`}
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                width: `${c.size}px`,
                height: `${c.size}px`,
                backgroundColor: c.color,
                animationDuration: `${c.duration}s`,
                animationDelay: `${c.delay}s`,
                //@ts-ignore
                '--tx': `${tx}px`,
                '--ty': `${ty}px`,
                '--tr': `${tr}deg`,
                '--tx-cannon': `${txCannon}px`,
                '--ty-cannon': `${tyCannon}px`,
                '--wobble': `${c.wobble}px`,
                boxShadow: `0 0 10px ${c.color}cc`,
              }}
            />
          );
        })}

        {/* Floating Hearts Background */}
        {hearts.map((h) => (
          <div
            key={`heart-bg-${h.id}`}
            className="floating-heart-el text-rose-400/30"
            style={{
              left: `${h.left}%`,
              animationDelay: `${h.delay}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          >
            <Heart size={h.size} fill="currentColor" />
          </div>
        ))}
      </div>

      {/* Main UI Content - The "zoom out and fade" logic is here */}
      <div className={`w-full h-full flex flex-col items-center justify-center transition-all duration-[5000ms] ease-in-out transform-gpu will-change-[transform,opacity,filter] ${
        isEnding ? 'scale-50 opacity-0 blur-3xl grayscale brightness-0' : 'scale-100 opacity-100 blur-0 grayscale-0 brightness-100'
      }`}>
        
        <div className="relative z-30 text-center max-w-2xl w-full flex flex-col items-center">
          <h2 className="text-5xl md:text-8xl font-pacifico text-white mb-10 drop-shadow-[0_10px_50px_rgba(225,29,72,1)] animate-bounce">
            Yay! I love you! ❤️
          </h2>
          
          <div className="relative group inline-block scale-95 md:scale-105 transition-all duration-700 hover:scale-110">
            <div className="absolute -inset-20 bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 rounded-[5rem] animate-romantic-glow opacity-80 blur-[60px]"></div>
            <div className="absolute -inset-16 bg-gradient-to-bl from-pink-500 via-rose-400 to-rose-600 rounded-[5rem] animate-aura-rotate opacity-50 blur-[70px] mix-blend-screen"></div>
            
            <div className="relative bg-white/40 backdrop-blur-3xl border-[10px] border-white/95 p-6 rounded-[3rem] shadow-[0_50px_120px_rgba(0,0,0,0.6)] overflow-hidden">
              <img 
                src="love.gif" 
                alt="Love Celebration" 
                className="w-full h-auto rounded-[2rem] min-w-[340px] max-h-[55vh] object-contain shadow-inner relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHYxdmZ5eXN5eXN5eXN5eXN5eXN5eXN5eXN5eXN5eXN5eXN5JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/MDJ9IbxxvDUQM/giphy.gif";
                }}
              />
              <Sparkles className="absolute top-8 left-8 text-yellow-300 animate-spin-slow z-20" size={56} style={{ animationDuration: '10s' }} />
              <Sparkles className="absolute bottom-8 right-8 text-amber-300 animate-spin-slow z-20" size={56} style={{ animationDuration: '7s' }} />
            </div>
          </div>
          
          <div className="mt-16 space-y-10 flex flex-col items-center">
            <p className="text-white font-pacifico text-4xl md:text-6xl drop-shadow-2xl animate-pulse">
              Best Valentine's Ever! ✨
            </p>
            
            <div className="flex flex-col gap-6 items-center">
              <button
                onClick={handleShare}
                className="flex items-center gap-4 px-10 py-5 bg-white/20 backdrop-blur-2xl border-2 border-white/50 rounded-full text-white font-bold text-2xl shadow-2xl hover:bg-white/40 hover:scale-105 transition-all duration-300 group active:scale-95"
              >
                {isShared ? (
                  <>
                    <Check size={28} className="text-emerald-300" />
                    <span>Memory Saved! 💌</span>
                  </>
                ) : (
                  <>
                    <Share2 size={28} className="group-hover:rotate-12 transition-transform" />
                    <span>Share our Love 💌</span>
                  </>
                )}
              </button>
              
              <div className="flex justify-center gap-8 items-center mt-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="text-yellow-300 fill-yellow-300 animate-pulse shadow-xl" size={32} style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Celebration;
