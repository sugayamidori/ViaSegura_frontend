import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Progress } from "@viasegura/components/ui/progress";

jest.mock("@viasegura/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

describe("Progress Component", () => {
  test("should render with default value (0)", () => {
    const { rerender } = render(<Progress />);

    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toBeInTheDocument();

    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar).toHaveAttribute("aria-valuenow", "0");

    expect(progressbar).toHaveAttribute("data-slot", "progress");
    expect(progressbar).toHaveClass("bg-primary/20");

    const indicator = progressbar.querySelector(
      '[data-slot="progress-indicator"]'
    );
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveStyle({ transform: "translateX(-100%)" });
    expect(indicator).toHaveClass("bg-primary");

    rerender(<Progress value={0} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    );
    expect(
      screen
        .getByRole("progressbar")
        .querySelector('[data-slot="progress-indicator"]')
    ).toHaveStyle({ transform: "translateX(-100%)" });
  });

  test("should render with a specific value (e.g., 50)", () => {
    render(<Progress value={50} />);
    const progressbar = screen.getByRole("progressbar");

    expect(progressbar).toHaveAttribute("aria-valuenow", "50");

    const indicator = progressbar.querySelector(
      '[data-slot="progress-indicator"]'
    );

    expect(indicator).toHaveStyle({ transform: "translateX(-50%)" });
  });

  test("should render correctly at 100%", () => {
    render(<Progress value={100} />);
    const progressbar = screen.getByRole("progressbar");

    expect(progressbar).toHaveAttribute("aria-valuenow", "100");

    const indicator = progressbar.querySelector(
      '[data-slot="progress-indicator"]'
    );

    expect(indicator).toHaveStyle({ transform: "translateX(-0%)" });
  });

  test("should merge custom className", () => {
    const customClass = "my-custom-progress";
    render(<Progress value={10} className={customClass} />);
    const progressbar = screen.getByRole("progressbar");

    expect(progressbar).toHaveClass(customClass);

    expect(progressbar).toHaveClass("bg-primary/20");
  });

  test("should pass down other props to the root element", () => {
    render(<Progress value={10} id="my-progress-bar" />);
    const progressbar = screen.getByRole("progressbar");

    expect(progressbar).toHaveAttribute("id", "my-progress-bar");
  });
});
