import { LevelConfig } from '../types/game';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    round: 1,
    title: '라운드 1: 보석 정원의 시작',
    rows: 8,
    cols: 8,
    moves: 18,
    targetScore: 2500,
    skillCharges: 1, // 난이도: 초급 (스킬 1회)
    starThresholds: [2500, 3800, 5200],
    goals: [
      { type: 'gem', gemType: 'star', target: 12, current: 0 },
      { type: 'gem', gemType: 'diamond', target: 12, current: 0 }
    ],
    initialGrid: {
      obstacles: [],
      specials: []
    }
  },
  {
    id: 2,
    round: 2,
    title: '라운드 2: 쇠사슬 봉인 해제',
    rows: 8,
    cols: 8,
    moves: 20,
    targetScore: 4500,
    skillCharges: 2, // 난이도: 중급 (스킬 2회)
    starThresholds: [4500, 6200, 8500],
    goals: [
      { type: 'gem', gemType: 'circle', target: 15, current: 0 },
      { type: 'gem', gemType: 'octagon', target: 15, current: 0 }
    ],
    initialGrid: {
      obstacles: [
        { row: 3, col: 2, type: 'caged' },
        { row: 3, col: 5, type: 'caged' },
        { row: 4, col: 2, type: 'caged' },
        { row: 4, col: 5, type: 'caged' }
      ],
      specials: []
    }
  },
  {
    id: 3,
    round: 3,
    title: '라운드 3: 슬라임 구출과 마법 성',
    rows: 8,
    cols: 8,
    moves: 22,
    targetScore: 7000,
    skillCharges: 2, // 난이도: 상급 (스킬 2회)
    starThresholds: [7000, 9500, 13000],
    goals: [
      { type: 'gem', gemType: 'star', target: 18, current: 0 },
      { type: 'gem', gemType: 'circle', target: 18, current: 0 }
    ],
    initialGrid: {
      obstacles: [
        { row: 2, col: 2, type: 'jar_slime', hp: 2 },
        { row: 2, col: 5, type: 'jar_slime', hp: 2 },
        { row: 5, col: 2, type: 'caged' },
        { row: 5, col: 5, type: 'caged' }
      ],
      specials: []
    }
  },
  {
    id: 4,
    round: 4,
    title: '라운드 4: 크리스털 폭풍 콤보',
    rows: 8,
    cols: 8,
    moves: 24,
    targetScore: 10000,
    skillCharges: 3, // 난이도: 고급 (스킬 3회)
    starThresholds: [10000, 13500, 18000],
    goals: [
      { type: 'gem', gemType: 'diamond', target: 22, current: 0 },
      { type: 'gem', gemType: 'octagon', target: 22, current: 0 }
    ],
    initialGrid: {
      obstacles: [
        { row: 1, col: 1, type: 'caged' },
        { row: 1, col: 6, type: 'caged' },
        { row: 6, col: 1, type: 'caged' },
        { row: 6, col: 6, type: 'caged' },
        { row: 3, col: 3, type: 'jar_slime', hp: 2 },
        { row: 4, col: 4, type: 'jar_slime', hp: 2 }
      ],
      specials: []
    }
  },
  {
    id: 5,
    round: 5,
    title: '라운드 5: 최종 챔피언 챌린지',
    rows: 8,
    cols: 8,
    moves: 26,
    targetScore: 14000,
    skillCharges: 4, // 난이도: 마스터 (스킬 4회)
    starThresholds: [14000, 18500, 24000],
    goals: [
      { type: 'gem', gemType: 'star', target: 25, current: 0 },
      { type: 'gem', gemType: 'octagon', target: 25, current: 0 }
    ],
    initialGrid: {
      obstacles: [
        { row: 2, col: 1, type: 'jar_slime', hp: 2 },
        { row: 2, col: 6, type: 'jar_slime', hp: 2 },
        { row: 5, col: 1, type: 'jar_slime', hp: 2 },
        { row: 5, col: 6, type: 'jar_slime', hp: 2 },
        { row: 3, col: 3, type: 'caged' },
        { row: 4, col: 4, type: 'caged' }
      ],
      specials: []
    }
  }
];
