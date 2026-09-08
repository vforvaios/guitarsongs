import { useCallback, useEffect, useRef, useState } from "react";
import "../../../styles/DodgeGame.scss";

type Enemy = {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
};

type Player = {
  x: number;
  y: number;
};

const PLAYER_SIZE = 26;
const ENEMY_SIZE = 24;

const PLAYER_SPEED = 300;

const INITIAL_SPAWN_RATE = 900;
const MIN_SPAWN_RATE = 180;

const INITIAL_ENEMY_SPEED = 100;
const MAX_ENEMY_SPEED = 350;

export default function DodgeGame() {
  const gameRef = useRef<HTMLDivElement>(null);

  const playerRef = useRef<Player>({
    x: 0,
    y: 0,
  });

  const enemiesRef = useRef<Enemy[]>([]);

  const keysRef = useRef<Set<string>>(new Set());

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const enemyIdRef = useRef(0);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [score, setScore] = useState(0);

  const [bestScore, setBestScore] = useState(() => {
    return Number(localStorage.getItem("dodge-best-score") ?? 0);
  });

  const [playerPosition, setPlayerPosition] = useState<Player>({
    x: 0,
    y: 0,
  });

  const [enemies, setEnemies] = useState<Enemy[]>([]);

  /*
   * Get arena dimensions
   */
  const getGameSize = useCallback(() => {
    if (!gameRef.current) {
      return {
        width: 600,
        height: 600,
      };
    }

    return {
      width: gameRef.current.clientWidth,
      height: gameRef.current.clientHeight,
    };
  }, []);

  /*
   * Reset game
   */
  const resetGame = useCallback(() => {
    const { width, height } = getGameSize();

    const player = {
      x: width / 2 - PLAYER_SIZE / 2,
      y: height / 2 - PLAYER_SIZE / 2,
    };

    playerRef.current = player;

    enemiesRef.current = [];

    setPlayerPosition(player);
    setEnemies([]);
    setScore(0);
    setGameOver(false);
  }, [getGameSize]);

  /*
   * Start game
   */
  const startGame = useCallback(() => {
    resetGame();

    const now = performance.now();

    startTimeRef.current = now;
    lastTimeRef.current = now;
    lastSpawnRef.current = now;

    setGameStarted(true);
  }, [resetGame]);

  /*
   * Finish game
   */
  const finishGame = useCallback(
    (finalScore: number) => {
      setGameStarted(false);
      setGameOver(true);

      if (finalScore > bestScore) {
        setBestScore(finalScore);

        localStorage.setItem("dodge-best-score", String(finalScore));
      }
    },
    [bestScore],
  );

  /*
   * Keyboard controls
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      const movementKeys = [
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "w",
        "a",
        "s",
        "d",
      ];

      if (movementKeys.includes(key)) {
        event.preventDefault();
        keysRef.current.add(key);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  /*
   * Spawn enemy
   */
  const spawnEnemy = useCallback(() => {
    const { width, height } = getGameSize();

    const side = Math.floor(Math.random() * 4);

    let x = 0;
    let y = 0;

    const targetX = width / 2 + (Math.random() - 0.5) * 200;

    const targetY = height / 2 + (Math.random() - 0.5) * 200;

    switch (side) {
      case 0:
        // Top
        x = Math.random() * width;
        y = -ENEMY_SIZE;
        break;

      case 1:
        // Right
        x = width + ENEMY_SIZE;
        y = Math.random() * height;
        break;

      case 2:
        // Bottom
        x = Math.random() * width;
        y = height + ENEMY_SIZE;
        break;

      case 3:
        // Left
        x = -ENEMY_SIZE;
        y = Math.random() * height;
        break;
    }

    const dx = targetX - x;
    const dy = targetY - y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const elapsed = (performance.now() - startTimeRef.current) / 1000;

    const speed = Math.min(INITIAL_ENEMY_SPEED + elapsed * 8, MAX_ENEMY_SPEED);

    const enemy: Enemy = {
      id: enemyIdRef.current++,
      x,
      y,
      size: ENEMY_SIZE,
      vx: (dx / distance) * speed,
      vy: (dy / distance) * speed,
    };

    enemiesRef.current.push(enemy);
  }, [getGameSize]);

  /*
   * Collision detection
   */
  const isColliding = (player: Player, enemy: Enemy) => {
    return (
      player.x < enemy.x + enemy.size &&
      player.x + PLAYER_SIZE > enemy.x &&
      player.y < enemy.y + enemy.size &&
      player.y + PLAYER_SIZE > enemy.y
    );
  };

  /*
   * Main game loop
   */
  useEffect(() => {
    if (!gameStarted) {
      return;
    }

    const gameLoop = (time: number) => {
      const deltaTime = Math.min((time - lastTimeRef.current) / 1000, 0.05);

      lastTimeRef.current = time;

      const { width, height } = getGameSize();

      /*
       * Difficulty
       */
      const elapsed = (time - startTimeRef.current) / 1000;

      const spawnRate = Math.max(
        INITIAL_SPAWN_RATE - elapsed * 12,
        MIN_SPAWN_RATE,
      );

      /*
       * Keyboard movement
       */
      const player = playerRef.current;

      const keys = keysRef.current;

      let dx = 0;
      let dy = 0;

      if (keys.has("arrowleft") || keys.has("a")) {
        dx -= 1;
      }

      if (keys.has("arrowright") || keys.has("d")) {
        dx += 1;
      }

      if (keys.has("arrowup") || keys.has("w")) {
        dy -= 1;
      }

      if (keys.has("arrowdown") || keys.has("s")) {
        dy += 1;
      }

      /*
       * Normalize diagonal movement
       */
      if (dx !== 0 || dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);

        dx /= length;
        dy /= length;
      }

      player.x += dx * PLAYER_SPEED * deltaTime;

      player.y += dy * PLAYER_SPEED * deltaTime;

      /*
       * Keep player inside arena
       */
      player.x = Math.max(0, Math.min(player.x, width - PLAYER_SIZE));

      player.y = Math.max(0, Math.min(player.y, height - PLAYER_SIZE));

      /*
       * Spawn enemies
       */
      if (time - lastSpawnRef.current >= spawnRate) {
        spawnEnemy();

        lastSpawnRef.current = time;
      }

      /*
       * Move enemies
       */
      const currentEnemies = enemiesRef.current;

      for (const enemy of currentEnemies) {
        enemy.x += enemy.vx * deltaTime;

        enemy.y += enemy.vy * deltaTime;

        /*
         * Collision
         */
        if (isColliding(player, enemy)) {
          const finalScore = Math.floor(elapsed * 100);

          setScore(finalScore);

          finishGame(finalScore);

          return;
        }
      }

      /*
       * Remove enemies outside arena
       */
      enemiesRef.current = currentEnemies.filter(
        (enemy) =>
          enemy.x > -100 &&
          enemy.x < width + 100 &&
          enemy.y > -100 &&
          enemy.y < height + 100,
      );

      /*
       * Update UI
       */
      setPlayerPosition({
        x: player.x,
        y: player.y,
      });

      setEnemies([...enemiesRef.current]);

      setScore(Math.floor(elapsed * 100));

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, getGameSize, spawnEnemy, finishGame]);

  /*
   * Touch controls ONLY
   *
   * Mouse is deliberately ignored.
   */
  const handleTouchMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!gameStarted || event.pointerType !== "touch" || !gameRef.current) {
      return;
    }

    const rect = gameRef.current.getBoundingClientRect();

    const x = event.clientX - rect.left - PLAYER_SIZE / 2;

    const y = event.clientY - rect.top - PLAYER_SIZE / 2;

    const { width, height } = getGameSize();

    const newPosition = {
      x: Math.max(0, Math.min(x, width - PLAYER_SIZE)),
      y: Math.max(0, Math.min(y, height - PLAYER_SIZE)),
    };

    playerRef.current = newPosition;

    setPlayerPosition(newPosition);
  };

  return (
    <div className="dodge-game">
      {/* Header */}
      <div className="dodge-game__header">
        <div>
          <span>TIME</span>

          <strong>{(score / 100).toFixed(1)}s</strong>
        </div>

        <div>
          <span>SCORE</span>

          <strong>{score}</strong>
        </div>

        <div>
          <span>BEST</span>

          <strong>{bestScore}</strong>
        </div>
      </div>

      {/* Game arena */}
      <div
        ref={gameRef}
        className="dodge-game__arena"
        onPointerMove={handleTouchMove}
      >
        {/* Player */}
        <div
          className="dodge-game__player"
          style={{
            transform: `translate3d(
              ${playerPosition.x}px,
              ${playerPosition.y}px,
              0
            )`,
          }}
        />

        {/* Enemies */}
        {enemies.map((enemy) => (
          <div
            key={enemy.id}
            className="dodge-game__enemy"
            style={{
              width: enemy.size,
              height: enemy.size,
              transform: `translate3d(
                ${enemy.x}px,
                ${enemy.y}px,
                0
              )`,
            }}
          />
        ))}

        {/* Start screen */}
        {!gameStarted && !gameOver && (
          <div className="dodge-game__overlay">
            <div className="dodge-game__modal">
              <h1>DODGE</h1>

              <p>Avoid the blocks and survive as long as you can.</p>

              <div className="dodge-game__controls">
                <span>⌨️ WASD / ARROWS</span>

                <span>📱 TOUCH</span>
              </div>

              <button onClick={startGame}>PLAY</button>
            </div>
          </div>
        )}

        {/* Game over */}
        {gameOver && (
          <div className="dodge-game__overlay">
            <div className="dodge-game__modal">
              <h1>GAME OVER</h1>

              <div className="dodge-game__final-score">
                <span>SCORE</span>

                <strong>{score}</strong>
              </div>

              {score >= bestScore && score > 0 && (
                <div className="dodge-game__new-record">🏆 NEW RECORD!</div>
              )}

              <button onClick={startGame}>PLAY AGAIN</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
