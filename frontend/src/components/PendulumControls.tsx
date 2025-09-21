import { useState } from "react";

type Props = {
  backendPort: number; // e.g., 3001
};

export default function PendulumControls({ backendPort }: Props) {
  const [length, setLength] = useState(1.5); // default value within 0.8–3
  const [mass, setMass] = useState(10); // default value within 0.05–50
  const [theta, setTheta] = useState(Math.PI / 4); // default 45°

  const updatePendulum = async (
    field: "length" | "mass" | "theta",
    value: number
  ) => {
    await fetch(
      `http://localhost:${backendPort}/api/v1/pendulum/set-${field}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      }
    );
  };

  const handleChange = (field: "length" | "mass" | "theta", value: number) => {
    if (field === "length") setLength(value);
    if (field === "mass") setMass(value);
    if (field === "theta") setTheta(value);

    updatePendulum(field, value);
  };

  return (
    <div className="pendulum-controls">
      <h4>Pendulum {backendPort}</h4>

      <div>
        <label>
          Length: {length.toFixed(2)} m
          <input
            type="range"
            min={0.8}
            max={3}
            step={0.01}
            value={length}
            onChange={(e) => handleChange("length", parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Mass: {mass.toFixed(2)} kg
          <input
            type="range"
            min={0.05}
            max={50}
            step={0.05}
            value={mass}
            onChange={(e) => handleChange("mass", parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Angle: {theta.toFixed(2)} rad
          <input
            type="range"
            min={Math.PI / 6}
            max={Math.PI / 3}
            step={0.01}
            value={theta}
            onChange={(e) => handleChange("theta", parseFloat(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
