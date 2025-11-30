import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Separator } from "@viasegura/components/ui/separator";

jest.mock("@viasegura/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

describe("Separator Component", () => {
  test("should render with default props (horizontal and decorative)", () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId("separator");

    expect(separator).toBeInTheDocument();

    expect(separator).toHaveAttribute("data-slot", "separator");

    expect(separator).toHaveAttribute("data-orientation", "horizontal");

    expect(separator).toHaveAttribute("role", "none");

    expect(separator).toHaveClass("data-[orientation=horizontal]:w-full");
  });

  test("should render with vertical orientation", () => {
    render(<Separator orientation="vertical" data-testid="separator" />);
    const separator = screen.getByTestId("separator");

    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-orientation", "vertical");
    expect(separator).toHaveClass("data-[orientation=vertical]:w-px");
  });

  test("should apply custom className alongside default classes", () => {
    const customClass = "my-custom-class";
    render(<Separator className={customClass} data-testid="separator" />);
    const separator = screen.getByTestId("separator");

    expect(separator).toHaveClass(customClass);

    expect(separator).toHaveClass("bg-border");
  });

  test("should render as non-decorative with correct accessibility attributes", () => {
    const { rerender } = render(
      <Separator decorative={false} orientation="horizontal" />
    );

    let separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();

    expect(separator.getAttribute("aria-orientation")).toBeNull();

    rerender(<Separator decorative={false} orientation="vertical" />);
    separator = screen.getByRole("separator");

    expect(separator).toHaveAttribute("aria-orientation", "vertical");
  });

  test("should pass down additional props to the root element", () => {
    const customDataAttr = "custom-value";
    render(<Separator data-foo={customDataAttr} data-testid="separator" />);
    const separator = screen.getByTestId("separator");

    expect(separator).toHaveAttribute("data-foo", customDataAttr);
  });
});
