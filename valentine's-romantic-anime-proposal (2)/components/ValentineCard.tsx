
import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';

interface ValentineCardProps {
  onAccept: () => void;
  onHover: () => void;
  onEasterEgg: () => void;
  isEasterEgg?: boolean;
}

const ValentineCard: React.FC<ValentineCardProps> = ({ onAccept, onHover, onEasterEgg, isEasterEgg }) => {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noRotation, setNoRotation] = useState(0);
  const [isNoInitialized, setIsNoInitialized] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [isShivering, setIsShivering] = useState(false);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (noBtnRef.current) {
      const initialX = window.innerWidth / 2 + 100;
      const initialY = window.innerHeight / 2 + 80;
      setNoPos({ x: initialX, y: initialY });
      setIsNoInitialized(true);
    }
  }, []);

  const handleTitleClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount === 5) {
      onEasterEgg();
      setClickCount(0);
    }
    const title = document.getElementById('main-title');
    if (title) {
      title.classList.add('animate-bounce');
      setTimeout(() => title.classList.remove('animate-bounce'), 500);
    }
  };

  const moveNoButton = (e: MouseEvent) => {
    if (!noBtnRef.current) return;

    const btnRect = noBtnRef.current.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const distance = Math.sqrt(
      Math.pow(e.clientX - btnCenterX, 2) + Math.pow(e.clientY - btnCenterY, 2)
    );

    // Nervous shiver when mouse gets somewhat close
    if (distance < 300 && distance >= 180) {
      setIsShivering(true);
    } else {
      setIsShivering(false);
    }

    // Trigger jump when very close
    if (distance < 180) {
      const padding = 100;
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const btnW = btnRect.width;
      const btnH = btnRect.height;

      // Calculate a new position that is far from current mouse
      let newX = Math.random() * (viewportW - btnW - padding * 2) + padding;
      let newY = Math.random() * (viewportH - btnH - padding * 2) + padding;
      
      // Force it to jump away from the cursor directionally
      const angle = Math.atan2(btnCenterY - e.clientY, btnCenterX - e.clientX);
      const jumpDist = 300 + Math.random() * 200;
      
      newX = btnCenterX + Math.cos(angle) * jumpDist;
      newY = btnCenterY + Math.sin(angle) * jumpDist;

      // Boundary checks
      newX = Math.max(padding, Math.min(newX, viewportW - btnW - padding));
      newY = Math.max(padding, Math.min(newY, viewportH - btnH - padding));

      setNoPos({ x: newX, y: newY });
      setNoRotation((Math.random() - 0.5) * 40); // Add a tumble rotation
      
      setIsBouncing(true);
      setIsShivering(false);
      setTimeout(() => setIsBouncing(false), 600);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', moveNoButton);
    return () => window.removeEventListener('mousemove', moveNoButton);
  }, []);

  return (
    <div className="relative z-10 w-full max-w-md px-4 perspective-1000">
      <style>{`
        @keyframes buttonSpring {
          0% { transform: translate3d(var(--nx), var(--ny), 0) scale(1) rotate(var(--nr)); }
          20% { transform: translate3d(var(--nx), var(--ny), 0) scale(1.4) rotate(calc(var(--nr) * 1.5)); }
          50% { transform: translate3d(var(--nx), var(--ny), 0) scale(0.8) rotate(calc(var(--nr) * 0.8)); }
          80% { transform: translate3d(var(--nx), var(--ny), 0) scale(1.1) rotate(calc(var(--nr) * 1.1)); }
          100% { transform: translate3d(var(--nx), var(--ny), 0) scale(1) rotate(var(--nr)); }
        }
        @keyframes nervousShiver {
          0%, 100% { transform: translate3d(var(--nx), var(--ny), 0) rotate(var(--nr)); }
          25% { transform: translate3d(calc(var(--nx) + 2px), calc(var(--ny) - 2px), 0) rotate(calc(var(--nr) + 1deg)); }
          75% { transform: translate3d(calc(var(--nx) - 2px), calc(var(--ny) + 2px), 0) rotate(calc(var(--nr) - 1deg)); }
        }
        @keyframes idleFloat {
          0%, 100% { transform: translate3d(var(--nx), var(--ny), 0) rotate(var(--nr)); }
          50% { transform: translate3d(var(--nx), calc(var(--ny) - 10px), 0) rotate(calc(var(--nr) + 2deg)); }
        }
        .animate-no-jump {
          animation: buttonSpring 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-no-shiver {
          animation: nervousShiver 0.15s linear infinite;
        }
        .animate-no-idle {
          animation: idleFloat 3s ease-in-out infinite;
        }
      `}</style>

      <div className={`bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(255,182,193,0.5)] rounded-[3rem] p-10 text-center transform transition-all duration-500 hover:rotate-1 will-change-transform ${
        isEasterEgg ? 'border-amber-200/50 shadow-amber-400/20' : ''
      }`}>
        <div className="flex justify-center mb-8">
          <div className="relative scale-125">
            <Heart className={`${isEasterEgg ? 'text-amber-400' : 'text-rose-500'} animate-bounce`} size={80} fill="currentColor" />
            <div className={`absolute inset-0 blur-3xl opacity-40 animate-pulse ${isEasterEgg ? 'bg-amber-400' : 'bg-rose-400'}`}></div>
          </div>
        </div>
        
        <h1 
          id="main-title"
          onClick={handleTitleClick}
          className={`text-4xl md:text-5xl font-pacifico mb-12 drop-shadow-sm leading-tight select-none cursor-pointer transition-colors duration-1000 ${
            isEasterEgg ? 'text-amber-100' : 'text-rose-600'
          }`}
        >
          Will you be my Valentine? ❤️
        </h1>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 h-32">
          <button
            onClick={onAccept}
            onMouseEnter={onHover}
            className={`group relative px-12 py-5 bg-gradient-to-br text-white font-bold text-2xl rounded-full shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 active:scale-95 z-20 overflow-hidden ${
              isEasterEgg ? 'from-amber-400 to-orange-500 shadow-amber-400/30' : 'from-rose-400 to-pink-600 shadow-rose-400/50'
            }`}
          >
            <span className="relative z-10 drop-shadow-md">YES 💖</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>

          <div className="w-40 h-16 hidden sm:block pointer-events-none"></div>
        </div>
      </div>

      <button
        ref={noBtnRef}
        className={`fixed top-0 left-0 px-16 py-8 font-extrabold text-3xl rounded-full shadow-2xl border-2 transition-transform duration-500 ease-out z-[99999] whitespace-nowrap cursor-none select-none pointer-events-none will-change-transform ${
          isBouncing ? 'animate-no-jump' : isShivering ? 'animate-no-shiver' : 'animate-no-idle'
        } ${
          isEasterEgg 
            ? 'bg-amber-50/95 text-amber-500 border-amber-200' 
            : 'bg-white/95 text-rose-300 border-rose-100'
        }`}
        style={{
          transform: `translate3d(${noPos.x}px, ${noPos.y}px, 0) rotate(${noRotation}deg)`,
          opacity: isNoInitialized ? 1 : 0,
          //@ts-ignore
          '--nx': `${noPos.x}px`,
          '--ny': `${noPos.y}px`,
          '--nr': `${noRotation}deg`,
        }}
        tabIndex={-1}
      >
        {isEasterEgg ? 'MAYBE? ❤️' : 'NO 😢'}
      </button>
    </div>
  );
};

export default ValentineCard;
