import * as Redis from "ioredis";
import { Pendulum } from "./physics/pendulum.js";
import { WebSocket } from "ws";

interface XY {
  x: number;
  y: number;
  radius: number;
}

export const INDEXES: Record<string, number> = {
  "pendulum-3001": 0,
  "pendulum-3002": 1,
  "pendulum-3003": 2,
  "pendulum-3004": 3,
  "pendulum-3005": 4,
};
const CANVAS_WIDTH = 1000;
const CANVAS_ORIGIN_Y = 50;
const totalPendulums = Object.keys(INDEXES).length;

export const ORIGINS_X: Record<string, number> = {};
Object.entries(INDEXES).forEach(([id, idx]) => {
  ORIGINS_X[id] = CANVAS_WIDTH / 2 - (totalPendulums - 1) * 75 + idx * 150;
});

/** Compute canvas coordinates for pendulum bob */
export function computeXY(
  id: string,
  state: ReturnType<Pendulum["getState"]>
): XY {
  const originX = ORIGINS_X[id];
  const originY = CANVAS_ORIGIN_Y;
  if (originX === undefined) {
    throw new Error(`Origin X for pendulum id '${id}' is undefined`);
  }
  const x = originX + state.length * 100 * Math.sin(state.theta);
  const y = originY + state.length * 100 * Math.cos(state.theta);
  const radius = 8 + Math.sqrt(state.mass) * 3;
  return { x, y, radius };
}

export class PendulumManager {
  pendulum = new Pendulum();
  othersPositions: Record<string, XY> = {};
  running = true;
  pausedByCollision = false;
  pauseOnCollision = false;

  currentCollisionId = 0;
  restartSet = new Set<string>();

  redisPub: Redis.Redis;
  redisSub: Redis.Redis;
  id: string;

  constructor(id: string) {
    this.id = id;
    this.redisPub = new Redis.Redis({ host: "redis", port: 6379 });
    this.redisSub = new Redis.Redis({ host: "redis", port: 6379 });
    this.redisSub.subscribe("pendulum-state", "pendulum-control");
    this.redisSub.on("message", (_: string, message: string) =>
      this.handleRedisMessage(message)
    );
  }

  private handleRedisMessage(message: string) {
    const { id, state, type, from, collisionId } = JSON.parse(message);

    // Update positions of other pendulums
    if (!type && id && id !== this.id && state) {
      this.othersPositions[id] = computeXY(id, state);
      return;
    }

    // STOP message received
    if (type === "STOP" && from !== this.id && !this.pausedByCollision) {
      this.pausedByCollision = true;
      this.running = false;
      console.log(`${this.id} received STOP from ${from}`);
      this.startRestartCycle();
    }

    // RESTART message
    if (type === "RESTART" && collisionId === this.currentCollisionId) {
      this.restartSet.add(from);
      if (this.restartSet.size === totalPendulums) {
        console.log(`${this.id} received all RESTARTs, resetting in 5s...`);
        setTimeout(() => {
          this.pendulum.reset();
          this.running = true;
          this.pausedByCollision = false;
          this.restartSet.clear();
        }, 5000);
      }
    }
  }

  /** Start restart cycle and broadcast own RESTART */
  private startRestartCycle() {
    this.currentCollisionId++;
    this.restartSet = new Set();
    this.redisPub.publish(
      "pendulum-control",
      JSON.stringify({
        type: "RESTART",
        from: this.id,
        collisionId: this.currentCollisionId,
      })
    );
  }

  /** Step simulation and handle collisions, broadcast state */
  stepAndPublish(wssClients: Set<WebSocket>) {
    const dt = 0.03; // 30ms step
    if (this.running) {
      this.pendulum.step(dt);
      const state = this.pendulum.getState();
      const ownPos = computeXY(this.id, state);
      this.othersPositions[this.id] = ownPos;

      // Collision detection
      let isColliding = false;
      for (const [otherId, otherPos] of Object.entries(this.othersPositions)) {
        if (otherId === this.id) continue;
        const dx = ownPos.x - otherPos.x;
        const dy = ownPos.y - otherPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < ownPos.radius + otherPos.radius) {
          isColliding = true;

          if (this.pauseOnCollision && !this.pausedByCollision) {
            this.pausedByCollision = true;
            this.running = false;
            console.log(`Collision detected between ${this.id} and ${otherId}`);

            // Notify others to STOP
            this.redisPub.publish(
              "pendulum-control",
              JSON.stringify({ type: "STOP", from: this.id })
            );

            // Start restart cycle
            this.startRestartCycle();
          }
        }
      }

      // Broadcast state to Redis and WebSocket clients
      const msg = JSON.stringify({ id: this.id, state, isColliding });
      this.redisPub.publish("pendulum-state", msg);
      wssClients.forEach((client: any) => {
        if (client.readyState === 1) client.send(msg);
      });
    }

    setTimeout(() => this.stepAndPublish(wssClients), 30);
  }
}
