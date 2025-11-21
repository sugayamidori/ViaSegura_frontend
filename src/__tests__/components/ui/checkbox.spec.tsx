import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Checkbox } from "@viasegura/components/ui/checkbox";

jest.mock("@viasegura/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

jest.mock("lucide-react", () => ({
  CheckIcon: (props: any) => (
    <svg data-testid="check-icon" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
}));

describe("Checkbox Component", () => {
  test("should render correctly in an unchecked state", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("data-slot", "checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(checkbox).toHaveAttribute("data-state", "unchecked");
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
  });

  test("should toggle checked state on click", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    const indicator = screen
      .getByTestId("check-icon")
      .closest('[data-slot="checkbox-indicator"]');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass("transition-none");

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
  });

  test("should be disabled and not toggle on click", () => {
    render(<Checkbox disabled />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    fireEvent.click(checkbox);

    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(checkbox).toHaveClass("disabled:opacity-50");
  });

  test("should merge custom className with default classes", () => {
    const customClass = "my-custom-checkbox";
    render(<Checkbox className={customClass} />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveClass(customClass);
    expect(checkbox).toHaveClass("peer");
    expect(checkbox).toHaveClass("border-input");
  });

  test("should apply aria-invalid attribute", () => {
    render(<Checkbox aria-invalid={true} />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveClass("aria-invalid:border-destructive");
  });
});
