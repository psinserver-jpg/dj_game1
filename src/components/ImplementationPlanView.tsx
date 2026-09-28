import React, { useState } from 'react';
import { Copy, Check, Download, ArrowLeft, Gamepad2, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';

interface ImplementationPlanViewProps {
  onBackToGame: () => void;
}

export const ImplementationPlanView: React.FC<ImplementationPlanViewProps> = ({ onBackToGame }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'mechanics' | 'architecture' | 'roadmap'>('overview');

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(MARKDOWN_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-slate-900/95 text-slate-100 rounded-3xl shadow-2xl border border-slate-700/80 my-4 backdrop-blur-md">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>게임으로 돌아가기</span>
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-amber-400 tracking-tight flex items-center gap-2">
              <span>💎 보석 퍼즐 게임(Match-3) 구현 계획서</span>
            </h1>
            <p className="text-xs text-slate-400">참조 이미지 기반 역공학 분석 및 상용급 3매치 게임 개발 종합 설계서</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-600 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '복사 완료!' : 'MD 복사'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>인쇄 / PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 my-4 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>1. 프로젝트 개요 & 역공학 분석</span>
        </button>
        <button
          onClick={() => setActiveTab('mechanics')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'mechanics' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>2. 게임 메커니즘 & 기믹 설계</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'architecture' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>3. 시스템 아키텍처 & 알고리즘</span>
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'roadmap' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>4. 개발 로드맵 & 마일스톤</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-h-[68vh] overflow-y-auto pr-2">
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <h2 className="text-base font-bold text-amber-300 mb-2">📌 1. 프로젝트 요약</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div><strong className="text-white">프로젝트명:</strong> Jewel Slime Match (보석 퍼즐 어드벤처)</div>
                <div><strong className="text-white">장르:</strong> 캐주얼 3매치 퍼즐 (Casual Match-3 Puzzle)</div>
                <div><strong className="text-white">타겟 플랫폼:</strong> 웹(모바일 반응형 웹 및 PC), PWA 지원 가능</div>
                <div><strong className="text-white">핵심 타겟층:</strong> 캐주얼 게이머, 직관적인 퍼즐 및 성취감을 선호하는 남녀노소</div>
              </div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <h2 className="text-base font-bold text-sky-300 mb-3">🔍 2. 첨부 이미지 완벽 역공학(Reverse Engineering) 분석</h2>
              <div className="space-y-3 text-xs">
                <div className="border-l-2 border-rose-500 pl-3">
                  <span className="font-bold text-rose-300 block mb-0.5">① 상단 헤더 영역 (UI Header)</span>
                  - <strong>좌측 목표(Goals):</strong> 자수정 큐브 보석(20개), 루비 육각 보석(25개), 무지개 슬라임 달성 체크박스 및 잔여 목표 표시<br />
                  - <strong>중앙 레벨 뱃지:</strong> 붉은 리본 배지에 "LEVEL 63", 그 아래 흰색 굵은 숫자로 남은 턴수(Moves: 18) 강조<br />
                  - <strong>우측 스코어 & 3성 게이지:</strong> 현재 점수(43,300)와 3단계 별(Star) 달성 프로그레스 바
                </div>

                <div className="border-l-2 border-amber-500 pl-3">
                  <span className="font-bold text-amber-300 block mb-0.5">② 마스코트 캐릭터 (Slime Companion)</span>
                  - 보드 우측 상단에 <strong>광채(Sunburst ray)</strong>를 등진 귀여운 붉은 슬라임 배치<br />
                  - 플레이어의 행동(연속 콤보, 턴 부족 위기, 클리어 시)에 따라 실시간 표정 및 말풍선 반응으로 감성적 몰입감 제공
                </div>

                <div className="border-l-2 border-cyan-500 pl-3">
                  <span className="font-bold text-cyan-300 block mb-0.5">③ 보석 및 특수 이펙트 (Gems & Laser Beams)</span>
                  - 5종 원석: 붉은 육각 루비, 파란 팔각 사파이어, 초록 다이아몬드 에메랄드, 노란 물방울 토파즈, 분홍 사각 아메시스트<br />
                  - <strong>세로 레이저 빔 이펙트:</strong> 이미지 중앙에 붉은 보석 라인이 발광하며 세로 1개 열을 일제히 파괴하는 광선 연출
                </div>

                <div className="border-l-2 border-purple-500 pl-3">
                  <span className="font-bold text-purple-300 block mb-0.5">④ 복합 장애물 기믹 (Gimmicks)</span>
                  - <strong>유리병에 갇힌 슬라임(Jar Slime):</strong> 인접 매칭 시 유리병에 금이 가며 2회 타격 시 슬라임이 구출됨<br />
                  - <strong>황금 쇠사슬 보석(Caged Gem):</strong> 스왑이 불가능하며, 해당 보석을 포함하여 3매칭을 해야 잠금이 풀림<br />
                  - <strong>하단 포션 병(Potion Bottles):</strong> 보드 최하단에 정렬된 포션으로, 상단 보석 제거 시 수집/클리어 달성
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mechanics' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <h2 className="text-base font-bold text-emerald-300 mb-3">🧩 3. 매칭 룰 및 특수 보석 생성 규칙</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="py-2 px-2">매칭 패턴</th>
                      <th className="py-2 px-2">생성 아이템</th>
                      <th className="py-2 px-2">효과</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="py-2 px-2 font-bold text-white">직선 3개</td>
                      <td className="py-2 px-2 text-slate-300">일반 매치</td>
                      <td className="py-2 px-2 text-slate-400">해당 보석 3개 파괴 + 기본 점수</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-bold text-cyan-300">직선 4개 (가로)</td>
                      <td className="py-2 px-2 text-cyan-300">가로 빔 보석</td>
                      <td className="py-2 px-2 text-slate-400">발동 시 가로 전체 행(Row) 레이저 관통 파괴</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-bold text-cyan-300">직선 4개 (세로)</td>
                      <td className="py-2 px-2 text-cyan-300">세로 빔 보석</td>
                      <td className="py-2 px-2 text-slate-400">발동 시 세로 전체 열(Column) 레이저 관통 파괴</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-bold text-amber-300">T자 / L자 (5개)</td>
                      <td className="py-2 px-2 text-amber-300">마법 폭탄 (Bomb)</td>
                      <td className="py-2 px-2 text-slate-400">발동 시 주변 3x3 반경 동시 폭발</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-bold text-pink-300">직선 5개 이상</td>
                      <td className="py-2 px-2 text-pink-300">레인보우 슬라임</td>
                      <td className="py-2 px-2 text-slate-400">스왑한 색상의 보드 위 모든 보석 일괄 소멸</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <h2 className="text-base font-bold text-rose-300 mb-2">💥 특수 콤보 합성 (Combo Synthesis)</h2>
              <p className="text-xs text-slate-300 mb-2">
                인접한 두 개의 특수 보석을 서로 스왑할 때 초대형 복합 효과 발생:
              </p>
              <ul className="list-disc list-inside text-xs space-y-1 text-slate-400">
                <li><strong>빔 + 빔:</strong> 십자(+) 방향으로 가로행과 세로열 동시 폭격 레이저 발사</li>
                <li><strong>빔 + 폭탄:</strong> 3줄 가로 및 3줄 세로의 초대형 십자 레이저 클리어</li>
                <li><strong>폭탄 + 폭탄:</strong> 5x5 범위의 대폭발</li>
                <li><strong>레인보우 + 특수 보석:</strong> 보드 상 동일 색상의 모든 보석을 특수 보석으로 복제 변환 후 동시 연쇄 기폭</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <h2 className="text-base font-bold text-indigo-300 mb-2">⚙️ 4. 기술 아키텍처 및 상태 머신 (FSM)</h2>
              <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-emerald-400 border border-slate-800 overflow-x-auto whitespace-pre">
{`[User Input: Swipe / Click]
        │
        ▼
[STATE: Swapping] ───(유효성 검사)───▶ [Invalid: Revert Swap]
        │
        ▼ (Valid Match Found)
[STATE: Exploding / Laser Beams / Goal Counter Update]
        │
        ▼
[STATE: Gravity Cascade & Fall Down]
        │
        ▼
[STATE: Top Refill with New Gems]
        │
        ▼
[STATE: Check Cascading Matches] ───(연쇄 매칭 존재 시)───┐
        ▲                                                 │
        └─────────────────(반복 루프)──────────────────────┘
        │ (연쇄 매칭 없음)
        ▼
[STATE: Check Goals] ───▶ [Won: 축하 팡파레 / Stars 계산]
        │
        ├───▶ [Moves == 0: Lost / 무브 추가 선택 모달]
        │
        └───▶ [STATE: Idle / 대기 상태로 복귀]`}
              </div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <h2 className="text-base font-bold text-amber-300 mb-2">🔊 사운드 및 주스(Juice) 시스템</h2>
              <ul className="list-disc list-inside text-xs space-y-1 text-slate-400">
                <li><strong>Web Audio API 신디사이저:</strong> 외부 무거운 mp3 파일 다운로드 없이 브라우저 오디오 오실레이터로 즉각적인 스왑음, 콤보 상승음(피치 점증), 레이저 빔 지지직 사운드, 폭발음, 클리어 팡파레 구현</li>
                <li><strong>주스 연출:</strong> 스왑 시 타일 흔들림, 파괴 시 파티클 비산, 콤보 팝업(+100, +250 P), 화면 셰이크</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <h2 className="text-base font-bold text-rose-300 mb-3">🚀 5. 단계별 개발 일정 및 마일스톤</h2>
              <div className="space-y-3 text-xs">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-emerald-400">Milestone 1: 코어 매치3 엔진 구축 (완료)</span>
                  <p className="text-slate-400 mt-1">그리드 생성, 3매칭 탐색, 스왑 및 스왑 롤백 알고리즘, 중력 낙하 및 상단 리필 루프 완성</p>
                </div>

                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-cyan-400">Milestone 2: 특수 보석 및 콤보 합성 (완료)</span>
                  <p className="text-slate-400 mt-1">4매칭 레이저 빔(가로/세로), 5매칭 레인보우 슬라임, 3x3 폭탄 기믹 및 빔 이펙트 렌더러</p>
                </div>

                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-amber-400">Milestone 3: 참조 이미지 Level 63 스테이지 & 장애물 (완료)</span>
                  <p className="text-slate-400 mt-1">유리병 갇힌 슬라임 구출 기믹, 황금 쇠사슬 봉인 기믹, 하단 포션병 수집 로직 및 목표 체크 시스템</p>
                </div>

                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-purple-400">Milestone 4: 오디오 신디사이저 & 반응형 슬라임 마스코트 (완료)</span>
                  <p className="text-slate-400 mt-1">실시간 광채 슬라임 인터랙션(터치 시 점프, 콤보 격려, 턴 부족 걱정), Web Audio 사운드 연출</p>
                </div>

                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-pink-400">Milestone 5: 향후 확장 기능 제안</span>
                  <p className="text-slate-400 mt-1">월드 맵(World Map) 스테이지 로드맵, 소셜 랭킹(Leaderboard), 일일 미션 및 룰렛 보상 시스템</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MARKDOWN_CONTENT = `# [Game Design Document] Jewel Slime Match: 3매치 보석 퍼즐 어드벤처

## 1. 프로젝트 개요
- **게임명:** Jewel Slime Match (보석 퍼즐 어드벤처)
- **장르:** 캐주얼 매칭 3 퍼즐 (Casual Match-3 Puzzle)
- **타겟층:** 남녀노소 누구나 즐길 수 있는 직관적이고 경쾌한 모바일/웹 퍼즐 게이머
- **핵심 재미 요소:**
  1. 화려한 보석 매칭과 연쇄 폭발의 쾌감
  2. 귀여운 슬라임을 유리병에서 구출하는 감성적 목표
  3. 레이저 빔, 마법 폭탄, 레인보우 슬라임이 만드는 시원한 특수 콤보

---

## 2. 참조 이미지 역공학 분석
- **상단 헤더(Header):**
  - 자수정(20), 루비(25), 슬라임 구출 등 스테이지 클리어 목표 체크 UI
  - 중앙 붉은 리본 배지에 "LEVEL 63" 및 남은 턴수(Moves: 18)
  - 3성(Star) 달성 점수 프로그레스 바
- **슬라임 마스코트(Slime Mascot):**
  - 보드 상단 우측에 후광 빛줄기와 함께 유저를 응원하는 반응형 슬라임
- **보드 & 보석(Board & Gems):**
  - 8x9 그리드 다크블루 앤 골드 체커보드
  - 5종 원석(루비, 사파이어, 에메랄드, 토파즈, 아메시스트)
- **장애물 기믹(Obstacles):**
  - 유리병에 갇힌 슬라임(2회 인접 타격 시 탈출)
  - 황금 쇠사슬(잠금 봉인)
  - 바닥 정렬 마법 포션병

---

## 3. 매칭 및 특수 보석 규칙
- **직선 3개:** 기본 매치
- **직선 4개 (가로/세로):** 가로/세로 레이저 빔 보석 생성
- **T자 / L자 (5개):** 3x3 마법 폭탄 생성
- **직선 5개 이상:** 레인보우 슬라임(선택 색상 전원 파괴) 생성
- **특수 보석 콤보:**
  - 빔 + 빔: 십자(+) 동시 폭격
  - 빔 + 폭탄: 3줄 대형 십자 폭격
  - 레인보우 + 특수 보석: 전원 특수 보석 변환 후 연쇄 기폭

---

## 4. 기술 스택 및 아키텍처
- **Front-end:** React 19, TypeScript, Tailwind CSS
- **Graphics:** 고해상도 벡터 SVG + Canvas Confetti
- **Audio:** Web Audio API 실시간 사운드 신디사이저 (외부 에셋 의존 없음)
- **State Machine:** Idle -> Swap -> Match -> Beam/Bomb -> Cascade -> Refill -> Goal Check
`;
