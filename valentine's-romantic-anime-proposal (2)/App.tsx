
import React, { useState, useRef, useEffect } from 'react';
import { Heart, Volume2, VolumeX, Sparkles } from 'lucide-react';
import SakuraPetals from './components/SakuraPetals.tsx';
import AnimeDecorations from './components/AnimeDecorations.tsx';
import ValentineCard from './components/ValentineCard.tsx';
import Celebration from './components/Celebration.tsx';

const App: React.FC = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isEasterEgg, setIsEasterEgg] = useState(false);
  const [showEasterEggMsg, setShowEasterEggMsg] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chimeRef = useRef<HTMLAudioElement | null>(null);
  const hoverChimeRef = useRef<HTMLAudioElement | null>(null);
  const celebrationSfxRef = useRef<HTMLAudioElement | null>(null);
  const magicSfxRef = useRef<HTMLAudioElement | null>(null);

  const handleAccept = () => {
    setIsAccepted(true);
    if (chimeRef.current) {
      chimeRef.current.volume = 0.6;
      chimeRef.current.play().catch(() => {});
    }
    if (celebrationSfxRef.current) {
      celebrationSfxRef.current.volume = 0.5;
      celebrationSfxRef.current.play().catch(() => {});
    }
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.loop = true;
      audioRef.current.play().then(() => {
        let vol = 0;
        const fade = setInterval(() => {
          if (vol < 0.3) {
            vol += 0.05;
            if (audioRef.current) audioRef.current.volume = vol;
          } else {
            clearInterval(fade);
          }
        }, 200);
      }).catch(() => {});
    }
  };

  const handleEasterEgg = () => {
    if (isEasterEgg) return;
    setIsEasterEgg(true);
    setShowEasterEggMsg(true);
    if (magicSfxRef.current) {
      magicSfxRef.current.volume = 0.4;
      magicSfxRef.current.play().catch(() => {});
    }
    // Auto-dismiss the message after 4 seconds
    setTimeout(() => setShowEasterEggMsg(false), 4000);
  };

  const handleHover = () => {
    if (hoverChimeRef.current && !isAccepted && !isMuted) {
      hoverChimeRef.current.currentTime = 0;
      hoverChimeRef.current.volume = 0.15;
      hoverChimeRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    [audioRef, chimeRef, hoverChimeRef, celebrationSfxRef, magicSfxRef].forEach(ref => {
      if (ref.current) ref.current.muted = nextMuted;
    });
    setIsMuted(nextMuted);
  };

  return (
    <div className={`relative w-full h-screen flex items-center justify-center overflow-hidden transition-colors duration-[2000ms] ${
      isEasterEgg ? 'bg-indigo-950' : 'bg-rose-100'
    }`}>
      {/* Audio Assets */}
      <audio ref={audioRef} src="https://www.chosic.com/wp-content/uploads/2021/04/Warm-Memories-Emotional-Inspiring-Piano.mp3" preload="auto" />
      <audio ref={chimeRef} src="https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3" preload="auto" />
      <audio ref={hoverChimeRef} src="https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3" preload="auto" />
      <audio ref={celebrationSfxRef} src="https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3" preload="auto" />
      <audio ref={magicSfxRef} src="https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3" preload="auto" />

      {/* Dynamic Background Layer */}
      <div 
        className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out will-change-[transform,filter] ${
          isAccepted ? 'blur-2xl scale-125 opacity-60' : 'blur-0 scale-100 opacity-100'
        } ${isEasterEgg ? 'grayscale-[0.2] brightness-75' : 'anime-bg'}`} 
      />
      
      {/* Background Anime Decorations */}
      <AnimeDecorations isEasterEgg={isEasterEgg} />
      <SakuraPetals isEasterEgg={isEasterEgg} />
      
      {/* Easter Egg Message Overlay */}
      {showEasterEggMsg && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none animate-in fade-in zoom-in duration-700">
          <div className="bg-white/10 backdrop-blur-md px-12 py-6 rounded-full border border-white/30 shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center gap-4">
            <Sparkles className="text-yellow-300 animate-spin" size={32} />
            <h3 className="font-pacifico text-4xl text-white drop-shadow-lg">Love is Magic! ✨</h3>
            <Sparkles className="text-yellow-300 animate-spin" size={32} />
          </div>
        </div>
      )}
      
      {/* Main UI */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className={`absolute transition-all duration-700 ease-out will-change-[opacity,transform] ${
          isAccepted ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}>
          <ValentineCard onAccept={handleAccept} onHover={handleHover} onEasterEgg={handleEasterEgg} isEasterEgg={isEasterEgg} />
        </div>
        
        <div className={`absolute w-full h-full transition-all duration-1000 ease-out will-change-[opacity,transform] ${
          isAccepted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-110 translate-y-10 pointer-events-none'
        }`}>
          {isAccepted && <Celebration />}
        </div>
      </div>

      {/* Global Controls */}
      <div className="absolute bottom-6 left-6 z-50 flex gap-4">
        <button 
          onClick={toggleMute}
          className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/40 text-white hover:bg-white/40 transition-all duration-300 shadow-lg active:scale-95 will-change-transform"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      {/* Decorative Hearts */}
      <div className={`absolute top-10 left-10 transition-colors duration-1000 animate-pulse pointer-events-none ${isEasterEgg ? 'text-amber-300' : 'text-pink-500/20'}`}>
        <Heart size={48} fill="currentColor" />
      </div>
      <div className={`absolute bottom-10 right-10 transition-colors duration-1000 animate-pulse delay-700 pointer-events-none ${isEasterEgg ? 'text-purple-400' : 'text-rose-500/20'}`}>
        <Heart size={64} fill="currentColor" />
      </div>
    </div>
  );
};

export default App;
