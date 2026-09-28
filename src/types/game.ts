export type GemType = 'star' | 'diamond' | 'circle' | 'octagon';

export type SpecialType = 'none' | 'horizontal_bomb' | 'vertical_bomb' | 'cross_bomb';

export type ObstacleType = 'none' | 'caged' | 'jar_slime' | 'potion_bottle';

export interface Cell {
  id: string;
  row: number;
  col: number;
  gemType: GemType | null;
  special: SpecialType;
  obstacle: ObstacleType;
  obstacleHp?: number; // e.g. jar takes 2 hits
  isMatched?: boolean;
  isNew?: boolean;
}

export interface LevelGoal {
  type: 'gem' | 'jar_slime' | 'potion_bottle';
  gemType?: GemType;
  target: number;
  current: number;
}

export interface LevelConfig {
  id: number;
  round: number;
  title: string;
  rows: number;
  cols: number;
  moves: number;
  targetScore: number;
  skillCharges: number; // 라운드당 사용 가능한 스킬 개수 (난이도에 따라 증가)
  starThresholds: [number, number, number];
  goals: LevelGoal[];
  initialGrid?: {
    obstacles?: { row: number; col: number; type: ObstacleType; hp?: number }[];
    specials?: { row: number; col: number; special: SpecialType }[];
  };
}

export interface Particle {
  id: string;
  x: number; // percentage in board (0 to 100)
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  life: number;
  rotation?: number;
  vRot?: number;
  shape?: 'circle' | 'square' | 'ribbon' | 'star';
  gravity?: number;
}

export interface PopEffect {
  id: string;
  row: number;
  col: number;
  color: string;
  gemType: GemType | null;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export interface BeamEffect {
  id: string;
  type: 'row' | 'col';
  index: number;
  color: string;
}
