type ControlsProps = {
  running: boolean;
  showLabels: boolean;
  pauseOnCollision: boolean;
  wind: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onToggleLabels: () => void;
  onToggleCollision: () => void;
  onSetWind: (wind: number) => void;
};

export default function Controls({
  showLabels,
  pauseOnCollision,
  onStart,
  onPause,
  onStop,
  onToggleLabels,
  onToggleCollision,
}: ControlsProps) {
  return (
    <div className="controls">
      <button onClick={onStart}>Start</button>
      <button onClick={onPause}>Pause</button>
      <button onClick={onStop}>Stop</button>
      <button onClick={onToggleLabels}>
        {showLabels ? "Hide Labels" : "Show Labels"}
      </button>
      <button onClick={onToggleCollision}>
        {pauseOnCollision ? "Stop on collisions" : "Ignore collisions"}
      </button>
    </div>
  );
}
