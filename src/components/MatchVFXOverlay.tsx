import React from 'react';
import { Particle, PopEffect } from '../types/game';

interface MatchVFXOverlayProps {
  popEffects: PopEffect[];
  particles: Particle[];
  rows: number;
  cols: number;
}

export const MatchVFXOverlay: React.FC<MatchVFXOverlayProps> = ({
  popEffects,
  particles,
  rows,
  cols
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden">
      {/* Shockwaves and Star sparkles at match locations */}
      {popEffects.map((pop) => {
        const leftPercent = ((pop.col + 0.5) / cols) * 100;
        const topPercent = ((pop.row + 0.5) / rows) * 100;

        return (
          <div
            key={pop.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
            style={{
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
              width: '80px',
              height: '80px',
            }}
          >
            {/* Outer Expanding Shockwave Ring */}
            <div
              className="absolute inset-0 rounded-full border-2 animate-shockwave"
              style={{
                borderColor: pop.color,
                boxShadow: `0 0 15px ${pop.color}`
              }}
            />

            {/* Sparkle Star Burst */}
            <svg
              viewBox="0 0 64 64"
              className="w-10 h-10 animate-sparkle drop-shadow-[0_0_8px_#ffffff]"
              style={{ color: pop.color }}
            >
              {/* 4-point Diamond Star */}
              <polygon
                points="32,4 37,27 60,32 37,37 32,60 27,37 4,32 27,27"
                fill="currentColor"
              />
              <circle cx="32" cy="32" r="6" fill="#ffffff" />
            </svg>
          </div>
        );
      })}

      {/* Burst and Celebratory Confetti Particles */}
      {particles.map((p) => {
        const shape = p.shape || 'circle';
        const isRibbon = shape === 'ribbon';
        const isSquare = shape === 'square';
        const isStar = shape === 'star';

        return (
          <div
            key={p.id}
            className={`absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
              isSquare ? 'rounded-xs' : isRibbon ? 'rounded-[1px]' : isStar ? '' : 'rounded-full'
            }`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: isRibbon ? `${p.size * 2.2}px` : `${p.size}px`,
              height: isRibbon ? `${p.size * 0.8}px` : `${p.size}px`,
              backgroundColor: isStar ? 'transparent' : p.color,
              boxShadow: isStar ? 'none' : `0 0 6px ${p.color}`,
              transform: `translate(-50%, -50%) rotate(${p.rotation || 0}deg)`,
              opacity: Math.max(0, p.life)
            }}
          >
            {isStar && (
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full drop-shadow-[0_0_4px_currentColor]"
                style={{ color: p.color }}
              >
                <polygon
                  points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8"
                  fill="currentColor"
                />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};
