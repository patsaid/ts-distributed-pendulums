import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, beforeAll, beforeEach } from "vitest";
import Home from "../../pages/Home";

// -----------------------------
// Mock the canvas context
// -----------------------------
// Mock the canvas context
beforeAll(() => {
  const mockCtx = {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    strokeStyle: "",
    fillStyle: "",
    lineWidth: 0,
    font: "",
    textAlign: "",
    fillText: vi.fn(),
  } as unknown as CanvasRenderingContext2D; // <-- cast here

  HTMLCanvasElement.prototype.getContext = vi.fn(
    (
      contextId: "2d" | "bitmaprenderer" | "webgl" | "webgl2",
      options?: any
    ):
      | CanvasRenderingContext2D
      | ImageBitmapRenderingContext
      | WebGLRenderingContext
      | WebGL2RenderingContext
      | null => {
      if (contextId === "2d") return mockCtx;
      // Return a minimal mock for bitmaprenderer
      if (contextId === "bitmaprenderer") {
        return {
          transferFromImageBitmap: vi.fn(),
        } as unknown as ImageBitmapRenderingContext;
      }
      // Return null for other context types
      return null;
    }
  );
});

// -----------------------------
// Mock the usePendulums hook
// -----------------------------
const handleStartMock = vi.fn();
const handlePauseMock = vi.fn();
const handleStopMock = vi.fn();
const togglePauseMock = vi.fn();
const setShowLabelsMock = vi.fn();

vi.mock("../../hooks/usePendulums", () => ({
  usePendulums: () => ({
    pendulumMapRef: {
      current: new Map([
        [
          "pendulum-3001",
          {
            id: "pendulum-3001",
            state: { length: 1.5, mass: 10, theta: Math.PI / 4 },
            isColliding: false,
          },
        ],
      ]),
    },
    running: false,
    showLabels: false,
    pauseOnCollision: false,
    wind: 0,
    setShowLabels: setShowLabelsMock,
    handleStart: handleStartMock,
    handlePause: handlePauseMock,
    handleStop: handleStopMock,
    togglePauseOnCollision: togglePauseMock,
    updateWind: vi.fn(),
    onSetWind: vi.fn(),
  }),
}));

// -----------------------------
// Integration tests
// -----------------------------
describe("Home integration test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders canvas and controls together", () => {
    render(<Home />);
    const canvas = document.querySelector("canvas.pendulum-canvas");
    expect(canvas).toBeTruthy();
    expect((canvas as HTMLCanvasElement | null)?.width).toBe(1000);
    expect((canvas as HTMLCanvasElement | null)?.height).toBe(400);

    // Controls buttons
    expect(screen.getByText("Start")).toBeTruthy();
    expect(screen.getByText("Pause")).toBeTruthy();
    expect(screen.getByText("Stop")).toBeTruthy();
    expect(screen.getByText("Show Labels")).toBeTruthy();
    expect(screen.getByText("Ignore collisions")).toBeTruthy();
  });

  it("calls handleStart when Start is clicked", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Start"));
    expect(handleStartMock).toHaveBeenCalled();
  });

  it("calls handlePause when Pause is clicked", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Pause"));
    expect(handlePauseMock).toHaveBeenCalled();
  });

  it("calls handleStop when Stop is clicked", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Stop"));
    expect(handleStopMock).toHaveBeenCalled();
  });

  it("calls togglePauseOnCollision when Ignore collisions is clicked", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Ignore collisions"));
    expect(togglePauseMock).toHaveBeenCalled();
  });

  it("toggles labels when Show Labels is clicked", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Show Labels"));
    expect(setShowLabelsMock).toHaveBeenCalled();
  });
});
