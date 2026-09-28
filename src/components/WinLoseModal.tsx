import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowRight, PlusCircle, Trophy } from 'lucide-react';
import { sounds } from '../utils/audio';

interface WinLoseModalProps {
  status: 'playing' | 'won' | 'lost';
  round: number;
  score: number;
  targetScore: number;
  starThresholds: [number, number, number];
  onRestart: () => void;
  onNextLevel: () => void;
  onAddMoves: () => void;
  onGoToMenu?: () => void;
}

export const WinLoseModal: React.FC<WinLoseModalProps> = ({
  status,
  round,
  score,
  targetScore,
  starThresholds,
  onRestart,
  onNextLevel,
  onAddMoves,
  onGoToMenu
}) => {
  useEffect(() => {
    if (status === 'won') {
      sounds.playWin();
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (status === 'lost') {
      sounds.playLose();
    }
  }, [status]);

  if (status === 'playing') return null;

  const starsEarned = 
    score >= starThresholds[2] ? 3 :
    score >= starThresholds[1] ? 2 :
    score >= starThresholds[0] ? 1 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/80 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl text-white transform animate-in fade-in zoom-in duration-200">
        
        {status === 'won' ? (
          <>
            <div className="inline-flex p-3 bg-amber-500/20 rounded-full border border-amber-400/50 mb-3">
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>

            <div className="inline-block bg-amber-500/20 border border-amber-400/50 rounded-full px-3 py-0.5 text-xs font-black text-amber-300 mb-1">
              ROUND {round} COMPLETED
            </div>

            <h2 className="text-2xl font-black text-amber-300 tracking-wide mb-1">
              라운드 클리어! 🎯
            </h2>
            <p className="text-xs text-slate-300 mb-4">
              목표 점수 <strong className="text-amber-400">{targetScore.toLocaleString()}P</strong>를 돌파하고 다음 라운드로 진출합니다!
            </p>

            {/* Stars row */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map((starIdx) => (
                <span
                  key={starIdx}
                  className={`text-4xl transition-all duration-500 ${
                    starsEarned >= starIdx
                      ? 'text-amber-400 drop-shadow-[0_0_12px_#fbbf24] scale-110'
                      : 'text-slate-600'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Score */}
            <div className="bg-slate-800/80 rounded-2xl p-3 mb-5 border border-slate-700">
              <div className="flex justify-between items-center px-2 mb-1 text-xs">
                <span className="text-slate-400 font-semibold">목표 점수</span>
                <span className="text-slate-300 font-bold">{targetScore.toLocaleString()} P</span>
              </div>
              <div className="flex justify-between items-center px-2 text-xs">
                <span className="text-slate-400 font-semibold">최종 획득 점수</span>
                <span className="text-xl font-black text-emerald-400 tracking-tight">
                  {score.toLocaleString()} P
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onRestart}
                className="flex-1 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-200 flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>재도전</span>
              </button>
              <button
                onClick={onNextLevel}
                className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-black text-sm text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer animate-pulse"
              >
                <span>다음 라운드 도전</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {onGoToMenu && (
              <button
                onClick={onGoToMenu}
                className="w-full mt-2 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                🏠 시작 메뉴로 돌아가기
              </button>
            )}
          </>
        ) : (
          <>
            <div className="text-5xl mb-2">😢</div>
            <div className="inline-block bg-rose-500/20 border border-rose-400/50 rounded-full px-3 py-0.5 text-xs font-black text-rose-300 mb-1">
              ROUND {round}
            </div>
            <h2 className="text-2xl font-black text-rose-400 mb-1">목표 점수 미달</h2>
            <p className="text-xs text-slate-300 mb-4">
              목표 <span className="text-amber-400 font-bold">{targetScore.toLocaleString()}P</span> 중 <span className="text-white font-bold">{score.toLocaleString()}P</span>를 획득했습니다.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={onAddMoves}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-black text-sm text-white shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+5 무브 추가하고 계속하기</span>
              </button>
              <button
                onClick={onRestart}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-xs text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>라운드 다시 시작</span>
              </button>
              {onGoToMenu && (
                <button
                  onClick={onGoToMenu}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  🏠 시작 메뉴로 돌아가기
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
