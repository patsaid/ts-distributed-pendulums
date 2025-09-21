// src/hooks/usePendulums.ts
import { useEffect, useRef, useState } from "react";
import * as api from "../api/pendulum";

export function usePendulums() {
  const pendulumMapRef = useRef<Map<string, api.PendulumState>>(new Map());
  const [running, setRunning] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [pauseOnCollision, setPauseOnCollision] = useState(false);
  const [wind, setWind] = useState(0); // <-- new state for wind

  useEffect(() => {
    if (!running) return;

    const cleanup = api.connectPendulumSockets((data) => {
      pendulumMapRef.current.set(data.id, data);
    });

    return cleanup;
  }, [running]);

  const handleStart = () => {
    api.BACKEND_HTTP_PORTS.forEach(api.startPendulum);
    setRunning(true);
  };

  const handlePause = () => {
    api.BACKEND_HTTP_PORTS.forEach(api.pausePendulum);
    setRunning(false);
  };

  const handleStop = () => {
    api.BACKEND_HTTP_PORTS.forEach(api.stopPendulum);
    pendulumMapRef.current.clear();
    setRunning(false);
  };

  const togglePauseOnCollision = () => {
    setPauseOnCollision((prev) => {
      api.BACKEND_HTTP_PORTS.forEach((port) =>
        api.setPauseOnCollision(port, !prev)
      );
      return !prev;
    });
  };

  const updateWind = (value: number) => {
    setWind(value); // update local state
    api.BACKEND_HTTP_PORTS.forEach((port) => api.setWind(port, value));
  };

  return {
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
  };
}
