import { describe, it, expect, beforeEach } from "vitest";
import { Pendulum } from "../src/simulation/physics/pendulum.js";

describe("Pendulum", () => {
  let pendulum: Pendulum;

  beforeEach(() => {
    pendulum = new Pendulum();
  });

  it("should initialize with random values", () => {
    const state = pendulum.getState();
    expect(state.theta).toBeGreaterThan(0);
    expect(state.length).toBeGreaterThan(0);
    expect(state.mass).toBeGreaterThan(0);
  });

  it("should update state after step", () => {
    const oldState = { ...pendulum.getState() };
    pendulum.step(0.1);
    const newState = pendulum.getState();

    // Compare with a small epsilon to account for tiny differences
    const epsilon = 1e-10;
    expect(Math.abs(newState.theta - oldState.theta)).toBeGreaterThan(epsilon);
    expect(Math.abs(newState.omega - oldState.omega)).toBeGreaterThan(epsilon);
  });

  it("should reset state to new random values", () => {
    const oldState = { ...pendulum.getState() };
    pendulum.reset();
    const newState = pendulum.getState();

    const epsilon = 1e-10;
    // Ensure at least one value changes significantly
    const thetaChanged = Math.abs(newState.theta - oldState.theta) > epsilon;
    const omegaChanged = Math.abs(newState.omega - oldState.omega) > epsilon;
    expect(thetaChanged || omegaChanged).toBe(true);
  });
});
