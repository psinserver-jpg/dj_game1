import React from 'react';
import { LevelGoal } from '../types/game';
import { GemIcon } from './GemIcon';
import { Volume2, VolumeX, RotateCcw, FileText, Target, Home } from 'lucide-react';

interface HeaderUIProps {
  levelId: number;
  round: number;
  targetScore: number;
  moves: number;
  score: number;
  goals: LevelGoal[];
  starThresholds: [number, number, number];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onOpenDoc: () => void;
  onGoToMenu: () => void;
}

export const HeaderUI: React.FC<HeaderUIProps> = ({
  levelId,
  round,
  targetScore,
  moves,
  score,
  goals,
  starThresholds,
  soundEnabled,
  onToggleSound,
  onRestart,
  onOpenDoc,
  onGoToMenu
}) => {
  const isTargetAchieved = score >= targetScore;
  const progressPercent = Math.min(100, Math.round((score / targetScore) * 100));

  const starsEarned = 
    score >= starThresholds[2] ? 3 :
    score >= starThresholds[1] ? 2 :
    score >= starThresholds[0] ? 1 : 0;

  return (
    <header className="relative w-full max-w-[430px] mx-auto pt-1 sm:pt-2 px-2 sm:px-3 select-none">
      {/* Top quick utility toolbar */}
      <div className="flex items-center justify-between pb-1 text-xs">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={onGoToMenu}
            className="flex items-center gap-1 bg-white/95 hover:bg-white text-slate-800 font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm hover:shadow transition-all text-[11px] sm:text-xs border border-slate-200 cursor-pointer active:scale-95"
            title="시작 메뉴로 이동"
          >
            <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
            <span>메뉴</span>
          </button>
          <button
            onClick={onOpenDoc}
            className="flex items-center gap-1 bg-white/95 hover:bg-white text-indigo-700 font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm hover:shadow transition-all text-[11px] sm:text-xs border border-indigo-200 cursor-pointer active:scale-95"
            title="구현 계획서 열기"
          >
            <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600" />
            <span>계획서</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onRestart}
            className="p-1 sm:p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm border border-slate-200 cursor-pointer transition-transform active:scale-90"
            title="다시 시작"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleSound}
            className={`p-1 sm:p-1.5 rounded-full text-white shadow-sm cursor-pointer transition-transform active:scale-90 ${
              soundEnabled ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-slate-400'
            }`}
            title={soundEnabled ? '소리 끄기' : '소리 켜기'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Cloud-styled Game Header */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-1.5 sm:p-2.5 shadow-xl border border-sky-100 flex items-center justify-between">
        
        {/* Left: Round Target Score Badge */}
        <div className="flex flex-col items-start gap-1">
          <div className={`flex items-center gap-1.5 rounded-xl px-2 sm:px-2.5 py-1 border transition-all ${
            isTargetAchieved 
              ? 'bg-emerald-500/15 border-emerald-400 text-emerald-800'
              : 'bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/5 border-amber-300/80 text-amber-900'
          }`}>
            <Target className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isTargetAchieved ? 'text-emerald-500 animate-bounce' : 'text-rose-500'}`} />
            <div className="flex flex-col">
              <span className="text-[9px] font-extrabold tracking-tight leading-none text-slate-600">클리어 목표</span>
              <span className={`text-[11px] sm:text-xs font-black leading-tight ${isTargetAchieved ? 'text-emerald-600' : 'text-rose-600'}`}>
                {targetScore.toLocaleString()} P
              </span>
            </div>
            {isTargetAchieved && (
              <span className="text-[9px] font-black bg-emerald-500 text-white rounded-full px-1 py-0.2 ml-0.5">
                완료!
              </span>
            )}
          </div>

          {/* Bonus obstacles counter if present */}
          {goals.length > 0 && (
            <div className="flex items-center gap-1 pl-0.5">
              {goals.map((g, idx) => {
                const done = g.current >= g.target;
                return (
                  <div key={idx} className="flex items-center gap-0.5 bg-slate-100 rounded-md px-1 py-0.5 border border-slate-200 text-[10px]">
                    {g.type === 'gem' && <GemIcon type={g.gemType!} size={14} />}
                    {g.type === 'jar_slime' && <span className="text-[10px]">🍯</span>}
                    {g.type === 'potion_bottle' && <span className="text-[10px]">🧪</span>}
                    <span className={`font-bold text-[9px] ${done ? 'text-emerald-600' : 'text-slate-600'}`}>
                      {done ? '✓' : `${g.current}/${g.target}`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Center: Red Round & Moves Banner Badge */}
        <div className="relative -mt-3 sm:-mt-4 flex flex-col items-center">
          <div className="w-14 sm:w-16 h-16 sm:h-20 bg-gradient-to-b from-red-500 via-red-600 to-rose-700 rounded-b-xl shadow-lg border-2 border-white flex flex-col items-center pt-1 text-white">
            <span className="text-[9px] sm:text-[10px] tracking-tighter font-extrabold uppercase opacity-90">
              ROUND {round}
            </span>
            <span className={`text-xl sm:text-2xl font-black leading-none mt-0.5 sm:mt-1 ${moves <= 5 ? 'text-amber-200 animate-pulse' : 'text-white'}`}>
              {moves}
            </span>
            <span className="text-[8px] sm:text-[9px] font-medium opacity-80 mt-0.5">MOVES</span>
          </div>
        </div>

        {/* Right: Score & Target Progress Gauge */}
        <div className="flex flex-col items-end min-w-[95px] sm:min-w-[115px]">
          <div className="text-right flex items-baseline gap-0.5">
            <span className="text-[11px] sm:text-xs font-black text-slate-800 tracking-tight">
              {score.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-400 font-bold">
              / {targetScore.toLocaleString()}P
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative w-22 sm:w-28 h-3 sm:h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner mt-1">
            <div 
              className={`h-full rounded-full transition-all duration-300 shadow-sm ${
                isTargetAchieved
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 animate-pulse'
                  : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Progress % and Stars */}
          <div className="w-22 sm:w-28 flex justify-between items-center px-0.5 mt-0.5">
            <span className={`text-[9px] font-black ${isTargetAchieved ? 'text-emerald-600' : 'text-slate-500'}`}>
              {isTargetAchieved ? '클리어 달성!' : `${progressPercent}%`}
            </span>
            <div className="flex gap-0.5">
              {[0, 1, 2].map((idx) => (
                <span
                  key={idx}
                  className={`text-[10px] ${starsEarned > idx ? 'text-amber-400 drop-shadow' : 'text-slate-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
