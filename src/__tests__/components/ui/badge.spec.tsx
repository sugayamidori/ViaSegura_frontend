import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Badge } from "@viasegura/components/ui/badge";

jest.mock("@viasegura/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

describe("Badge Component", () => {
  test("should render with default variant (default) and as span", () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText("Default Badge");

    expect(badge).toBeInTheDocument();
    expect(badge.tagName).toBe("SPAN");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveClass("bg-primary");
    expect(badge).toHaveClass("text-primary-foreground");
  });

  test.each([
    ["default", "bg-primary"],
    ["secondary", "bg-secondary"],
    ["destructive", "bg-destructive"],
    ["outline", "text-foreground"],
  ])(
    "should apply correct classes for variant: %s",
    (variant, expectedClass) => {
      render(<Badge variant={variant as any}>Badge Text</Badge>);
      const badge = screen.getByText("Badge Text");

      expect(badge).toHaveClass(expectedClass);
    }
  );

  test("should merge custom className with variant classes", () => {
    const customClass = "my-extra-class";
    render(<Badge className={customClass}>Custom Class</Badge>);
    const badge = screen.getByText("Custom Class");

    expect(badge).toHaveClass(customClass);
    expect(badge).toHaveClass("bg-primary");
  });

  test("should render as a child element when asChild is true", () => {
    render(
      <Badge asChild variant="outline">
        <a href="/test">Clickable Badge</a>
      </Badge>
    );

    const badgeLink = screen.getByRole("link", { name: "Clickable Badge" });

    expect(badgeLink.tagName).toBe("A");
    expect(badgeLink).toHaveAttribute("href", "/test");
    expect(badgeLink).toHaveClass("text-foreground");
    expect(badgeLink).toHaveAttribute("data-slot", "badge");
  });

  test("should pass down other props (like id, aria-label) to the element", () => {
    render(
      <Badge id="my-badge" aria-label="Notification count">
        5
      </Badge>
    );
    const badge = screen.getByText("5");

    expect(badge).toHaveAttribute("id", "my-badge");
    expect(badge).toHaveAttribute("aria-label", "Notification count");
  });
});
