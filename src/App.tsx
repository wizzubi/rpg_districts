import { useEffect, useRef } from 'react';
import { createGame } from './game';

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = createGame(containerRef.current);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <main className="app-shell">
      <div className="hud">
        <span className="badge">Kenney City</span>
        <h1>RPG Big Map</h1>
        <p>WASD / Arrow Keys to move</p>
      </div>
      <div ref={containerRef} className="game-stage" />
    </main>
  );
}
