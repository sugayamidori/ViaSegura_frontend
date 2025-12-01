import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Input } from "@viasegura/components/ui/input";

describe("Input Component", () => {
  test("should render correctly", () => {
    render(<Input placeholder="Test Input" />);
    const input = screen.getByPlaceholderText("Test Input");
    expect(input).toBeInTheDocument();
  });

  test("should handle user input", () => {
    render(<Input placeholder="Test Input" />);
    const input = screen.getByPlaceholderText("Test Input") as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input.value).toBe("Hello");
  });

  test("should apply custom classes", () => {
    render(<Input data-testid="input" className="custom-class" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveClass("custom-class");
  });

  test("should be disabled", () => {
    render(<Input data-testid="input" disabled />);
    const input = screen.getByTestId("input");
    expect(input).toBeDisabled();
  });
});
