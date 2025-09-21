// src/api/pendulum.ts
export type PendulumState = {
  id: string;
  state: { theta: number; omega: number; length: number; mass: number };
  isColliding?: boolean;
};

export const BACKEND_WS_PORTS = [4001, 4002, 4003, 4004, 4005];
export const BACKEND_HTTP_PORTS = [3001, 3002, 3003, 3004, 3005];

// ----- HTTP API calls -----
export const startPendulum = async (port: number) => {
  await fetch(`http://localhost:${port}/api/v1/pendulum/start`, {
    method: "POST",
  });
};

export const pausePendulum = async (port: number) => {
  await fetch(`http://localhost:${port}/api/v1/pendulum/pause`, {
    method: "POST",
  });
};

export const stopPendulum = async (port: number) => {
  await fetch(`http://localhost:${port}/api/v1/pendulum/stop`, {
    method: "POST",
  });
};

export const setPauseOnCollision = async (port: number, value: boolean) => {
  await fetch(
    `http://localhost:${port}/api/v1/pendulum/set-pause-on-collision`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pauseOnCollision: value }),
    }
  );
};

export const updatePendulumField = async (
  port: number,
  field: "length" | "mass" | "theta",
  value: number
) => {
  await fetch(`http://localhost:${port}/api/v1/pendulum/set-${field}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [field]: value }),
  });
};

export const setWind = async (port: number, wind: number) => {
  await fetch(`http://localhost:${port}/api/v1/pendulum/set-wind`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wind }),
  });
};

// ----- WebSocket connections -----
export const connectPendulumSockets = (
  onMessage: (data: PendulumState) => void
) => {
  const sockets: WebSocket[] = [];
  BACKEND_WS_PORTS.forEach((port) => {
    const ws = new WebSocket(`ws://localhost:${port}`);
    ws.onmessage = (msg) => onMessage(JSON.parse(msg.data));
    sockets.push(ws);
  });
  return () => sockets.forEach((ws) => ws.close());
};
