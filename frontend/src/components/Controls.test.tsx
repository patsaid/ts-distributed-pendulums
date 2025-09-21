// src/components/Controls.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Controls from "./Controls";
import "@testing-library/jest-dom"; // extends expect with DOM matchers

describe("Controls component", () => {
  it("renders all buttons", () => {
    const onStart = vi.fn();
    const onPause = vi.fn();
    const onStop = vi.fn();
    const onToggleLabels = vi.fn();
    const onToggleCollision = vi.fn();

    render(
      <Controls
        running={false}
        showLabels={false}
        pauseOnCollision={false}
        wind={0}
        onSetWind={() => {}}
        onStart={onStart}
        onPause={onPause}
        onStop={onStop}
        onToggleLabels={onToggleLabels}
        onToggleCollision={onToggleCollision}
      />
    );

    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Pause")).toBeInTheDocument();
    expect(screen.getByText("Stop")).toBeInTheDocument();
    expect(screen.getByText("Show Labels")).toBeInTheDocument();
    expect(screen.getByText("Ignore collisions")).toBeInTheDocument();
  });

  it("calls callbacks when buttons are clicked", () => {
    const onStart = vi.fn();
    const onPause = vi.fn();
    const onStop = vi.fn();
    const onToggleLabels = vi.fn();
    const onToggleCollision = vi.fn();

    render(
      <Controls
        running={false}
        showLabels={false}
        pauseOnCollision={false}
        wind={0}
        onSetWind={() => {}}
        onStart={onStart}
        onPause={onPause}
        onStop={onStop}
        onToggleLabels={onToggleLabels}
        onToggleCollision={onToggleCollision}
      />
    );

    fireEvent.click(screen.getByText("Start"));
    fireEvent.click(screen.getByText("Pause"));
    fireEvent.click(screen.getByText("Stop"));
    fireEvent.click(screen.getByText("Show Labels"));
    fireEvent.click(screen.getByText("Ignore collisions"));

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onPause).toHaveBeenCalledTimes(1);
    expect(onStop).toHaveBeenCalledTimes(1);
    expect(onToggleLabels).toHaveBeenCalledTimes(1);
    expect(onToggleCollision).toHaveBeenCalledTimes(1);
  });
});
