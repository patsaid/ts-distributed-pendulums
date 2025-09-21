import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // add this for matchers like toBeInTheDocument
import Home from "../pages/Home";

const handleStartMock = vi.fn();
const handlePauseMock = vi.fn();
const handleStopMock = vi.fn();
const setShowLabelsMock = vi.fn();
const togglePauseOnCollisionMock = vi.fn();

vi.mock("../hooks/usePendulums", () => ({
  usePendulums: vi.fn(() => ({
    pendulumMapRef: { current: new Map() },
    running: false,
    showLabels: false,
    pauseOnCollision: false,
    wind: 0,
    setShowLabels: setShowLabelsMock,
    handleStart: handleStartMock,
    handlePause: handlePauseMock,
    handleStop: handleStopMock,
    togglePauseOnCollision: togglePauseOnCollisionMock,
    updateWind: vi.fn(),
  })),
}));

describe("Home component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the canvas", () => {
    render(<Home />);
    const canvas = document.querySelector(
      ".pendulum-canvas"
    ) as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();
    expect(canvas.width).toBe(1000);
    expect(canvas.height).toBe(400);
  });

  it("renders the Controls component", () => {
    render(<Home />);
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Pause")).toBeInTheDocument();
    expect(screen.getByText("Stop")).toBeInTheDocument();
    expect(screen.getByText("Show Labels")).toBeInTheDocument();
    expect(screen.getByText("Ignore collisions")).toBeInTheDocument();
  });

  it("toggles labels when clicking Show Labels button", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Show Labels"));
    expect(setShowLabelsMock).toHaveBeenCalled();
  });

  it("calls handleStart on Start button click", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Start"));
    expect(handleStartMock).toHaveBeenCalled();
  });

  it("calls handlePause on Pause button click", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Pause"));
    expect(handlePauseMock).toHaveBeenCalled();
  });

  it("calls handleStop on Stop button click", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Stop"));
    expect(handleStopMock).toHaveBeenCalled();
  });

  it("calls togglePauseOnCollision on Ignore collisions button click", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Ignore collisions"));
    expect(togglePauseOnCollisionMock).toHaveBeenCalled();
  });
});
