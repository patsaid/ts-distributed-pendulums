import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import type { Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PendulumControls from "../components/PendulumControls";
import "@testing-library/jest-dom";

describe("PendulumControls component", () => {
  const backendPort = 3001;
  let fetchMock: Mock;

  beforeEach(() => {
    fetchMock = vi.fn(() => Promise.resolve({ ok: true }));
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the header with backend port", () => {
    render(<PendulumControls backendPort={backendPort} />);
    expect(screen.getByText(`Pendulum ${backendPort}`)).toBeInTheDocument();
  });

  it("renders three sliders with initial values", () => {
    render(<PendulumControls backendPort={backendPort} />);

    const lengthInput = screen.getByLabelText(/Length:/) as HTMLInputElement;
    const massInput = screen.getByLabelText(/Mass:/) as HTMLInputElement;
    const angleInput = screen.getByLabelText(/Angle:/) as HTMLInputElement;

    expect(Number(lengthInput.value)).toBeCloseTo(1.5);
    expect(Number(massInput.value)).toBeCloseTo(10);
    expect(Number(angleInput.value)).toBeCloseTo(Math.PI / 4);
  });

  it("calls fetch with correct endpoint when Length slider changes", async () => {
    render(<PendulumControls backendPort={backendPort} />);
    const lengthInput = screen.getByLabelText(/Length:/) as HTMLInputElement;

    fireEvent.change(lengthInput, { target: { value: "2.0" } });

    expect(lengthInput.value).toBe("2");
    await new Promise((r) => setTimeout(r, 0)); // wait for async
    expect(fetchMock).toHaveBeenCalledWith(
      `http://localhost:${backendPort}/api/v1/pendulum/set-length`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ length: 2 }),
      })
    );
  });

  it("calls fetch with correct endpoint when Mass slider changes", async () => {
    render(<PendulumControls backendPort={backendPort} />);
    const massInput = screen.getByLabelText(/Mass:/) as HTMLInputElement;

    fireEvent.change(massInput, { target: { value: "20" } });

    expect(massInput.value).toBe("20");
    await new Promise((r) => setTimeout(r, 0));
    expect(fetchMock).toHaveBeenCalledWith(
      `http://localhost:${backendPort}/api/v1/pendulum/set-mass`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mass: 20 }),
      })
    );
  });

  it("calls fetch with correct endpoint when Angle slider changes", async () => {
    render(<PendulumControls backendPort={backendPort} />);
    const angleInput = screen.getByLabelText(/Angle:/) as HTMLInputElement;

    const newAngle = Math.PI / 3;
    fireEvent.change(angleInput, { target: { value: newAngle.toString() } });

    expect(parseFloat(angleInput.value)).toBeCloseTo(newAngle, 2);
    await new Promise((r) => setTimeout(r, 0));
    expect(fetchMock).toHaveBeenCalledWith(
      `http://localhost:${backendPort}/api/v1/pendulum/set-theta`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theta: newAngle }),
      })
    );
  });
});
