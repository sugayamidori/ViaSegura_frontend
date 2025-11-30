import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Progress } from "@viasegura/components/ui/progress";

describe("Progress Component", () => {
  test("should render correctly", () => {
    render(<Progress value={50} data-testid="progress" />);
    const progress = screen.getByTestId("progress");
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute("aria-valuenow", "50");
  });

  test("should handle 0 value", () => {
    render(<Progress value={0} data-testid="progress" />);
    const progress = screen.getByTestId("progress");
    expect(progress).toHaveAttribute("aria-valuenow", "0");
  });

  test("should handle 100 value", () => {
    render(<Progress value={100} data-testid="progress" />);
    const progress = screen.getByTestId("progress");
    expect(progress).toHaveAttribute("aria-valuenow", "100");
  });
});
