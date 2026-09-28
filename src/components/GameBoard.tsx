import React, { useState, useRef } from 'react';
import { Cell, BeamEffect, FloatingText, PopEffect, Particle } from '../types/game';
import { GemIcon } from './GemIcon';
import { MatchVFXOverlay } from './MatchVFXOverlay';

interface GameBoardProps {
  grid: Cell[][];
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
  onSwipe: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
  beamEffects: BeamEffect[];
  floatingTexts: FloatingText[];
  popEffects: PopEffect[];
  particles: Particle[];
  hammerActive: boolean;
  isProcessing: boolean;
  isShaking: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  selectedCell,
  onCellClick,
  onSwipe,
  beamEffects,
  floatingTexts,
  popEffects,
  particles,
  hammerActive,
  isProcessing,
  isShaking
}) => {
  const [dragState, setDragState] = useState<{
    row: number;
    col: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    isDragging: boolean;
  } | null>(null);

  const [hoverTarget, setHoverTarget] = useState<{ row: number; col: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const rows = grid.length;
  const cols = grid[0]?.length || 8;

  // Mouse & Touch Pointer Handlers for lifting and dragging gems
  const handlePointerDown = (row: number, col: number, e: React.PointerEvent) => {
    if (hammerActive || isProcessing) return;
    if (e.button !== 0) return; // Only primary mouse button

    const cell = grid[row][col];
    if (!cell.gemType && cell.obstacle === 'none') return;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // pointer capture fallback
    }

    setDragState({
      row,
      col,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isDragging: false
    });
    setHoverTarget(null);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState || isProcessing) return;

    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const isDragging = dist > 7;

    let target: { row: number; col: number } | null = null;
    if (isDragging) {
      if (Math.abs(dx) > Math.abs(dy)) {
        const nextCol = dragState.col + (dx > 0 ? 1 : -1);
        if (nextCol >= 0 && nextCol < cols) {
          target = { row: dragState.row, col: nextCol };
        }
      } else {
        const nextRow = dragState.row + (dy > 0 ? 1 : -1);
        if (nextRow >= 0 && nextRow < rows) {
          target = { row: nextRow, col: dragState.col };
        }
      }
    }

    setDragState(prev => prev ? {
      ...prev,
      currentX: e.clientX,
      currentY: e.clientY,
      isDragging
    } : null);

    setHoverTarget(target);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragState || isProcessing) {
      setDragState(null);
      setHoverTarget(null);
      return;
    }

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // fallback
    }

    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 16) {
      // Drag/lifted and moved to swap!
      let targetRow = dragState.row;
      let targetCol = dragState.col;

      if (hoverTarget) {
        targetRow = hoverTarget.row;
        targetCol = hoverTarget.col;
      } else if (Math.abs(dx) > Math.abs(dy)) {
        targetCol += dx > 0 ? 1 : -1;
      } else {
        targetRow += dy > 0 ? 1 : -1;
      }

      if (
        targetRow >= 0 && targetRow < rows &&
        targetCol >= 0 && targetCol < cols &&
        (targetRow !== dragState.row || targetCol !== dragState.col)
      ) {
        onSwipe(dragState.row, dragState.col, targetRow, targetCol);
      }
    } else {
      // Normal click
      onCellClick(dragState.row, dragState.col);
    }

    setDragState(null);
    setHoverTarget(null);
  };

  const handlePointerCancel = () => {
    setDragState(null);
    setHoverTarget(null);
  };

  return (
    <div className="relative w-full max-w-[430px] mx-auto px-2 select-none touch-none-game">
      {/* Board Outer Container */}
      <div 
        ref={boardRef}
        className={`relative bg-slate-900/90 rounded-2xl p-1.5 sm:p-2.5 shadow-2xl border-4 border-sky-400/80 ring-2 ring-blue-900/80 backdrop-blur-sm overflow-hidden transition-transform ${
          isShaking ? 'shake-screen' : ''
        }`}
        style={{ touchAction: 'none' }}
      >
        {/* Subtle grid backdrop pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* 3-Match Blast VFX: Shockwaves, Sparkles, and Particles */}
        <MatchVFXOverlay
          popEffects={popEffects}
          particles={particles}
          rows={rows}
          cols={cols}
        />

        {/* Laser Beam Overlays */}
        {beamEffects.map((beam) => (
          <div
            key={beam.id}
            className={`absolute pointer-events-none z-30 ${
              beam.type === 'row'
                ? 'left-0 right-0 h-10 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_20px_#38bdf8] animate-pulse'
                : 'top-0 bottom-0 w-10 -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300 to-transparent shadow-[0_0_20px_#38bdf8] animate-pulse'
            }`}
            style={{
              [beam.type === 'row' ? 'top' : 'left']: `${
                ((beam.index + 0.5) / (beam.type === 'row' ? rows : cols)) * 100
              }%`
            }}
          />
        ))}

        {/* Floating Scores and Combos */}
        {floatingTexts.map((item) => (
          <div
            key={item.id}
            className="absolute z-40 font-black text-xs sm:text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] pointer-events-none animate-bounce"
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              color: item.color
            }}
          >
            {item.text}
          </div>
        ))}

        {/* The Grid */}
        <div 
          className="grid gap-1 sm:gap-1.5 w-full mx-auto"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            touchAction: 'none'
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isSelected = selectedCell?.row === r && selectedCell?.col === c;
              const isBeingDragged = dragState?.row === r && dragState?.col === c && dragState?.isDragging;
              const isTargetHovered = hoverTarget?.row === r && hoverTarget?.col === c;

              // Smooth responsive translation offset while being dragged
              let dragTranslateStyle: React.CSSProperties = {};
              if (isBeingDragged && dragState) {
                const rawDx = dragState.currentX - dragState.startX;
                const rawDy = dragState.currentY - dragState.startY;
                // Clamp drag offset to adjacent tile distance (~44px)
                const clampedDx = Math.max(-46, Math.min(46, rawDx));
                const clampedDy = Math.max(-46, Math.min(46, rawDy));
                dragTranslateStyle = {
                  transform: `translate(${clampedDx}px, ${clampedDy}px) scale(1.18)`,
                  zIndex: 50,
                  transition: 'none'
                };
              }

              return (
                <div
                  key={cell.id}
                  onPointerDown={(e) => handlePointerDown(r, c, e)}
                  title={cell.special !== 'none' ? '폭탄 클릭 시 즉시 폭발!' : '마우스로 잡고 밀어서 이동!'}
                  style={dragTranslateStyle}
                  className={`relative aspect-square rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-150 select-none ${
                    // Checkerboard tile shading
                    (r + c) % 2 === 0 ? 'bg-slate-800/80' : 'bg-slate-800/50'
                  } border border-slate-700/40 hover:brightness-110 ${
                    isBeingDragged
                      ? 'cursor-grabbing ring-2 ring-amber-300 shadow-[0_12px_24px_rgba(0,0,0,0.7)] brightness-125'
                      : 'cursor-grab active:cursor-grabbing'
                  } ${
                    isSelected ? 'ring-2 sm:ring-3 ring-amber-400 bg-amber-500/20 scale-105 z-20 shadow-lg shadow-amber-500/50' : ''
                  } ${
                    isTargetHovered ? 'ring-2 ring-cyan-400 ring-dashed bg-cyan-500/25 scale-105 z-10 shadow-[0_0_16px_rgba(56,189,248,0.6)]' : ''
                  } ${
                    cell.special !== 'none' ? 'ring-2 ring-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.5)] z-10 hover:scale-105' : ''
                  }`}
                >
                  {/* Inside Gem / Obstacle */}
                  {(cell.gemType || cell.obstacle !== 'none') && (
                    <div className="w-[82%] h-[82%] flex items-center justify-center pointer-events-none">
                      <GemIcon
                        type={cell.gemType}
                        special={cell.special}
                        obstacle={cell.obstacle}
                        obstacleHp={cell.obstacleHp}
                        isMatched={cell.isMatched}
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  {/* Click hint badge for bombs */}
                  {cell.special !== 'none' && (
                    <span className="absolute -top-1 -right-1 z-30 bg-amber-500 text-black text-[8px] font-black px-1 rounded-full shadow pointer-events-none animate-pulse">
                      CLICK
                    </span>
                  )}

                  {/* Target Swap Arrow Cue when dragged over */}
                  {isTargetHovered && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                      <span className="w-5 h-5 rounded-full bg-cyan-400 text-black text-[10px] font-black flex items-center justify-center shadow-lg animate-pulse">
                        ⇄
                      </span>
                    </span>
                  )}

                  {/* Highlight aura if special */}
                  {cell.special !== 'none' && (
                    <span className="absolute inset-0 rounded-lg sm:rounded-xl bg-amber-400/15 pointer-events-none animate-pulse" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
