import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
// Update the import path if the file is located elsewhere, for example:
import PendulumControls from "../../components/PendulumControls";

describe("PendulumControls integration", () => {
  const backendPort = 3001;
  let fetchMock: any;

  beforeEach(() => {
    fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the component with initial values", () => {
    render(<PendulumControls backendPort={backendPort} />);

    // Check initial slider values
    const lengthInput = screen.getByLabelText(/Length:/) as HTMLInputElement;
    const massInput = screen.getByLabelText(/Mass:/) as HTMLInputElement;
    const angleInput = screen.getByLabelText(/Angle:/) as HTMLInputElement;

    expect(lengthInput.value).toBe("1.5");
    expect(massInput.value).toBe("10");
    expect(angleInput.value).toBe((Math.PI / 4).toString());
  });

  it("sends a fetch request when length slider changes", async () => {
    render(<PendulumControls backendPort={backendPort} />);
    const lengthInput = screen.getByLabelText(/Length:/) as HTMLInputElement;

    fireEvent.change(lengthInput, { target: { value: "2" } });

    expect(lengthInput.value).toBe("2");
    expect(fetchMock).toHaveBeenCalledWith(
      `http://localhost:${backendPort}/api/v1/pendulum/set-length`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ length: 2 }),
      })
    );
  });

  it("sends a fetch request when mass slider changes", async () => {
    render(<PendulumControls backendPort={backendPort} />);
    const massInput = screen.getByLabelText(/Mass:/) as HTMLInputElement;

    fireEvent.change(massInput, { target: { value: "20" } });

    expect(massInput.value).toBe("20");
    expect(fetchMock).toHaveBeenCalledWith(
      `http://localhost:${backendPort}/api/v1/pendulum/set-mass`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mass: 20 }),
      })
    );
  });

  it("sends a fetch request when angle slider changes", async () => {
    render(<PendulumControls backendPort={backendPort} />);
    const angleInput = screen.getByLabelText(/Angle:/) as HTMLInputElement;

    const newAngle = Math.PI / 3;
    fireEvent.change(angleInput, { target: { value: newAngle.toString() } });

    expect(angleInput.value).toBe(newAngle.toString());
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
