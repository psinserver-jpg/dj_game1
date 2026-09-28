import React, { useState } from 'react';
import { Play, Layers, HelpCircle, Trophy, Volume2, VolumeX, Sparkles, Star, ChevronRight, X, FileText, Bomb } from 'lucide-react';
import { GemIcon } from './GemIcon';
import { LEVELS } from '../utils/levels';

interface StartMenuProps {
  onStartGame: (roundIndex?: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenDoc: () => void;
  highScore: number;
  highestRound: number;
  starsMap: Record<number, number>; // round -> stars
}

export const StartMenu: React.FC<StartMenuProps> = ({
  onStartGame,
  soundEnabled,
  onToggleSound,
  onOpenDoc,
  highScore,
  highestRound,
  starsMap
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showRoundSelect, setShowRoundSelect] = useState<boolean>(false);

  const totalStars = Object.values(starsMap).reduce((acc, cur) => acc + cur, 0);

  return (
    <div className="relative w-full max-w-[440px] mx-auto min-h-[92vh] flex flex-col justify-between items-center py-5 px-3 select-none text-white">
      
      {/* Top Header Utilities */}
      <div className="w-full flex items-center justify-between z-20">
        {/* Implementation Doc Button */}
        <button
          onClick={onOpenDoc}
          className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-indigo-300 font-bold px-3 py-1.5 rounded-full border border-indigo-500/40 shadow-lg text-xs backdrop-blur-md cursor-pointer transition-all active:scale-95"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>구현 계획서 (GDD)</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-full border shadow-lg backdrop-blur-md cursor-pointer transition-all active:scale-95 ${
            soundEnabled
              ? 'bg-indigo-600/90 hover:bg-indigo-500 border-indigo-400 text-white'
              : 'bg-slate-800/80 border-slate-600 text-slate-400'
          }`}
          title={soundEnabled ? '소리 끄기' : '소리 켜기'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Title & Logo Section */}
      <div className="flex flex-col items-center text-center mt-2 z-20">
        {/* Floating gems decoration */}
        <div className="flex items-center justify-center gap-3 mb-2 animate-bounce">
          <div className="w-9 h-9 drop-shadow-[0_0_12px_#facc15]">
            <GemIcon type="star" size={36} />
          </div>
          <div className="w-9 h-9 drop-shadow-[0_0_12px_#f43f5e]">
            <GemIcon type="circle" size={36} />
          </div>
          <div className="w-9 h-9 drop-shadow-[0_0_12px_#38bdf8]">
            <GemIcon type="octagon" size={36} />
          </div>
          <div className="w-9 h-9 drop-shadow-[0_0_12px_#22c55e]">
            <GemIcon type="diamond" size={36} />
          </div>
        </div>

        {/* Big Game Title */}
        <div className="relative">
          <div className="absolute -inset-3 bg-gradient-to-r from-amber-500/30 via-rose-500/40 to-sky-500/30 rounded-3xl blur-xl pointer-events-none" />
          <h1 className="relative text-4xl sm:text-5xl font-black tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] bg-gradient-to-b from-amber-200 via-amber-400 to-orange-500 bg-clip-text text-transparent">
            보석 팡팡
          </h1>
          <span className="block text-sm sm:text-base font-extrabold text-sky-200 tracking-wider mt-1 drop-shadow">
            슬라임 킹덤 : 8×8 스퀘어
          </span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 mt-3 bg-rose-600/90 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg border border-white/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>목표 점수 돌파! 라운드 클리어 퍼즐</span>
        </div>

        {/* Mascot Slime with Speech Bubble */}
        <div className="relative flex flex-col items-center mt-5">
          {/* Speech Bubble */}
          <div className="relative bg-white/95 text-slate-800 font-extrabold text-xs px-3.5 py-1.5 rounded-2xl shadow-xl border-2 border-amber-300 mb-2 animate-pulse">
            <span>함께 보석을 터뜨려 볼까요? 💎✨</span>
            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-8 border-t-white" />
          </div>

          {/* 3D Glowing Mascot Slime */}
          <div className="w-24 h-24 relative flex items-center justify-center filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.6)]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <radialGradient id="menuSlimeGrad" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#fca5a5" />
                  <stop offset="35%" stopColor="#ef4444" />
                  <stop offset="80%" stopColor="#b91c1c" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </radialGradient>
              </defs>
              <ellipse cx="50" cy="56" rx="42" ry="36" fill="url(#menuSlimeGrad)" />
              {/* Slime Crown/Tuft */}
              <path d="M 50 20 Q 56 10 60 16 Q 52 28 50 32 Z" fill="#ef4444" />
              {/* Highlight */}
              <ellipse cx="36" cy="40" rx="14" ry="7" transform="rotate(-25 36 40)" fill="#ffffff" opacity="0.65" />
              {/* Eyes */}
              <ellipse cx="38" cy="52" rx="5" ry="7" fill="#1e1b4b" />
              <ellipse cx="62" cy="52" rx="5" ry="7" fill="#1e1b4b" />
              <circle cx="36" cy="50" r="2.2" fill="#ffffff" />
              <circle cx="60" cy="50" r="2.2" fill="#ffffff" />
              {/* Blushing Cheeks */}
              <ellipse cx="28" cy="60" rx="5" ry="2.5" fill="#f43f5e" opacity="0.8" />
              <ellipse cx="72" cy="60" rx="5" ry="2.5" fill="#f43f5e" opacity="0.8" />
              {/* Smile */}
              <path d="M 44 63 Q 50 70 56 63" stroke="#1e1b4b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Record Stats Bar */}
      <div className="w-full max-w-[380px] bg-slate-900/85 backdrop-blur-md rounded-2xl p-2.5 border border-slate-700/80 shadow-xl flex items-center justify-around my-2 z-20">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>최고 점수</span>
          </div>
          <span className="text-base sm:text-lg font-black text-amber-300">
            {highScore > 0 ? highScore.toLocaleString() : '0'} P
          </span>
        </div>

        <div className="w-px h-8 bg-slate-700" />

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
            <Star className="w-3 h-3 text-amber-400" />
            <span>획득한 별</span>
          </div>
          <span className="text-base sm:text-lg font-black text-amber-400">
            {totalStars} ★
          </span>
        </div>

        <div className="w-px h-8 bg-slate-700" />

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
            <Layers className="w-3 h-3 text-sky-400" />
            <span>도달 라운드</span>
          </div>
          <span className="text-base sm:text-lg font-black text-sky-300">
            Round {highestRound}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-[360px] flex flex-col gap-2.5 z-20 mt-1">
        {/* Play Game Button */}
        <button
          onClick={() => onStartGame()}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xl shadow-[0_8px_25px_rgba(16,185,129,0.5)] border-2 border-emerald-300 flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95 animate-pulse"
        >
          <Play className="w-6 h-6 fill-white text-white" />
          <span>게임 시작</span>
        </button>

        {/* Secondary Buttons Row */}
        <div className="flex gap-2">
          {/* Round Select */}
          <button
            onClick={() => setShowRoundSelect(true)}
            className="flex-1 py-3 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold text-xs sm:text-sm border border-slate-600/80 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span>라운드 선택</span>
          </button>

          {/* How to Play */}
          <button
            onClick={() => setShowHowToPlay(true)}
            className="flex-1 py-3 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold text-xs sm:text-sm border border-slate-600/80 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>게임 방법</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-slate-400 z-20 mt-3">
        <span>8×8 정사각형 보드 • 난이도별 스킬 차등 제공 • 가로/세로/십자 폭탄</span>
      </div>

      {/* MODAL 1: Round Select Modal */}
      {showRoundSelect && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-sky-400/80 rounded-3xl p-5 w-full max-w-sm text-white shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-black text-sky-300">라운드 선택</h3>
              </div>
              <button
                onClick={() => setShowRoundSelect(false)}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 my-4 max-h-[50vh] overflow-y-auto pr-1">
              {LEVELS.map((lvl, idx) => {
                const roundStars = starsMap[lvl.round] || 0;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      setShowRoundSelect(false);
                      onStartGame(idx);
                    }}
                    className="w-full bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 hover:border-sky-400/70 rounded-2xl p-3 flex items-center justify-between transition-all cursor-pointer group text-left"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-amber-300 text-sm">
                          ROUND {lvl.round}
                        </span>
                        <span className="text-[11px] text-slate-300 font-semibold truncate max-w-[140px]">
                          {lvl.title.replace(`라운드 ${lvl.round}: `, '')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        목표: <strong className="text-emerald-400">{lvl.targetScore.toLocaleString()} P</strong> • 폭탄 스킬 <strong className="text-amber-300">{lvl.skillCharges}회</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex text-xs">
                        {[1, 2, 3].map((s) => (
                          <span
                            key={s}
                            className={roundStars >= s ? 'text-amber-400' : 'text-slate-600'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowRoundSelect(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/80 rounded-3xl p-5 w-full max-w-sm text-white shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-amber-300">게임 규칙 및 방법</h3>
              </div>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 my-4 text-xs max-h-[55vh] overflow-y-auto pr-1">
              {/* Item 1 */}
              <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700 flex gap-2.5 items-start">
                <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-xl font-black text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-black text-slate-100 text-xs">보석 이동 & 매칭 방식 💎</h4>
                  <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                    • <strong className="text-amber-300">마우스 드래그:</strong> 보석을 클릭한 채 들어서 원하는 방향으로 밀어 이동할 수 있습니다!<br />
                    • <strong className="text-sky-300">클릭 이동:</strong> 이동할 보석과 인접한 보석을 연속 클릭해도 교환됩니다.<br />
                    • <strong className="text-emerald-300">매칭 규칙:</strong> 가로/세로 3줄 연결 및 <strong className="text-amber-200">2×2 사각형(🔲)</strong> 완성 시 시원하게 폭파!
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700 flex gap-2.5 items-start">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl font-black text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-black text-slate-100 text-xs">라운드 클리어 방식</h4>
                  <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                    무한히 맞추는 대신, 각 라운드마다 정해진 <strong className="text-emerald-400">목표 점수</strong>를 넘기면 즉시 축포와 함께 다음 라운드로 진출합니다!
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700 flex gap-2.5 items-start">
                <div className="p-1.5 bg-rose-500/20 text-rose-400 rounded-xl font-black text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-black text-slate-100 text-xs">폭탄 스킬 시스템 (난이도별 횟수) 💣</h4>
                  <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                    • <strong className="text-amber-300">스킬 전용 폭탄:</strong> 라운드가 허무하게 끝나는 것을 방지하기 위해 폭탄은 하단 스킬로만 사용 가능합니다.<br />
                    • <strong className="text-sky-300">난이도별 사용 횟수:</strong> 라운드 1은 1회, 난이도가 올라갈수록 최대 4회까지 스킬 충전!<br />
                    • <span className="text-amber-200 font-bold">폭탄 클릭 발동:</span> 스킬로 장착된 폭탄 타일을 클릭하면 즉시 강력한 폭발이 일어납니다!
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700 flex gap-2.5 items-start">
                <div className="p-1.5 bg-sky-500/20 text-sky-400 rounded-xl font-black text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-black text-slate-100 text-xs">정사각형 8×8 스퀘어 보드</h4>
                  <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                    모바일과 데스크톱 어디서나 한눈에 들어오는 깔끔한 1:1 정사각형 퍼즐판과 4가지 선명한 보석을 즐겨보세요.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-xs font-black text-white cursor-pointer shadow-md"
            >
              확인 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
