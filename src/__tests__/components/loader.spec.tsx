import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  Loader,
  PrimarySpinner,
  PulseLoader,
} from "@viasegura/components/loader";

jest.mock("lucide-react", () => ({
  Loader2: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="loader-icon" className={className} {...props} />
  ),
}));

jest.mock("@viasegura/lib/utils", () => ({
  cn: (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(" "),
}));

describe("Loader Components", () => {
  describe("Loader", () => {
    test("should render the container and the icon", () => {
      render(<Loader />);
      expect(screen.getByTestId("loader-component")).toBeInTheDocument();
      expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    });

    test("should apply default classes to the icon", () => {
      render(<Loader />);
      const icon = screen.getByTestId("loader-icon");
      expect(icon).toHaveClass("h-16 w-16 animate-spin");
    });

    test("should merge custom className to the icon", () => {
      render(<Loader className="text-red-500 custom-class" />);
      const icon = screen.getByTestId("loader-icon");

      expect(icon).toHaveClass("h-16 w-16 animate-spin");
      expect(icon).toHaveClass("text-red-500 custom-class");
    });
  });

  describe("PrimarySpinner", () => {
    test("should render with correct default classes structure", () => {
      const { container } = render(<PrimarySpinner />);
      const wrapper = container.firstChild as HTMLElement;

      expect(wrapper).toHaveClass(
        "min-h-screen bg-gradient-hero flex items-center justify-center"
      );

      const spinner = wrapper.querySelector("div");
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass(
        "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
      );
    });

    test("should merge custom className to the container", () => {
      const { container } = render(
        <PrimarySpinner className="z-50 custom-bg" />
      );
      const wrapper = container.firstChild as HTMLElement;

      expect(wrapper).toHaveClass("min-h-screen");
      expect(wrapper).toHaveClass("z-50 custom-bg");
    });
  });

  describe("PulseLoader", () => {
    test("should render with all animation elements", () => {
      const { container } = render(<PulseLoader />);
      const wrapper = container.firstChild as HTMLElement;

      expect(wrapper).toHaveClass("relative flex items-center justify-center");

      const pingElement = wrapper.querySelector(".animate-ping");
      expect(pingElement).toBeInTheDocument();
      expect(pingElement).toHaveClass(
        "absolute h-24 w-24 rounded-full bg-primary/20"
      );

      const pulseElement = wrapper.querySelector(".animate-pulse:not(svg)");
      expect(pulseElement).toBeInTheDocument();
      expect(pulseElement).toHaveClass(
        "absolute h-16 w-16 rounded-full bg-primary/10"
      );

      const icon = screen.getByTestId("loader-icon");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass("h-6 w-6 text-primary-foreground animate-spin");
    });

    test("should merge custom className to the container", () => {
      const { container } = render(<PulseLoader className="mt-10 mb-4" />);
      const wrapper = container.firstChild as HTMLElement;

      expect(wrapper).toHaveClass("relative flex items-center justify-center");
      expect(wrapper).toHaveClass("mt-10 mb-4");
    });
  });
});
