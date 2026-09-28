import { Cell, GemType, SpecialType, ObstacleType, LevelConfig } from '../types/game';

// 4 simple, iconic gem types matching user reference image
export const GEM_TYPES: GemType[] = ['star', 'diamond', 'circle', 'octagon'];

export function getRandomGem(): GemType {
  return GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
}

// Bombs are purely skill-based, no random natural spawns
export function getRandomSpecial(): SpecialType {
  return 'none';
}

/**
 * Smart refill generator: picks a gem color that does not immediately
 * form an accidental auto-match (3-in-a-row or 2x2 square) upon falling.
 * This prevents a single move from triggering an endless runaway cascade.
 */
export function getSafeRefillGem(grid: Cell[][], r: number, c: number): GemType {
  const shuffled = [...GEM_TYPES].sort(() => Math.random() - 0.5);

  for (const type of shuffled) {
    // 1. Check horizontal 3
    if (c >= 2 && grid[r][c - 1]?.gemType === type && grid[r][c - 2]?.gemType === type) continue;
    if (c >= 1 && c < grid[0].length - 1 && grid[r][c - 1]?.gemType === type && grid[r][c + 1]?.gemType === type) continue;
    if (c < grid[0].length - 2 && grid[r][c + 1]?.gemType === type && grid[r][c + 2]?.gemType === type) continue;

    // 2. Check vertical 3 (with cells below)
    if (r < grid.length - 2 && grid[r + 1]?.[c]?.gemType === type && grid[r + 2]?.[c]?.gemType === type) continue;

    // 3. Check 2x2 squares with adjacent neighbors
    // Bottom-right 2x2
    if (r < grid.length - 1 && c < grid[0].length - 1 &&
        grid[r + 1][c]?.gemType === type &&
        grid[r][c + 1]?.gemType === type &&
        grid[r + 1][c + 1]?.gemType === type) continue;

    // Bottom-left 2x2
    if (r < grid.length - 1 && c > 0 &&
        grid[r + 1][c]?.gemType === type &&
        grid[r][c - 1]?.gemType === type &&
        grid[r + 1][c - 1]?.gemType === type) continue;

    // Top-right 2x2
    if (r > 0 && c < grid[0].length - 1 &&
        grid[r - 1][c]?.gemType === type &&
        grid[r][c + 1]?.gemType === type &&
        grid[r - 1][c + 1]?.gemType === type) continue;

    // Top-left 2x2
    if (r > 0 && c > 0 &&
        grid[r - 1][c]?.gemType === type &&
        grid[r][c - 1]?.gemType === type &&
        grid[r - 1][c - 1]?.gemType === type) continue;

    return type;
  }

  return getRandomGem();
}

export function createInitialGrid(level: LevelConfig): Cell[][] {
  const { rows, cols, initialGrid } = level;
  const grid: Cell[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      const obstacleConfig = initialGrid?.obstacles?.find(o => o.row === r && o.col === c);
      const specialConfig = initialGrid?.specials?.find(s => s.row === r && s.col === c);

      let obstacle: ObstacleType = obstacleConfig?.type || 'none';
      let obstacleHp = obstacleConfig?.hp ?? (obstacle === 'jar_slime' ? 2 : undefined);
      let special: SpecialType = specialConfig?.special || 'none';

      let gemType: GemType | null = getRandomGem();
      if (obstacle === 'potion_bottle') {
        gemType = null;
      }

      row.push({
        id: `cell-${r}-${c}-${Date.now()}-${Math.random()}`,
        row: r,
        col: c,
        gemType,
        special,
        obstacle,
        obstacleHp
      });
    }
    grid.push(row);
  }

  // Prevent initial auto-matches (both 3-in-a-row and 2x2 squares)
  removeInitialMatches(grid);

  return grid;
}

function removeInitialMatches(grid: Cell[][]) {
  const rows = grid.length;
  const cols = grid[0].length;
  let hasMatch = true;
  let iterations = 0;

  while (hasMatch && iterations < 35) {
    iterations++;
    hasMatch = false;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c];
        if (!cell.gemType) continue;

        // Check horizontal 3
        if (c >= 2 && grid[r][c - 1].gemType === cell.gemType && grid[r][c - 2].gemType === cell.gemType) {
          hasMatch = true;
          let newType = getRandomGem();
          while (newType === cell.gemType) newType = getRandomGem();
          cell.gemType = newType;
        }

        // Check vertical 3
        if (r >= 2 && grid[r - 1][c].gemType === cell.gemType && grid[r - 2][c].gemType === cell.gemType) {
          hasMatch = true;
          let newType = getRandomGem();
          while (newType === cell.gemType) newType = getRandomGem();
          cell.gemType = newType;
        }

        // Check 2x2 square match
        if (r >= 1 && c >= 1) {
          if (
            grid[r - 1][c].gemType === cell.gemType &&
            grid[r][c - 1].gemType === cell.gemType &&
            grid[r - 1][c - 1].gemType === cell.gemType
          ) {
            hasMatch = true;
            let newType = getRandomGem();
            while (newType === cell.gemType) newType = getRandomGem();
            cell.gemType = newType;
          }
        }
      }
    }
  }
}

export interface MatchGroup {
  cells: { row: number; col: number }[];
  gemType: GemType;
  specialCreated?: { row: number; col: number; type: SpecialType };
  isSquare?: boolean;
}

export function findMatches(grid: Cell[][]): MatchGroup[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const groups: MatchGroup[] = [];

  // 1. Horizontal matches (가로 3개 이상)
  for (let r = 0; r < rows; r++) {
    let matchLen = 1;
    for (let c = 0; c < cols; c++) {
      const current = grid[r][c];
      const next = c < cols - 1 ? grid[r][c + 1] : null;

      const isCurrentValid = current.gemType !== null;
      const isNextValid = next && next.gemType !== null;

      if (isCurrentValid && isNextValid && current.gemType === next?.gemType) {
        matchLen++;
      } else {
        if (matchLen >= 3 && isCurrentValid) {
          const cells: { row: number; col: number }[] = [];
          for (let k = 0; k < matchLen; k++) {
            const mc = c - k;
            cells.push({ row: r, col: mc });
          }

          groups.push({
            cells,
            gemType: current.gemType!
          });
        }
        matchLen = 1;
      }
    }
  }

  // 2. Vertical matches (세로 3개 이상)
  for (let c = 0; c < cols; c++) {
    let matchLen = 1;
    for (let r = 0; r < rows; r++) {
      const current = grid[r][c];
      const next = r < rows - 1 ? grid[r + 1][c] : null;

      const isCurrentValid = current.gemType !== null;
      const isNextValid = next && next.gemType !== null;

      if (isCurrentValid && isNextValid && current.gemType === next?.gemType) {
        matchLen++;
      } else {
        if (matchLen >= 3 && isCurrentValid) {
          const cells: { row: number; col: number }[] = [];
          for (let k = 0; k < matchLen; k++) {
            const mr = r - k;
            cells.push({ row: mr, col: c });
          }

          groups.push({
            cells,
            gemType: current.gemType!
          });
        }
        matchLen = 1;
      }
    }
  }

  // 3. 2x2 Square matches (2x2 사각형 매치)
  // Check distinct non-overlapping or clean 2x2 square blocks
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const c1 = grid[r][c];
      const c2 = grid[r][c + 1];
      const c3 = grid[r + 1][c];
      const c4 = grid[r + 1][c + 1];

      if (
        c1.gemType !== null &&
        c1.gemType === c2.gemType &&
        c1.gemType === c3.gemType &&
        c1.gemType === c4.gemType
      ) {
        groups.push({
          cells: [
            { row: r, col: c },
            { row: r, col: c + 1 },
            { row: r + 1, col: c },
            { row: r + 1, col: c + 1 }
          ],
          gemType: c1.gemType,
          isSquare: true
        });
      }
    }
  }

  return groups;
}

export function isValidSwap(grid: Cell[][], r1: number, c1: number, r2: number, c2: number): boolean {
  const dist = Math.abs(r1 - r2) + Math.abs(c1 - c2);
  if (dist !== 1) return false;

  const cell1 = grid[r1][c1];
  const cell2 = grid[r2][c2];

  if (cell1.obstacle === 'caged' || cell2.obstacle === 'caged') return false;

  // Two bombs can always swap to trigger double combo
  if (cell1.special !== 'none' && cell2.special !== 'none') return true;

  // Clone grid and test swap
  const cloned = grid.map(row => row.map(cell => ({ ...cell })));
  const tempType = cloned[r1][c1].gemType;
  const tempSpecial = cloned[r1][c1].special;
  cloned[r1][c1].gemType = cloned[r2][c2].gemType;
  cloned[r1][c1].special = cloned[r2][c2].special;
  cloned[r2][c2].gemType = tempType;
  cloned[r2][c2].special = tempSpecial;

  // If one of the swapped cells is a bomb, allow swap
  if (cell1.special !== 'none' || cell2.special !== 'none') {
    return true;
  }

  const matches = findMatches(cloned);
  return matches.length > 0;
}
