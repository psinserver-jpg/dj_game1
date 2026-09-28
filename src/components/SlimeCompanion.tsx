import React, { useState } from 'react';

interface SlimeCompanionProps {
  moves: number;
  comboCount: number;
  isWon: boolean;
}

export const SlimeCompanion: React.FC<SlimeCompanionProps> = ({
  moves,
  comboCount,
  isWon
}) => {
  const [isPoked, setIsPoked] = useState(false);

  // Expression calculation
  let mood = 'happy';
  let dialogue = '반가워! 보석을 맞춰봐~ ✨';

  if (isWon) {
    mood = 'celebrate';
    dialogue = '와아아!! 대성공이야! 🎉';
  } else if (comboCount >= 3) {
    mood = 'excited';
    dialogue = `${comboCount}연속 콤보 대박!! 🔥`;
  } else if (moves <= 3) {
    mood = 'worried';
    dialogue = '남은 턴이 얼마 없어! 힘내! 💦';
  }

  const handlePoke = () => {
    setIsPoked(true);
    setTimeout(() => setIsPoked(false), 800);
  };

  return (
    <div className="relative flex items-center justify-end pr-4 -mb-3 pointer-events-auto">
      {/* Sunburst background rays behind slime (matching reference image) */}
      <div className="absolute right-3 top-[-10px] w-28 h-28 opacity-40 pointer-events-none animate-spin" style={{ animationDuration: '24s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-200">
          {[...Array(12)].map((_, i) => (
            <polygon
              key={i}
              points="50,50 46,0 54,0"
              fill="currentColor"
              transform={`rotate(${i * 30} 50 50)`}
            />
          ))}
        </svg>
      </div>

      {/* Floating speech bubble */}
      <div className="absolute -top-7 right-20 bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-red-100 text-[11px] font-bold text-rose-800 whitespace-nowrap animate-bounce" style={{ animationDuration: '2.5s' }}>
        {dialogue}
        {/* Tail */}
        <div className="absolute top-2 -right-1 w-2 h-2 bg-white rotate-45 border-t border-r border-red-100"></div>
      </div>

      {/* Slime Character Mascot */}
      <button
        onClick={handlePoke}
        className={`relative z-10 cursor-pointer focus:outline-none transition-transform duration-300 ${
          isPoked ? 'scale-125 rotate-12' : 'hover:scale-110 active:scale-95 animate-bounce'
        }`}
        style={{ animationDuration: '2s' }}
        title="슬라임을 터치해보세요!"
      >
        <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-xl">
          <defs>
            {/* Glowing Red Gradient */}
            <radialGradient id="mascotSlime" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ff7b89" />
              <stop offset="45%" stopColor="#f43f5e" />
              <stop offset="85%" stopColor="#be123c" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>
            <linearGradient id="eyeSpecular" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Droplet Crown Point */}
          <path
            d="M 50 10 C 65 30 85 45 85 65 C 85 85 70 94 50 94 C 30 94 15 85 15 65 C 15 45 35 30 50 10 Z"
            fill="url(#mascotSlime)"
            stroke="#9f1239"
            strokeWidth="2"
          />

          {/* Glossy Head Highlight */}
          <ellipse cx="42" cy="30" rx="14" ry="7" transform="rotate(-20 42 30)" fill="#ffffff" opacity="0.45" />

          {/* Left Eye */}
          <ellipse cx="38" cy="58" rx="6.5" ry="9" fill="#1c1917" />
          <ellipse cx="36" cy="54" rx="3.5" ry="5" fill="url(#eyeSpecular)" />
          <circle cx="41" cy="62" r="1.5" fill="#ffffff" />

          {/* Right Eye */}
          <ellipse cx="62" cy="58" rx="6.5" ry="9" fill="#1c1917" />
          <ellipse cx="60" cy="54" rx="3.5" ry="5" fill="url(#eyeSpecular)" />
          <circle cx="65" cy="62" r="1.5" fill="#ffffff" />

          {/* Cheerful Blush */}
          <ellipse cx="28" cy="67" rx="5" ry="3" fill="#fca5a5" opacity="0.75" />
          <ellipse cx="72" cy="67" rx="5" ry="3" fill="#fca5a5" opacity="0.75" />

          {/* Mouth (Dynamic based on mood) */}
          {mood === 'worried' ? (
            <ellipse cx="50" cy="72" rx="4" ry="4" fill="#9f1239" />
          ) : (
            <path
              d="M 44 68 Q 50 76 56 68"
              stroke="#ffffff"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>
    </div>
  );
};
