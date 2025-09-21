import { useEffect, useRef } from "react";
import { usePendulums } from "../hooks/usePendulums";
import Controls from "../components/Controls";

const FRONTEND_ORDER = [
  "pendulum-3001",
  "pendulum-3002",
  "pendulum-3003",
  "pendulum-3004",
  "pendulum-3005",
];

function computeRadius(mass: number) {
  return 8 + Math.sqrt(mass) * 3;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    pendulumMapRef,
    running,
    showLabels,
    pauseOnCollision,
    wind,
    setShowLabels,
    handleStart,
    handlePause,
    handleStop,
    togglePauseOnCollision,
    updateWind,
  } = usePendulums();

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      FRONTEND_ORDER.forEach((id, idx) => {
        const p = pendulumMapRef.current.get(id);
        if (!p) return;

        const originX =
          canvas.width / 2 - FRONTEND_ORDER.length * 75 + idx * 150;
        const originY = 50;
        const x = originX + p.state.length * 100 * Math.sin(p.state.theta);
        const y = originY + p.state.length * 100 * Math.cos(p.state.theta);
        const radius = computeRadius(p.state.mass);

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isColliding ? "#f1c40f" : "#e74c3c";
        ctx.strokeStyle = p.isColliding ? "#f39c12" : "#c0392b";
        ctx.fill();
        ctx.stroke();

        if (showLabels) {
          ctx.font = "12px Arial";
          ctx.fillStyle = "#000";
          ctx.textAlign = "center";
          ctx.fillText(p.id, x, y - radius - 4);
        }
      });
    };

    const interval = setInterval(draw, 30);
    return () => clearInterval(interval);
  }, [showLabels, pendulumMapRef]);

  return (
    <div className="app-container">
      <div className="wind-control">
        <label>
          Wind: {wind.toFixed(1)}
          <input
            type="range"
            min={-5}
            max={5}
            step={0.1}
            value={wind}
            onChange={(e) => updateWind(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div>
        <canvas
          className="pendulum-canvas"
          ref={canvasRef}
          width={1000}
          height={400}
        />
        <Controls
          running={running}
          showLabels={showLabels}
          pauseOnCollision={pauseOnCollision}
          wind={wind}
          onStart={handleStart}
          onPause={handlePause}
          onStop={handleStop}
          onToggleLabels={() => setShowLabels((prev) => !prev)}
          onToggleCollision={togglePauseOnCollision}
          onSetWind={updateWind}
        />
      </div>
    </div>
  );
}
