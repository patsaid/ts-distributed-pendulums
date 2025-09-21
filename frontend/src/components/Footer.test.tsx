// src/components/Footer.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import "@testing-library/jest-dom";

describe("Footer component", () => {
  it("renders the correct text with current year", () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);
    const footerElement = screen.getByText(
      `Pendulum Simulation © ${currentYear}`
    );
    expect(footerElement).toBeInTheDocument();
  });

  it("is visible in the DOM", () => {
    render(<Footer />);
    const footerElement = screen.getByText(/Pendulum Simulation/i);
    expect(footerElement).toBeVisible();
  });
});
