import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Logo } from "@/components/layout/Logo/index";

describe("Logo Component", () => {
  it("should render the logo text", () => {
    render(<Logo />);
    const logoElement = screen.getByText(/BNB/i);
    expect(logoElement).toBeInTheDocument();
  });
});
