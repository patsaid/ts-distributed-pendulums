export interface PendulumState {
  theta: number; // angle (rad)
  omega: number; // angular velocity (rad/s)
  length: number; // string length (m)
  mass: number; // bob mass (kg)
  wind: number; // horizontal wind force (N)
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Represents a single pendulum.
 * Can step forward in time, reset, and provide current state.
 */
export class Pendulum {
  private g = 9.81; // gravity
  private state: PendulumState;

  constructor() {
    this.state = this.init();
  }

  /** Initialize pendulum with random parameters */
  init(): PendulumState {
    return {
      theta: randomBetween(Math.PI / 6, Math.PI / 3), // 30°–60°
      omega: 0,
      length: randomBetween(0.8, 3),
      mass: randomBetween(0.05, 50),
      wind: 0, // default: no wind
    };
  }

  /** Step simulation by dt seconds */
  step(dt: number) {
    const { theta, omega, length, mass, wind } = this.state;

    // Base gravitational acceleration
    const alphaGravity = -(this.g / length) * Math.sin(theta);

    // Wind contributes torque proportional to horizontal force projected on pendulum
    const alphaWind = (wind / (mass * length)) * Math.cos(theta);

    // Total angular acceleration
    const alpha = alphaGravity + alphaWind;

    // Adjust effect of mass on motion (same as your original mass factor idea)
    const massFactor = Math.pow(1 / mass, 0.2);

    this.state.omega = omega + alpha * dt * massFactor;
    this.state.theta = theta + this.state.omega * dt * massFactor;
  }

  /** Reset pendulum with new random state */
  reset() {
    this.state = this.init();
  }

  /** Return current state */
  getState() {
    return this.state;
  }

  /** Setters for API endpoints */
  setLength(length: number) {
    if (length <= 0) throw new Error("Invalid length");
    this.state.length = length;
  }

  setMass(mass: number) {
    if (mass <= 0) throw new Error("Invalid mass");
    this.state.mass = mass;
  }

  setTheta(theta: number) {
    this.state.theta = theta;
  }

  setWind(wind: number) {
    this.state.wind = wind;
  }
}
