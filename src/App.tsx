/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Cell, GemType, SpecialType, LevelConfig, BeamEffect, FloatingText, PopEffect, Particle } from './types/game';
import { LEVELS } from './utils/levels';
import { createInitialGrid, findMatches, isValidSwap, getRandomGem, getSafeRefillGem, MatchGroup } from './utils/matchEngine';
import { sounds } from './utils/audio';
import { HeaderUI } from './components/HeaderUI';
import { GameBoard } from './components/GameBoard';
import { SlimeCompanion } from './components/SlimeCompanion';
import { BoosterBar } from './components/BoosterBar';
import { WinLoseModal } from './components/WinLoseModal';
import { StartMenu } from './components/StartMenu';
import { ImplementationPlanView } from './components/ImplementationPlanView';
import fantasyBg from './assets/images/fantasy_kingdom_bg_1790582826945.jpg';

export default function App() {
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const currentLevelConfig = LEVELS[levelIndex] || LEVELS[0];

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [moves, setMoves] = useState<number>(currentLevelConfig.moves);
  const [score, setScore] = useState<number>(0);
  const [goals, setGoals] = useState(currentLevelConfig.goals);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [comboCount, setComboCount] = useState<number>(0);
  const [remainingSkills, setRemainingSkills] = useState<number>(currentLevelConfig.skillCharges);

  // Persistent Game Records
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('jewel_high_score')) || 0;
    } catch {
      return 0;
    }
  });

  const [highestRound, setHighestRound] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('jewel_highest_round')) || 1;
    } catch {
      return 1;
    }
  });

  const [starsMap, setStarsMap] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('jewel_stars_map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // VFX
  const [beamEffects, setBeamEffects] = useState<BeamEffect[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [popEffects, setPopEffects] = useState<PopEffect[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);

  // Main Active View: 'menu' (Start Menu) | 'game' (Playing) | 'plan' (GDD Doc)
  const [activeView, setActiveView] = useState<'menu' | 'game' | 'plan'>('menu');

  // Trigger floating text
  const addFloatingText = useCallback((text: string, x: number, y: number, color = '#fbbf24') => {
    const id = `ft-${Date.now()}-${Math.random()}`;
    setFloatingTexts(prev => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 1200);
  }, []);

  // Celebratory confetti animation on round clear
  const triggerWinCelebration = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    addFloatingText('ROUND CLEAR! 🎯', 100, 80, '#fbbf24');
    setTimeout(() => {
      addFloatingText('목표 점수 돌파! 🚀', 120, 140, '#f43f5e');
    }, 350);

    const confettiColors = ['#f43f5e', '#fbbf24', '#38bdf8', '#34d399', '#a855f7', '#ec4899', '#ffffff', '#f97316'];
    const shapes: ('circle' | 'square' | 'ribbon' | 'star')[] = ['ribbon', 'star', 'square', 'circle'];

    // Wave 1: Immediate cannons from bottom corners
    const createCannon = (originX: number, originY: number, angleDegMin: number, angleDegMax: number, count: number) => {
      const batch: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angleDeg = angleDegMin + Math.random() * (angleDegMax - angleDegMin);
        const rad = (angleDeg * Math.PI) / 180;
        const speed = 2.4 + Math.random() * 3.6;
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const size = shape === 'ribbon' ? 7 + Math.random() * 5 : shape === 'star' ? 12 + Math.random() * 6 : 5 + Math.random() * 4;

        batch.push({
          id: `win-c1-${Date.now()}-${Math.random()}`,
          x: originX + (Math.random() - 0.5) * 6,
          y: originY,
          color,
          size,
          vx: Math.cos(rad) * speed,
          vy: Math.sin(rad) * speed,
          gravity: 0.11,
          vRot: (Math.random() - 0.5) * 22,
          rotation: Math.random() * 360,
          life: 1.4 + Math.random() * 0.4,
          shape
        });
      }
      return batch;
    };

    const leftCannon = createCannon(8, 92, -80, -25, 28);
    const rightCannon = createCannon(92, 92, -155, -100, 28);
    setParticles(prev => [...prev, ...leftCannon, ...rightCannon]);

    // Wave 2: Center firework explosion at 250ms
    setTimeout(() => {
      const centerBurst: Particle[] = [];
      for (let i = 0; i < 34; i++) {
        const rad = Math.random() * Math.PI * 2;
        const speed = 1.4 + Math.random() * 3.2;
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        centerBurst.push({
          id: `win-burst-${Date.now()}-${Math.random()}`,
          x: 50 + (Math.random() - 0.5) * 8,
          y: 45 + (Math.random() - 0.5) * 8,
          color,
          size: 6 + Math.random() * 6,
          vx: Math.cos(rad) * speed,
          vy: Math.sin(rad) * speed - 1.0,
          gravity: 0.09,
          vRot: (Math.random() - 0.5) * 24,
          rotation: Math.random() * 360,
          life: 1.3,
          shape
        });
      }
      setParticles(prev => [...prev, ...centerBurst]);
    }, 250);

    // Wave 3: Top cascading confetti shower at 550ms
    setTimeout(() => {
      const topShower: Particle[] = [];
      for (let i = 0; i < 32; i++) {
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        topShower.push({
          id: `win-top-${Date.now()}-${Math.random()}`,
          x: 5 + Math.random() * 90,
          y: -4 - Math.random() * 10,
          color,
          size: 6 + Math.random() * 5,
          vx: (Math.random() - 0.5) * 1.0,
          vy: 0.8 + Math.random() * 1.4,
          gravity: 0.06,
          vRot: (Math.random() - 0.5) * 16,
          rotation: Math.random() * 360,
          life: 1.6,
          shape
        });
      }
      setParticles(prev => [...prev, ...topShower]);
    }, 550);
  }, [addFloatingText]);

  // Continuous particle physics simulation loop
  useEffect(() => {
    if (particles.length === 0) return;

    const timer = setInterval(() => {
      setParticles(prev => {
        if (prev.length === 0) return prev;
        const next: Particle[] = [];
        for (const p of prev) {
          const gravity = p.gravity ?? 0.11;
          const decay = p.gravity !== undefined ? 0.013 : 0.035;
          const nextLife = p.life - decay;
          if (nextLife <= 0 || p.y > 115) continue;

          next.push({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + gravity,
            rotation: (p.rotation || 0) + (p.vRot || 8),
            life: nextLife
          });
        }
        return next;
      });
    }, 24);

    return () => clearInterval(timer);
  }, [particles.length]);

  // Initialize Level
  const initLevel = useCallback((lvlConfig: LevelConfig) => {
    const newGrid = createInitialGrid(lvlConfig);
    setGrid(newGrid);
    setMoves(lvlConfig.moves);
    setScore(0);
    setGoals(lvlConfig.goals.map(g => ({ ...g, current: 0 })));
    setGameStatus('playing');
    setSelectedCell(null);
    setIsProcessing(false);
    setComboCount(0);
    setRemainingSkills(lvlConfig.skillCharges);
    setBeamEffects([]);
    setFloatingTexts([]);
    setPopEffects([]);
    setParticles([]);
    setIsShaking(false);
    setShowWinModal(false);
  }, []);

  useEffect(() => {
    initLevel(currentLevelConfig);
  }, [currentLevelConfig, initLevel]);

  // Round Clear: 점수 몇 점(targetScore)을 넘기면 즉시 라운드 클리어!
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    // Track high score in real-time
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('jewel_high_score', String(score));
      } catch {}
    }

    const isTargetScoreReached = score >= currentLevelConfig.targetScore;
    if (isTargetScoreReached) {
      setGameStatus('won');
      triggerWinCelebration();

      // Record stars and unlocked highest round
      const earnedStars = score >= currentLevelConfig.starThresholds[2] ? 3 : score >= currentLevelConfig.starThresholds[1] ? 2 : 1;
      setStarsMap(prev => {
        const nextMap = { ...prev, [currentLevelConfig.round]: Math.max(prev[currentLevelConfig.round] || 0, earnedStars) };
        try {
          localStorage.setItem('jewel_stars_map', JSON.stringify(nextMap));
        } catch {}
        return nextMap;
      });

      const nextRoundUnlocked = Math.min(5, Math.max(highestRound, currentLevelConfig.round + 1));
      setHighestRound(nextRoundUnlocked);
      try {
        localStorage.setItem('jewel_highest_round', String(nextRoundUnlocked));
      } catch {}

      setTimeout(() => {
        setShowWinModal(true);
      }, 1200);
    } else if (moves <= 0 && !isProcessing) {
      setGameStatus('lost');
      setTimeout(() => {
        setShowWinModal(true);
      }, 500);
    }
  }, [score, currentLevelConfig, moves, isProcessing, gameStatus, triggerWinCelebration, highScore, highestRound]);

  // Trigger beam visual effect
  const triggerBeam = (type: 'row' | 'col', index: number) => {
    const id = `beam-${Date.now()}-${Math.random()}`;
    sounds.playBeam();
    setBeamEffects(prev => [...prev, { id, type, index, color: '#38bdf8' }]);
    setTimeout(() => {
      setBeamEffects(prev => prev.filter(b => b.id !== id));
    }, 450);
  };

  // Spawn visual blast effects and particles on match
  const triggerMatchVFX = (cells: { row: number; col: number; gemType: GemType | null }[]) => {
    const rows = currentLevelConfig.rows;
    const cols = currentLevelConfig.cols;

    const newPops: PopEffect[] = cells.map(c => ({
      id: `pop-${Date.now()}-${c.row}-${c.col}-${Math.random()}`,
      row: c.row,
      col: c.col,
      color: '#fbbf24',
      gemType: c.gemType
    }));
    setPopEffects(prev => [...prev, ...newPops]);
    setTimeout(() => {
      setPopEffects(prev => prev.filter(p => !newPops.some(np => np.id === p.id)));
    }, 450);

    const newParticles: Particle[] = [];
    cells.forEach(c => {
      const centerX = ((c.col + 0.5) / cols) * 100;
      const centerY = ((c.row + 0.5) / rows) * 100;
      const count = 5 + Math.floor(Math.random() * 3);

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 2.2;
        newParticles.push({
          id: `p-${Date.now()}-${Math.random()}`,
          x: centerX,
          y: centerY,
          color: '#fbbf24',
          size: 4 + Math.random() * 4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0.9 + Math.random() * 0.4
        });
      }
    });

    setParticles(prev => [...prev, ...newParticles]);
  };

  // Match and Drop Cascade Engine
  const runCascade = async (initialGrid: Cell[][], currentCombo = 0) => {
    setIsProcessing(true);
    let workingGrid = initialGrid.map(row => row.map(cell => ({ ...cell })));
    let hasMatches = true;
    let localCombo = currentCombo;
    const MAX_CASCADE_COMBO = 3; // "하나만 움직였는데 한번에 다깨지게 됨 방지": 연쇄 폭발 최대 3콤보 제한

    while (hasMatches && localCombo < MAX_CASCADE_COMBO) {
      const matchGroups = findMatches(workingGrid);
      if (matchGroups.length === 0) {
        hasMatches = false;
        break;
      }

      localCombo++;
      setComboCount(localCombo);
      sounds.playMatch(localCombo);

      const matchedCoords = new Set<string>();
      const newSpecials: { row: number; col: number; type: SpecialType }[] = [];
      const destroyedGems: Record<string, number> = {};

      matchGroups.forEach(group => {
        group.cells.forEach(c => {
          matchedCoords.add(`${c.row},${c.col}`);
        });

        destroyedGems[group.gemType] = (destroyedGems[group.gemType] || 0) + group.cells.length;

        if (group.specialCreated) {
          newSpecials.push(group.specialCreated);
        }
      });

      // Blast VFX & floating combo text
      const matchedCellObjects = Array.from(matchedCoords).map(coord => {
        const [r, c] = coord.split(',').map(Number);
        return { row: r, col: c, gemType: workingGrid[r][c].gemType };
      });
      triggerMatchVFX(matchedCellObjects);

      const hasSquareMatch = matchGroups.some(g => g.isSquare);
      if (hasSquareMatch && localCombo === 1) {
        const sqMatch = matchGroups.find(g => g.isSquare);
        if (sqMatch) {
          addFloatingText(
            '사각형 매치! 🔲',
            (sqMatch.cells[0].col / currentLevelConfig.cols) * 280 + 20,
            (sqMatch.cells[0].row / currentLevelConfig.rows) * 280 + 20,
            '#38bdf8'
          );
        }
      } else if (localCombo > 1) {
        const firstMatch = matchGroups[0]?.cells[0] || { row: 2, col: 2 };
        addFloatingText(
          `${localCombo} COMBO! 🔥`,
          (firstMatch.col / currentLevelConfig.cols) * 280 + 20,
          (firstMatch.row / currentLevelConfig.rows) * 280 + 20,
          '#f59e0b'
        );
      }

      // Check obstacles and bomb detonations
      let slimesFreed = 0;

      matchedCoords.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        const cell = workingGrid[r][c];

        if (cell.obstacle === 'caged') {
          cell.obstacle = 'none';
        }

        // Bomb detonations
        if (cell.special === 'horizontal_bomb') {
          triggerBeam('row', r);
          sounds.playBomb();
          for (let col = 0; col < workingGrid[0].length; col++) {
            matchedCoords.add(`${r},${col}`);
          }
        } else if (cell.special === 'vertical_bomb') {
          triggerBeam('col', c);
          sounds.playBomb();
          for (let row = 0; row < workingGrid.length; row++) {
            matchedCoords.add(`${row},${c}`);
          }
        } else if (cell.special === 'cross_bomb') {
          triggerBeam('row', r);
          triggerBeam('col', c);
          sounds.playBomb();
          for (let col = 0; col < workingGrid[0].length; col++) {
            matchedCoords.add(`${r},${col}`);
          }
          for (let row = 0; row < workingGrid.length; row++) {
            matchedCoords.add(`${row},${c}`);
          }
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < workingGrid.length && nc >= 0 && nc < workingGrid[0].length) {
                matchedCoords.add(`${nr},${nc}`);
              }
            }
          }
        }

        // Damage adjacent obstacles (Jar Slimes)
        const neighbors = [
          [r - 1, c],
          [r + 1, c],
          [r, c - 1],
          [r, c + 1]
        ];

        neighbors.forEach(([nr, nc]) => {
          if (nr >= 0 && nr < workingGrid.length && nc >= 0 && nc < workingGrid[0].length) {
            const neighbor = workingGrid[nr][nc];
            if (neighbor.obstacle === 'jar_slime') {
              if (neighbor.obstacleHp && neighbor.obstacleHp > 1) {
                neighbor.obstacleHp -= 1;
                sounds.playBottleBreak();
                addFloatingText('툭!', nc * 38 + 20, nr * 38 + 20, '#60a5fa');
              } else {
                neighbor.obstacle = 'none';
                neighbor.obstacleHp = 0;
                slimesFreed++;
                sounds.playBottleBreak();
                addFloatingText('슬라임 구출! ✨', nc * 38 + 20, nr * 38 + 20, '#f43f5e');
              }
            }
          }
        });
      });

      // Update Goals & Score
      const earnedScore = matchedCoords.size * 65 * localCombo + slimesFreed * 500;
      setScore(prev => prev + earnedScore);

      setGoals(prevGoals =>
        prevGoals.map(goal => {
          if (goal.type === 'gem' && goal.gemType && destroyedGems[goal.gemType]) {
            return { ...goal, current: Math.min(goal.target, goal.current + destroyedGems[goal.gemType]) };
          }
          if (goal.type === 'jar_slime' && slimesFreed > 0) {
            return { ...goal, current: Math.min(goal.target, goal.current + slimesFreed) };
          }
          return goal;
        })
      );

      // Visual clearing animation
      matchedCoords.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        workingGrid[r][c].isMatched = true;
      });
      setGrid([...workingGrid]);

      await new Promise(res => setTimeout(res, 280));

      // Clear matched cells
      matchedCoords.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        workingGrid[r][c].gemType = null;
        workingGrid[r][c].special = 'none';
        workingGrid[r][c].isMatched = false;
      });

      // Place newly created specials from 4/5 matches
      newSpecials.forEach(spec => {
        workingGrid[spec.row][spec.col].gemType = getRandomGem();
        workingGrid[spec.row][spec.col].special = spec.type;
        sounds.playSwap();
        addFloatingText(
          spec.type === 'horizontal_bomb' ? '가로 폭탄! 💣' : spec.type === 'vertical_bomb' ? '세로 폭탄! 💣' : '십자 폭탄! 💥',
          spec.col * 38 + 20,
          spec.row * 38 + 20,
          '#fbbf24'
        );
      });

      // Gravity: Drop down empty cells
      const numRows = workingGrid.length;
      const numCols = workingGrid[0].length;

      for (let c = 0; c < numCols; c++) {
        let emptyCount = 0;
        for (let r = numRows - 1; r >= 0; r--) {
          const cell = workingGrid[r][c];
          if (cell.gemType === null && cell.obstacle !== 'jar_slime') {
            emptyCount++;
          } else if (emptyCount > 0 && cell.gemType !== null && cell.obstacle !== 'caged') {
            const targetRow = r + emptyCount;
            workingGrid[targetRow][c].gemType = cell.gemType;
            workingGrid[targetRow][c].special = cell.special;
            cell.gemType = null;
            cell.special = 'none';
          }
        }

        // Fill top rows with fresh gems using getSafeRefillGem (bottom-to-top order)
        for (let r = emptyCount - 1; r >= 0; r--) {
          const gemType = getSafeRefillGem(workingGrid, r, c);
          workingGrid[r][c].gemType = gemType;
          workingGrid[r][c].special = 'none';
          workingGrid[r][c].id = `cell-${r}-${c}-${Date.now()}-${Math.random()}`;
        }
      }

      setGrid([...workingGrid]);
      await new Promise(res => setTimeout(res, 220));
    }

    setIsProcessing(false);
  };

  // Perform Swap
  const handleSwap = async (r1: number, c1: number, r2: number, c2: number) => {
    if (isProcessing || gameStatus !== 'playing') return;

    const cell1 = grid[r1][c1];
    const cell2 = grid[r2][c2];

    // Double bomb combo trigger!
    if (cell1.special !== 'none' && cell2.special !== 'none') {
      sounds.playBomb();
      setMoves(m => m - 1);
      setIsProcessing(true);

      const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
      triggerBeam('row', r1);
      triggerBeam('col', c1);
      triggerBeam('row', r2);
      triggerBeam('col', c2);

      newGrid[r1][c1].special = 'cross_bomb';
      newGrid[r2][c2].special = 'cross_bomb';
      setGrid(newGrid);
      await runCascade(newGrid, 1);
      return;
    }

    // Normal swap check
    if (!isValidSwap(grid, r1, c1, r2, c2)) {
      sounds.playSwap();
      return;
    }

    sounds.playSwap();
    setMoves(m => m - 1);

    // Swap gems
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const tempType = newGrid[r1][c1].gemType;
    const tempSpecial = newGrid[r1][c1].special;
    newGrid[r1][c1].gemType = newGrid[r2][c2].gemType;
    newGrid[r1][c1].special = newGrid[r2][c2].special;
    newGrid[r2][c2].gemType = tempType;
    newGrid[r2][c2].special = tempSpecial;

    setGrid(newGrid);
    setSelectedCell(null);

    // Run match cascade
    await runCascade(newGrid, 0);
  };

  // 폭탄 타일 클릭 시 즉시 발동 ("폭탄 발동조건을 클릭으로 해줘 폭탄클릭")
  const triggerBombAt = async (r: number, c: number) => {
    if (isProcessing || gameStatus !== 'playing') return;
    const clickedCell = grid[r][c];
    if (clickedCell.special === 'none') return;

    setIsProcessing(true);
    setSelectedCell(null);
    setMoves(m => m - 1);
    sounds.playBomb();

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);

    const workingGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const matchedCoords = new Set<string>();
    const specialType = clickedCell.special;

    if (specialType === 'horizontal_bomb') {
      triggerBeam('row', r);
      addFloatingText('가로 폭발! 💣', c * 38 + 15, r * 38 + 15, '#f59e0b');
      for (let col = 0; col < workingGrid[0].length; col++) {
        matchedCoords.add(`${r},${col}`);
      }
    } else if (specialType === 'vertical_bomb') {
      triggerBeam('col', c);
      addFloatingText('세로 폭발! 💣', c * 38 + 15, r * 38 + 15, '#38bdf8');
      for (let row = 0; row < workingGrid.length; row++) {
        matchedCoords.add(`${row},${c}`);
      }
    } else if (specialType === 'cross_bomb') {
      triggerBeam('row', r);
      triggerBeam('col', c);
      addFloatingText('십자 대폭발! 💥', c * 38 + 15, r * 38 + 15, '#f43f5e');
      for (let col = 0; col < workingGrid[0].length; col++) {
        matchedCoords.add(`${r},${col}`);
      }
      for (let row = 0; row < workingGrid.length; row++) {
        matchedCoords.add(`${row},${c}`);
      }
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < workingGrid.length && nc >= 0 && nc < workingGrid[0].length) {
            matchedCoords.add(`${nr},${nc}`);
          }
        }
      }
    }

    // Damage obstacles in blast
    let slimesFreed = 0;
    matchedCoords.forEach(key => {
      const [cr, cc] = key.split(',').map(Number);
      const cell = workingGrid[cr][cc];
      if (cell.obstacle === 'caged') {
        cell.obstacle = 'none';
      }
      if (cell.obstacle === 'jar_slime') {
        if (cell.obstacleHp && cell.obstacleHp > 1) {
          cell.obstacleHp -= 1;
          sounds.playBottleBreak();
        } else {
          cell.obstacle = 'none';
          cell.obstacleHp = 0;
          slimesFreed++;
          sounds.playBottleBreak();
        }
      }
    });

    const cellsToPop = Array.from(matchedCoords).map(key => {
      const [cr, cc] = key.split(',').map(Number);
      return { row: cr, col: cc, gemType: workingGrid[cr][cc].gemType };
    });
    triggerMatchVFX(cellsToPop);

    const earnedScore = matchedCoords.size * 80 + slimesFreed * 500;
    setScore(s => s + earnedScore);

    setGoals(prev => prev.map(g => {
      if (g.type === 'jar_slime' && slimesFreed > 0) {
        return { ...g, current: Math.min(g.target, g.current + slimesFreed) };
      }
      return g;
    }));

    // Mark matched
    matchedCoords.forEach(key => {
      const [cr, cc] = key.split(',').map(Number);
      workingGrid[cr][cc].isMatched = true;
    });
    setGrid([...workingGrid]);

    await new Promise(res => setTimeout(res, 280));

    // Clear matched
    matchedCoords.forEach(key => {
      const [cr, cc] = key.split(',').map(Number);
      workingGrid[cr][cc].gemType = null;
      workingGrid[cr][cc].special = 'none';
      workingGrid[cr][cc].isMatched = false;
    });

    // Gravity drop
    const numRows = workingGrid.length;
    const numCols = workingGrid[0].length;
    for (let col = 0; col < numCols; col++) {
      let emptyCount = 0;
      for (let row = numRows - 1; row >= 0; row--) {
        const cell = workingGrid[row][col];
        if (cell.gemType === null && cell.obstacle !== 'jar_slime') {
          emptyCount++;
        } else if (emptyCount > 0 && cell.gemType !== null && cell.obstacle !== 'caged') {
          const targetRow = row + emptyCount;
          workingGrid[targetRow][col].gemType = cell.gemType;
          workingGrid[targetRow][col].special = cell.special;
          cell.gemType = null;
          cell.special = 'none';
        }
      }

      // Refill top with pure gems using getSafeRefillGem
      for (let row = emptyCount - 1; row >= 0; row--) {
        const gemType = getSafeRefillGem(workingGrid, row, col);
        workingGrid[row][col].gemType = gemType;
        workingGrid[row][col].special = 'none';
        workingGrid[row][col].id = `cell-${row}-${col}-${Date.now()}-${Math.random()}`;
      }
    }

    setGrid([...workingGrid]);
    await new Promise(res => setTimeout(res, 220));

    // Run cascade for any resulting matches
    await runCascade(workingGrid, 1);
  };

  // Cell Click Handler
  const handleCellClick = (r: number, c: number) => {
    if (isProcessing || gameStatus !== 'playing') return;

    const clickedCell = grid[r][c];

    // "폭탄 발동조건을 클릭으로 해줘 폭탄클릭": 폭탄 타일 클릭 시 즉시 폭발!
    if (clickedCell.special !== 'none') {
      triggerBombAt(r, c);
      return;
    }

    if (!selectedCell) {
      setSelectedCell({ row: r, col: c });
      sounds.playSwap();
    } else {
      const dist = Math.abs(selectedCell.row - r) + Math.abs(selectedCell.col - c);
      if (dist === 1) {
        handleSwap(selectedCell.row, selectedCell.col, r, c);
      } else {
        setSelectedCell({ row: r, col: c });
        sounds.playSwap();
      }
    }
  };

  // Bomb Skills (폭탄 전용 스킬들 - 라운드당 제한된 횟수)
  const handleUseHorizontalBomb = () => {
    if (remainingSkills <= 0 || isProcessing || gameStatus !== 'playing') {
      sounds.playSwap();
      addFloatingText('스킬 횟수 소진!', 140, 100, '#ef4444');
      return;
    }

    sounds.playBeam();
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

    let target = selectedCell;
    if (!target || !newGrid[target.row][target.col].gemType) {
      const candidates: { r: number; c: number }[] = [];
      newGrid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell.gemType && cell.obstacle === 'none' && cell.special === 'none') {
            candidates.push({ r, c });
          }
        });
      });
      if (candidates.length > 0) {
        target = { row: candidates[Math.floor(Math.random() * candidates.length)].r, col: candidates[Math.floor(Math.random() * candidates.length)].c };
      }
    }

    if (target) {
      setRemainingSkills(s => s - 1);
      newGrid[target.row][target.col].special = 'horizontal_bomb';
      setGrid(newGrid);
      addFloatingText(`💣 가로 폭탄 장착! (${remainingSkills - 1}회 남음)`, target.col * 38 + 20, target.row * 38 + 20, '#f59e0b');
      setSelectedCell(null);
    }
  };

  const handleUseVerticalBomb = () => {
    if (remainingSkills <= 0 || isProcessing || gameStatus !== 'playing') {
      sounds.playSwap();
      addFloatingText('스킬 횟수 소진!', 140, 100, '#ef4444');
      return;
    }

    sounds.playBeam();
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

    let target = selectedCell;
    if (!target || !newGrid[target.row][target.col].gemType) {
      const candidates: { r: number; c: number }[] = [];
      newGrid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell.gemType && cell.obstacle === 'none' && cell.special === 'none') {
            candidates.push({ r, c });
          }
        });
      });
      if (candidates.length > 0) {
        target = { row: candidates[Math.floor(Math.random() * candidates.length)].r, col: candidates[Math.floor(Math.random() * candidates.length)].c };
      }
    }

    if (target) {
      setRemainingSkills(s => s - 1);
      newGrid[target.row][target.col].special = 'vertical_bomb';
      setGrid(newGrid);
      addFloatingText(`💣 세로 폭탄 장착! (${remainingSkills - 1}회 남음)`, target.col * 38 + 20, target.row * 38 + 20, '#38bdf8');
      setSelectedCell(null);
    }
  };

  const handleUseCrossBomb = () => {
    if (remainingSkills <= 0 || isProcessing || gameStatus !== 'playing') {
      sounds.playSwap();
      addFloatingText('스킬 횟수 소진!', 140, 100, '#ef4444');
      return;
    }

    sounds.playBomb();
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

    let target = selectedCell;
    if (!target || !newGrid[target.row][target.col].gemType) {
      const candidates: { r: number; c: number }[] = [];
      newGrid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell.gemType && cell.obstacle === 'none' && cell.special === 'none') {
            candidates.push({ r, c });
          }
        });
      });
      if (candidates.length > 0) {
        target = { row: candidates[Math.floor(Math.random() * candidates.length)].r, col: candidates[Math.floor(Math.random() * candidates.length)].c };
      }
    }

    if (target) {
      setRemainingSkills(s => s - 1);
      newGrid[target.row][target.col].special = 'cross_bomb';
      setGrid(newGrid);
      addFloatingText(`💥 십자 폭탄 장착! (${remainingSkills - 1}회 남음)`, target.col * 38 + 20, target.row * 38 + 20, '#f43f5e');
      setSelectedCell(null);
    }
  };

  const startPlaying = (roundIdx?: number) => {
    if (roundIdx !== undefined) {
      setLevelIndex(roundIdx);
      initLevel(LEVELS[roundIdx]);
    } else {
      initLevel(currentLevelConfig);
    }
    setActiveView('game');
  };

  return (
    <div className="min-h-screen max-w-screen overflow-x-hidden bg-slate-900 flex flex-col justify-between relative touch-none-game">
      
      {/* High-Fidelity Fantasy Kingdom Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={fantasyBg}
          alt="Fairytale Kingdom Landscape"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.88] saturate-[1.15]"
          referrerPolicy="no-referrer"
        />
        {/* Atmospheric game gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/40 via-sky-900/20 to-slate-950/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(15,23,42,0.6)_100%)]" />

        {/* Soft glowing ambient lights */}
        <div className="absolute top-12 left-8 w-44 h-16 bg-white/30 rounded-full blur-2xl" />
        <div className="absolute top-28 right-6 w-56 h-20 bg-amber-200/20 rounded-full blur-2xl" />
      </div>

      {/* Main View Router: 'menu' (Start Menu) | 'game' (Playing) | 'plan' (GDD Doc) */}
      {activeView === 'menu' ? (
        <StartMenu
          onStartGame={startPlaying}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            setSoundEnabled(!soundEnabled);
            sounds.enabled = !soundEnabled;
          }}
          onOpenDoc={() => setActiveView('plan')}
          highScore={highScore}
          highestRound={highestRound}
          starsMap={starsMap}
        />
      ) : activeView === 'plan' ? (
        <div className="relative z-10 p-2 md:p-6 overflow-y-auto">
          <ImplementationPlanView onBackToGame={() => setActiveView('game')} />
        </div>
      ) : (
        <main className="relative z-10 w-full flex flex-col items-center justify-start pb-4">
          
          {/* Header UI */}
          <HeaderUI
            levelId={currentLevelConfig.id}
            round={currentLevelConfig.round}
            targetScore={currentLevelConfig.targetScore}
            moves={moves}
            score={score}
            goals={goals}
            starThresholds={currentLevelConfig.starThresholds}
            soundEnabled={soundEnabled}
            onToggleSound={() => {
              setSoundEnabled(!soundEnabled);
              sounds.enabled = !soundEnabled;
            }}
            onRestart={() => initLevel(currentLevelConfig)}
            onOpenDoc={() => setActiveView('plan')}
            onGoToMenu={() => setActiveView('menu')}
          />

          {/* Interactive Slime Companion */}
          <div className="w-full max-w-[430px]">
            <SlimeCompanion
              moves={moves}
              comboCount={comboCount}
              isWon={gameStatus === 'won'}
            />
          </div>

          {/* Game Board: Square 8x8 format */}
          <GameBoard
            grid={grid}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
            onSwipe={handleSwap}
            beamEffects={beamEffects}
            floatingTexts={floatingTexts}
            popEffects={popEffects}
            particles={particles}
            hammerActive={false}
            isProcessing={isProcessing}
            isShaking={isShaking}
          />

          {/* Booster Bar: strictly bomb skills with limited charges per round */}
          <BoosterBar
            remainingSkills={remainingSkills}
            maxSkills={currentLevelConfig.skillCharges}
            onUseHorizontalBomb={handleUseHorizontalBomb}
            onUseVerticalBomb={handleUseVerticalBomb}
            onUseCrossBomb={handleUseCrossBomb}
            currentLevel={currentLevelConfig.round}
            onSelectLevel={(roundNum) => {
              const idx = LEVELS.findIndex(l => l.round === roundNum);
              if (idx !== -1) {
                setLevelIndex(idx);
                initLevel(LEVELS[idx]);
              }
            }}
          />
        </main>
      )}

      {/* Bottom Fantasy Banner (Only during game or menu) */}
      {activeView !== 'plan' && (
        <footer className="relative w-full z-10 pointer-events-none mt-1 sm:mt-2">
          <div className="relative w-full max-w-[430px] mx-auto h-16 sm:h-24 overflow-hidden flex items-end justify-between px-3 sm:px-4">
            
            {/* Left Text Banner */}
            <div className="pb-2 sm:pb-3 z-20">
              <div className="bg-red-600/95 text-white font-black text-sm sm:text-lg px-3 py-1.5 rounded-2xl shadow-xl border-2 border-white tracking-tight flex flex-col">
                <span className="leading-tight drop-shadow">인기 매칭 3</span>
                <span className="leading-tight drop-shadow">보석 퍼즐</span>
              </div>
            </div>

            {/* Right Fantasy Castle */}
            <div className="relative w-18 h-18 sm:w-24 sm:h-24 z-10 flex items-end">
              <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl">
                <defs>
                  <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#9f1239" />
                  </linearGradient>
                  <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                </defs>

                <rect x="35" y="45" width="50" height="70" rx="4" fill="url(#wallGrad)" stroke="#94a3b8" strokeWidth="2" />
                <polygon points="60,10 25,48 95,48" fill="url(#roofGrad)" stroke="#881337" strokeWidth="2" />
                <polygon points="60,10 70,5 60,0" fill="#facc15" />
                <line x1="60" y1="0" x2="60" y2="12" stroke="#475569" strokeWidth="1.5" />

                <rect x="18" y="60" width="20" height="55" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                <polygon points="28,35 12,62 44,62" fill="url(#roofGrad)" />
                
                <rect x="82" y="60" width="20" height="55" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                <polygon points="92,35 76,62 108,62" fill="url(#roofGrad)" />

                <path d="M 50 115 L 50 85 C 50 78 70 78 70 85 L 70 115 Z" fill="#581c87" stroke="#3b0764" strokeWidth="2" />
                <polygon points="46,118 74,118 80,125 40,125" fill="#e11d48" />

                <rect x="55" y="58" width="10" height="12" rx="4" fill="#38bdf8" />
                <rect x="24" y="75" width="8" height="10" rx="3" fill="#38bdf8" />
                <rect x="88" y="75" width="8" height="10" rx="3" fill="#38bdf8" />
              </svg>
            </div>
          </div>

          <div className="w-full h-4 sm:h-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 shadow-inner" />
        </footer>
      )}

      {/* Win / Lose Modal */}
      <WinLoseModal
        status={showWinModal ? gameStatus : 'playing'}
        round={currentLevelConfig.round}
        score={score}
        targetScore={currentLevelConfig.targetScore}
        starThresholds={currentLevelConfig.starThresholds}
        onRestart={() => initLevel(currentLevelConfig)}
        onNextLevel={() => {
          const nextIndex = (levelIndex + 1) % LEVELS.length;
          setLevelIndex(nextIndex);
          initLevel(LEVELS[nextIndex]);
        }}
        onAddMoves={() => {
          setMoves(m => m + 5);
          setGameStatus('playing');
          setShowWinModal(false);
        }}
        onGoToMenu={() => {
          setShowWinModal(false);
          setActiveView('menu');
        }}
      />
    </div>
  );
}
