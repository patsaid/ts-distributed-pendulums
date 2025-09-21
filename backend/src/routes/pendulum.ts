import { Router } from "express";
import { PendulumManager } from "../simulation/pendulum-manager.js";

export function createPendulumRoutes(manager: PendulumManager) {
  const router = Router();

  /**
   * @openapi
   * /api/v1/pendulum/start:
   *   post:
   *     summary: Start the pendulum simulation
   *     responses:
   *       200:
   *         description: Simulation started
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: started
   */
  router.post("/start", (_, res) => {
    manager.running = true;
    res.send({ status: "started" });
  });

  /**
   * @openapi
   * /api/v1/pendulum/pause:
   *   post:
   *     summary: Pause the pendulum simulation
   *     responses:
   *       200:
   *         description: Simulation paused
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: paused
   */
  router.post("/pause", (_, res) => {
    manager.running = false;
    res.send({ status: "paused" });
  });

  /**
   * @openapi
   * /api/v1/pendulum/stop:
   *   post:
   *     summary: Stop the pendulum simulation and reset state
   *     responses:
   *       200:
   *         description: Simulation stopped and reset
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: stopped
   */
  router.post("/stop", (_, res) => {
    manager.running = false;
    manager.pendulum.reset();
    res.send({ status: "stopped" });
  });

  /**
   * @openapi
   * /api/v1/pendulum/set-pause-on-collision:
   *   post:
   *     summary: Configure whether the pendulum pauses on collision
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               pauseOnCollision:
   *                 type: boolean
   *                 example: true
   *     responses:
   *       200:
   *         description: Pause-on-collision flag updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: ok
   *                 pauseOnCollision:
   *                   type: boolean
   *                   example: true
   */
  router.post("/set-pause-on-collision", (req, res) => {
    manager.pauseOnCollision = req.body.pauseOnCollision;
    res.send({ status: "ok", pauseOnCollision: manager.pauseOnCollision });
  });

  /**
   * @openapi
   * /api/v1/pendulum/set-length:
   *   post:
   *     summary: Set the pendulum's length
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               length:
   *                 type: number
   *                 example: 1.5
   *     responses:
   *       200:
   *         description: Pendulum length updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: ok
   *                 length:
   *                   type: number
   *                   example: 1.5
   *       400:
   *         description: Invalid length
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  router.post("/set-length", (req, res) => {
    const { length } = req.body;
    if (typeof length !== "number" || length <= 0) {
      return res.status(400).send({ error: "Invalid length" });
    }
    try {
      manager.pendulum.setLength(length);
      res.send({ status: "ok", length: manager.pendulum.getState().length });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).send({ error: err.message });
      } else {
        res.status(400).send({ error: "Unknown error" });
      }
    }
  });

  /**
   * @openapi
   * /api/v1/pendulum/set-mass:
   *   post:
   *     summary: Set the pendulum's mass
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               mass:
   *                 type: number
   *                 example: 2.0
   *     responses:
   *       200:
   *         description: Pendulum mass updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: ok
   *                 mass:
   *                   type: number
   *                   example: 2.0
   *       400:
   *         description: Invalid mass
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  router.post("/set-mass", (req, res) => {
    const { mass } = req.body;
    if (typeof mass !== "number" || mass <= 0) {
      return res.status(400).send({ error: "Invalid mass" });
    }
    try {
      manager.pendulum.setMass(mass);
      res.send({ status: "ok", mass: manager.pendulum.getState().mass });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).send({ error: err.message });
      } else {
        res.status(400).send({ error: "Unknown error" });
      }
    }
  });

  /**
   * @openapi
   * /api/v1/pendulum/set-theta:
   *   post:
   *     summary: Set the pendulum's angle (theta)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               theta:
   *                 type: number
   *                 example: 0.5
   *     responses:
   *       200:
   *         description: Pendulum angle updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: ok
   *                 theta:
   *                   type: number
   *                   example: 0.5
   *       400:
   *         description: Invalid angle
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  router.post("/set-theta", (req, res) => {
    const { theta } = req.body;
    if (typeof theta !== "number") {
      return res.status(400).send({ error: "Invalid angle" });
    }
    try {
      manager.pendulum.setTheta(theta);
      res.send({ status: "ok", theta: manager.pendulum.getState().theta });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).send({ error: err.message });
      } else {
        res.status(400).send({ error: "Unknown error" });
      }
    }
  });

  /**
   * @openapi
   * /api/v1/pendulum/set-wind:
   *   post:
   *     summary: Set horizontal wind force applied to the pendulum
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               wind:
   *                 type: number
   *                 description: Horizontal wind force in Newtons
   *                 example: 0.2
   *     responses:
   *       200:
   *         description: Wind updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: ok
   *                 wind:
   *                   type: number
   *                   example: 0.2
   */
  router.post("/set-wind", (req, res) => {
    const { wind } = req.body;
    if (typeof wind !== "number") {
      return res.status(400).send({ error: "Invalid wind force" });
    }
    try {
      manager.pendulum.setWind(wind);
      res.send({ status: "ok", wind: manager.pendulum.getState().wind });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).send({ error: err.message });
      } else {
        res.status(400).send({ error: "Unknown error" });
      }
    }
  });

  return router;
}
