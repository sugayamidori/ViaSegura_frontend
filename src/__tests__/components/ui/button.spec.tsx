import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { type VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@viasegura/components/ui/button";

type ButtonVariants = VariantProps<typeof buttonVariants>["variant"];
type ButtonSizes = VariantProps<typeof buttonVariants>["size"];

jest.mock("@viasegura/lib/utils", () => ({
  cn: (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(" "),
}));

describe("Button", () => {
  test("renders the button with children", () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole("button", { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent("Click Me");
  });

  test("applies default variant and size when none are provided", () => {
    render(<Button>Default Button</Button>);
    const buttonElement = screen.getByRole("button", {
      name: /default button/i,
    });

    const defaultClasses = buttonVariants({
      variant: "default",
      size: "default",
    }).split(" ");

    defaultClasses.forEach((cls) => {
      expect(buttonElement.getAttribute("class")).toContain(cls);
    });

    expect(buttonElement).toHaveClass("inline-flex");
    expect(buttonElement).toHaveClass("items-center");
  });

  test("applies the correct variant classes", () => {
    const variants: ButtonVariants[] = [
      "destructive",
      "outline",
      "secondary",
      "ghost",
      "link",
    ];

    variants.forEach((variant) => {
      render(<Button variant={variant}>{`${variant} Button`}</Button>);
      const buttonElement = screen.getByRole("button", {
        name: `${variant} Button`,
      });

      const expectedClasses = buttonVariants({
        variant: variant,
        size: "default",
      }).split(" ");

      expectedClasses.forEach((cls) => {
        expect(buttonElement.getAttribute("class")).toContain(cls);
      });
    });
  });

  test("applies the correct size classes", () => {
    const sizes: ButtonSizes[] = ["sm", "lg", "icon"];

    sizes.forEach((size) => {
      render(<Button size={size}>{`${size} Button`}</Button>);
      const buttonElement = screen.getByRole("button", {
        name: `${size} Button`,
      });

      const expectedClasses = buttonVariants({
        variant: "default",
        size: size,
      }).split(" ");

      expectedClasses.forEach((cls) => {
        expect(buttonElement.getAttribute("class")).toContain(cls);
      });
    });
  });

  test("renders the child element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const linkElement = screen.getByRole("link", { name: /link button/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/test");

    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    const expectedClasses = buttonVariants({
      variant: "default",
      size: "default",
    }).split(" ");
    expectedClasses.forEach((cls) => {
      expect(linkElement.getAttribute("class")).toContain(cls);
    });
  });

  test("passes down standard button attributes", () => {
    const handleClick = jest.fn();
    render(
      <Button
        onClick={handleClick}
        disabled
        type="submit"
        data-testid="my-button"
      >
        Submit
      </Button>
    );
    const buttonElement = screen.getByRole("button", { name: /submit/i });

    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveAttribute("type", "submit");
    expect(buttonElement).toHaveAttribute("data-testid", "my-button");
  });

  test("merges provided className with generated classes", () => {
    render(<Button className="extra-class">Button with Extra Class</Button>);
    const buttonElement = screen.getByRole("button", {
      name: /button with extra class/i,
    });

    expect(buttonElement).toHaveClass("extra-class");

    expect(buttonElement).toHaveClass("inline-flex");
    expect(buttonElement).toHaveClass("bg-primary");
  });
});
