import React from 'react';
import { GemType, SpecialType, ObstacleType } from '../types/game';

interface GemIconProps {
  type: GemType | null;
  special?: SpecialType;
  obstacle?: ObstacleType;
  obstacleHp?: number;
  size?: number;
  className?: string;
  isMatched?: boolean;
}

export const GemIcon: React.FC<GemIconProps> = ({
  type,
  special = 'none',
  obstacle = 'none',
  obstacleHp,
  size = 48,
  className = '',
  isMatched = false
}) => {
  return (
    <div 
      className={`relative flex items-center justify-center transition-transform select-none ${
        isMatched ? 'animate-gem-pop z-30' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Pop flash when matched */}
      {isMatched && (
        <div className="absolute inset-0 rounded-full bg-white/80 animate-ping pointer-events-none z-40" />
      )}

      {/* 1. STAR (Yellow Gold Star - Simple & Crisp) */}
      {type === 'star' && (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
          <defs>
            <linearGradient id="starBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
            <radialGradient id="starCore" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="35%" stopColor="#fde047" />
              <stop offset="80%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </radialGradient>
          </defs>
          {/* Gold Star Outline */}
          <polygon
            points="32,5 40,22 59,23 44,35 49,54 32,43 15,54 20,35 5,23 24,22"
            fill="url(#starBorder)"
            stroke="#78350f"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Inner Core */}
          <polygon
            points="32,9 38,23 54,24 41,34 45,50 32,40 19,50 23,34 10,24 26,23"
            fill="url(#starCore)"
          />
          {/* Specular Sparkle */}
          <circle cx="28" cy="22" r="3.2" fill="#ffffff" opacity="0.9" />
          <ellipse cx="32" cy="28" rx="2" ry="1" fill="#fef08a" opacity="0.75" />
        </svg>
      )}

      {/* 2. DIAMOND (Green Emerald Rhombus - Simple & Crisp) */}
      {type === 'diamond' && (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
          <defs>
            <linearGradient id="diamondBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bbf7d0" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
            <linearGradient id="emeraldCore" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="40%" stopColor="#22c55e" />
              <stop offset="85%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
          </defs>
          {/* Gold / Green Rim */}
          <polygon points="32,4 58,32 32,60 6,32" fill="url(#diamondBorder)" stroke="#14532d" strokeWidth="2" strokeLinejoin="round" />
          {/* Inner Facet */}
          <polygon points="32,9 53,32 32,55 11,32" fill="url(#emeraldCore)" />
          {/* Center Table Facet */}
          <polygon points="32,18 45,32 32,46 19,32" fill="#4ade80" opacity="0.85" />
          {/* Highlight Specular */}
          <circle cx="26" cy="24" r="3.2" fill="#ffffff" opacity="0.9" />
        </svg>
      )}

      {/* 3. CIRCLE (Red Ruby Sphere - Simple & Crisp) */}
      {type === 'circle' && (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
          <defs>
            <linearGradient id="rubyBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fecdd3" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
            <radialGradient id="rubyCore" cx="35%" cy="32%" r="68%">
              <stop offset="0%" stopColor="#fee2e2" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="70%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>
          </defs>
          {/* Outer Rim */}
          <circle cx="32" cy="32" r="26" fill="url(#rubyBorder)" stroke="#881337" strokeWidth="2" />
          {/* Inner Ruby Sphere */}
          <circle cx="32" cy="32" r="21" fill="url(#rubyCore)" />
          {/* Glossy Curved Highlight */}
          <ellipse cx="26" cy="23" rx="7.5" ry="4.5" transform="rotate(-30 26 23)" fill="#ffffff" opacity="0.75" />
          <circle cx="23" cy="21" r="2.2" fill="#ffffff" opacity="0.95" />
        </svg>
      )}

      {/* 4. OCTAGON / SQUARE (Blue Sapphire - Simple & Crisp) */}
      {type === 'octagon' && (
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
          <defs>
            <linearGradient id="sapphireBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>
            <radialGradient id="sapphireCore" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="35%" stopColor="#38bdf8" />
              <stop offset="75%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
          </defs>
          {/* 8-sided Rim */}
          <polygon
            points="20,6 44,6 58,20 58,44 44,58 20,58 6,44 6,20"
            fill="url(#sapphireBorder)"
            stroke="#075985"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Inner Blue Octagon */}
          <polygon
            points="22,11 42,11 53,22 53,42 42,53 22,53 11,42 11,22"
            fill="url(#sapphireCore)"
          />
          {/* Center Table Facet */}
          <polygon
            points="26,18 38,18 45,25 45,39 38,46 26,46 19,39 19,25"
            fill="#7dd3fc"
            opacity="0.8"
          />
          {/* Specular White Highlight */}
          <circle cx="26" cy="22" r="3.2" fill="#ffffff" opacity="0.9" />
        </svg>
      )}

      {/* SPECIAL BOMBS: 가로 폭탄 (Row), 세로 폭탄 (Col), 십자 폭탄 (Cross) */}
      {special === 'horizontal_bomb' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          {/* Horizontal Laser Guide */}
          <div className="absolute w-[115%] h-3 bg-gradient-to-r from-red-500 via-amber-300 to-red-500 rounded-full shadow-[0_0_12px_#f59e0b] animate-pulse opacity-95" />
          <div className="absolute flex justify-between w-[110%] px-0.5 text-[10px] font-black text-amber-200">
            <span>◀</span>
            <span>▶</span>
          </div>
          {/* Center Bomb Icon */}
          <div className="relative z-10 w-6 h-6 rounded-full bg-slate-950/95 border-2 border-amber-300 flex items-center justify-center shadow-lg">
            <span className="text-[12px] leading-none">💣</span>
          </div>
          <span className="absolute -bottom-1 text-[8px] font-black text-amber-300 bg-black/85 px-1 rounded shadow border border-amber-500/50">
            가로
          </span>
        </div>
      )}

      {special === 'vertical_bomb' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          {/* Vertical Laser Guide */}
          <div className="absolute h-[115%] w-3 bg-gradient-to-b from-red-500 via-amber-300 to-red-500 rounded-full shadow-[0_0_12px_#f59e0b] animate-pulse opacity-95" />
          <div className="absolute flex flex-col justify-between h-[110%] py-0.5 text-[10px] font-black text-amber-200">
            <span>▲</span>
            <span>▼</span>
          </div>
          {/* Center Bomb Icon */}
          <div className="relative z-10 w-6 h-6 rounded-full bg-slate-950/95 border-2 border-amber-300 flex items-center justify-center shadow-lg">
            <span className="text-[12px] leading-none">💣</span>
          </div>
          <span className="absolute -bottom-1 text-[8px] font-black text-amber-300 bg-black/85 px-1 rounded shadow border border-amber-500/50">
            세로
          </span>
        </div>
      )}

      {special === 'cross_bomb' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="absolute w-[115%] h-2.5 bg-gradient-to-r from-rose-500 via-white to-rose-500 rounded-full shadow-[0_0_15px_#f43f5e] animate-pulse" />
          <div className="absolute h-[115%] w-2.5 bg-gradient-to-b from-rose-500 via-white to-rose-500 rounded-full shadow-[0_0_15px_#f43f5e] animate-pulse" />
          <div className="relative z-10 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 border-2 border-white flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-[13px] leading-none">💥</span>
          </div>
          <span className="absolute -bottom-1 text-[8px] font-black text-white bg-red-600/90 px-1 rounded shadow border border-white/60">
            십자
          </span>
        </div>
      )}

      {/* CAGED OBSTACLE OVERLAY (if any) */}
      {obstacle === 'caged' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-15">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <line x1="8" y1="8" x2="56" y2="56" stroke="#fbbf24" strokeWidth="4" strokeDasharray="5 3" />
            <line x1="56" y1="8" x2="8" y2="56" stroke="#fbbf24" strokeWidth="4" strokeDasharray="5 3" />
            <circle cx="32" cy="32" r="6" fill="#d97706" stroke="#fef08a" strokeWidth="2" />
          </svg>
        </div>
      )}

      {/* JAR SLIME OBSTACLE */}
      {obstacle === 'jar_slime' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-15">
          <div className="relative flex flex-col items-center">
            <span className="text-2xl filter drop-shadow">🍯</span>
            {obstacleHp && (
              <span className="text-[9px] font-black bg-rose-600 text-white rounded-full px-1 shadow border border-white -mt-1">
                HP {obstacleHp}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
