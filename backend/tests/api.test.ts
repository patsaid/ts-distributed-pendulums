import request from "supertest";
import express from "express";
import { describe, it, expect, beforeEach } from "vitest";
import { PendulumManager } from "../src/simulation/pendulum-manager.js";
import { vi } from "vitest";

// Mock ioredis globally
vi.mock("ioredis", () => {
  const RedisMock = require("ioredis-mock");
  return {
    Redis: RedisMock,
  };
});

let app: express.Express;
let manager: PendulumManager;

beforeEach(() => {
  app = express();
  app.use(express.json());
  manager = new PendulumManager("pendulum-3001");

  app.post("/start", (_, res) => {
    manager.running = true;
    res.send({ status: "started" });
  });

  app.post("/pause", (_, res) => {
    manager.running = false;
    res.send({ status: "paused" });
  });

  app.post("/stop", (_, res) => {
    manager.running = false;
    manager.pendulum.reset();
    res.send({ status: "stopped" });
  });

  app.post("/set-pause-on-collision", (req, res) => {
    manager.pauseOnCollision = req.body.pauseOnCollision;
    res.send({ status: "ok", pauseOnCollision: manager.pauseOnCollision });
  });

  // --- Pendulum controls endpoints ---
  app.post("/set-length", (req, res) => {
    manager.pendulum.setLength(req.body.length);
    res.send({ length: manager.pendulum.getState().length });
  });

  app.post("/set-mass", (req, res) => {
    manager.pendulum.setMass(req.body.mass);
    res.send({ mass: manager.pendulum.getState().mass });
  });

  app.post("/set-theta", (req, res) => {
    manager.pendulum.setTheta(req.body.theta);
    res.send({ theta: manager.pendulum.getState().theta });
  });
});

describe("Pendulum API", () => {
  it("should start pendulum", async () => {
    const res = await request(app).post("/start");
    expect(res.body.status).toBe("started");
    expect(manager.running).toBe(true);
  });

  it("should pause pendulum", async () => {
    const res = await request(app).post("/pause");
    expect(res.body.status).toBe("paused");
    expect(manager.running).toBe(false);
  });

  it("should stop pendulum and reset state", async () => {
    const oldState = manager.pendulum.getState();
    await request(app).post("/stop");
    const newState = manager.pendulum.getState();
    expect(manager.running).toBe(false);
    expect(newState).not.toEqual(oldState);
  });

  it("should toggle pauseOnCollision", async () => {
    const res = await request(app)
      .post("/set-pause-on-collision")
      .send({ pauseOnCollision: true });
    expect(res.body.pauseOnCollision).toBe(true);
    expect(manager.pauseOnCollision).toBe(true);
  });

  // --- Pendulum controls tests ---
  it("should update length", async () => {
    const res = await request(app).post("/set-length").send({ length: 2.5 });
    expect(res.body.length).toBe(2.5);

    const pendulumState = manager.pendulum.getState();
    expect(pendulumState.length).toBe(2.5);
  });

  it("should update mass", async () => {
    const res = await request(app).post("/set-mass").send({ mass: 15 });
    expect(res.body.mass).toBe(15);

    const pendulumState = manager.pendulum.getState();
    expect(pendulumState.mass).toBe(15);
  });

  it("should update theta", async () => {
    const res = await request(app)
      .post("/set-theta")
      .send({ theta: Math.PI / 3 });
    expect(res.body.theta).toBe(Math.PI / 3);

    const pendulumState = manager.pendulum.getState();
    expect(pendulumState.theta).toBe(Math.PI / 3);
  });
});
