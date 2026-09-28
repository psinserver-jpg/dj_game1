import React from 'react';
import { ArrowLeftRight, ArrowUpDown, Bomb, Layers, Sparkles } from 'lucide-react';

interface BoosterBarProps {
  remainingSkills: number;
  maxSkills: number;
  onUseHorizontalBomb: () => void;
  onUseVerticalBomb: () => void;
  onUseCrossBomb: () => void;
  currentLevel: number;
  onSelectLevel: (lvl: number) => void;
}

export const BoosterBar: React.FC<BoosterBarProps> = ({
  remainingSkills,
  maxSkills,
  onUseHorizontalBomb,
  onUseVerticalBomb,
  onUseCrossBomb,
  currentLevel,
  onSelectLevel
}) => {
  const hasCharges = remainingSkills > 0;

  return (
    <div className="w-full max-w-[430px] mx-auto mt-1.5 sm:mt-2 px-2 sm:px-3 flex flex-col gap-1.5 sm:gap-2">
      {/* Skill Bar Container */}
      <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-2 border border-slate-700/70 shadow-xl flex flex-col gap-1.5">
        
        {/* Skill Stock / Charge Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-amber-300 flex items-center gap-1">
              <Bomb className="w-3.5 h-3.5 text-amber-400" />
              폭탄 스킬
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              (난이도별 {maxSkills}회 제공)
            </span>
          </div>

          {/* Remaining charges pill */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
            <span className="text-[10px] font-bold text-slate-300">남은 횟수:</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: maxSkills }).map((_, idx) => (
                <span
                  key={idx}
                  className={`text-[12px] transition-transform ${
                    idx < remainingSkills
                      ? 'text-amber-400 scale-110 drop-shadow-[0_0_6px_#fbbf24]'
                      : 'text-slate-600 opacity-40'
                  }`}
                  title={idx < remainingSkills ? '사용 가능' : '사용 완료'}
                >
                  💣
                </span>
              ))}
            </div>
            <span className={`text-[11px] font-black ml-0.5 ${hasCharges ? 'text-amber-400' : 'text-rose-400'}`}>
              {remainingSkills}/{maxSkills}
            </span>
          </div>
        </div>

        {/* 3 Bomb Skill Buttons */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Skill 1: 가로 폭탄 */}
          <button
            onClick={onUseHorizontalBomb}
            disabled={!hasCharges}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-2 rounded-xl font-black text-[11px] sm:text-xs transition-all ${
              hasCharges
                ? 'bg-gradient-to-r from-amber-600/80 to-amber-500/90 text-white hover:brightness-110 active:scale-95 shadow-md shadow-amber-600/30 border border-amber-300/40 cursor-pointer'
                : 'bg-slate-800/60 text-slate-500 border border-slate-700/40 cursor-not-allowed opacity-50'
            }`}
            title={hasCharges ? '가로 한 줄 전체를 레이저 폭발로 파괴' : '스킬 횟수 소진'}
          >
            <div className="flex items-center gap-0.5">
              <Bomb className="w-3.5 h-3.5 text-amber-200" />
              <ArrowLeftRight className="w-3 h-3 text-amber-100" />
            </div>
            <span className="whitespace-nowrap">가로 폭탄</span>
          </button>

          {/* Skill 2: 세로 폭탄 */}
          <button
            onClick={onUseVerticalBomb}
            disabled={!hasCharges}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-2 rounded-xl font-black text-[11px] sm:text-xs transition-all ${
              hasCharges
                ? 'bg-gradient-to-r from-sky-600/80 to-sky-500/90 text-white hover:brightness-110 active:scale-95 shadow-md shadow-sky-600/30 border border-sky-300/40 cursor-pointer'
                : 'bg-slate-800/60 text-slate-500 border border-slate-700/40 cursor-not-allowed opacity-50'
            }`}
            title={hasCharges ? '세로 한 줄 전체를 레이저 폭발로 파괴' : '스킬 횟수 소진'}
          >
            <div className="flex items-center gap-0.5">
              <Bomb className="w-3.5 h-3.5 text-sky-200" />
              <ArrowUpDown className="w-3 h-3 text-sky-100" />
            </div>
            <span className="whitespace-nowrap">세로 폭탄</span>
          </button>

          {/* Skill 3: 십자 폭탄 */}
          <button
            onClick={onUseCrossBomb}
            disabled={!hasCharges}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-2 rounded-xl font-black text-[11px] sm:text-xs transition-all ${
              hasCharges
                ? 'bg-gradient-to-r from-rose-600/85 to-red-500/90 text-white hover:brightness-110 active:scale-95 shadow-md shadow-rose-600/30 border border-rose-300/40 cursor-pointer'
                : 'bg-slate-800/60 text-slate-500 border border-slate-700/40 cursor-not-allowed opacity-50'
            }`}
            title={hasCharges ? '가로와 세로가 동시에 터지는 대형 십자 폭탄' : '스킬 횟수 소진'}
          >
            <div className="flex items-center gap-0.5">
              <span className="text-xs">💥</span>
              <span className="font-extrabold text-amber-200 text-xs">✚</span>
            </div>
            <span className="whitespace-nowrap">십자 폭탄</span>
          </button>
        </div>
      </div>

      {/* Round Selector Bar */}
      <div className="flex items-center justify-between px-1 text-[11px] sm:text-xs text-slate-200">
        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400 font-medium">
          <span>💡 원하는 타일을 누르고 폭탄 스킬을 사용해보세요!</span>
        </div>
        <div className="flex items-center gap-1">
          <Layers className="w-3 h-3 text-sky-400" />
          <div className="flex gap-1 overflow-x-auto py-0.5">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                onClick={() => onSelectLevel(lvl)}
                className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentLevel === lvl
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/40 ring-1 ring-white'
                    : 'bg-white/20 text-white/80 hover:bg-white/30'
                }`}
              >
                R{lvl}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
