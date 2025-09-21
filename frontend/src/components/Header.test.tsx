// src/components/Header.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";
import "@testing-library/jest-dom";

describe("Header component", () => {
  it("renders the header text", () => {
    render(<Header />);
    const heading = screen.getByRole("heading", {
      name: /Distributed Pendulums/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders the pendulum icon", () => {
    render(<Header />);
    // react-icons render an svg element
    const svg = screen.getByTestId("pendulum-icon");
    expect(svg).toBeInTheDocument();
  });
});
