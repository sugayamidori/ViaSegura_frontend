import "@testing-library/jest-dom";
import { render, screen, configure, cleanup } from "@testing-library/react";

import { Input } from "@viasegura/components/ui/input";

configure({ testIdAttribute: "data-slot" });
afterEach(cleanup);

jest.mock("@viasegura/lib/utils", () => ({
  cn: (...inputs: (string | number | boolean | undefined | null)[]): string => {
    return inputs.filter(Boolean).join(" ");
  },
}));

describe("Input", () => {
  const keyBaseClasses = [
    "flex",
    "h-9",
    "w-full",
    "rounded-md",
    "border",
    "bg-transparent",
    "px-3",
    "py-1",
    "text-base",
    "shadow-xs",
    "outline-none",
    "disabled:opacity-50",
    "focus-visible:border-ring",
    "aria-invalid:ring-destructive/20",
    "aria-invalid:border-destructive",
  ];

  test("renders an input element with data-slot and key base classes", () => {
    render(<Input />);
    const inputElement = screen.getByTestId("input");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.tagName).toBe("INPUT");
    expect(inputElement).toHaveAttribute("data-slot", "input");

    keyBaseClasses.forEach((cls) => {
      expect(inputElement.getAttribute("class")).toContain(cls);
    });
  });

  test('does not set the type attribute if not specified (browser defaults to "text")', () => {
    render(<Input />);
    const inputElement = screen.getByTestId("input");
    expect(inputElement).not.toHaveAttribute("type");
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("sets the correct type attribute", () => {
    render(<Input type="email" />);
    const inputElement = screen.getByTestId("input");
    expect(inputElement).toHaveAttribute("type", "email");
  });

  test('sets type="file" correctly', () => {
    render(<Input type="file" />);
    const inputElement = screen.getByTestId("input");
    expect(inputElement).toHaveAttribute("type", "file");
  });

  test("merges custom className with base classes", () => {
    render(<Input className="custom-input-class" />);
    const inputElement = screen.getByTestId("input");
    expect(inputElement.getAttribute("class")).toContain("custom-input-class");

    expect(inputElement.getAttribute("class")).toContain("w-full");
    expect(inputElement.getAttribute("class")).toContain("border");
  });

  test("passes down standard input attributes (using defaultValue)", () => {
    render(
      <Input
        placeholder="Enter text"
        defaultValue="initial value"
        name="myInput"
        id="input-id"
        data-test="test-attr"
      />
    );
    const inputElement = screen.getByTestId("input");
    expect(inputElement).toHaveAttribute("placeholder", "Enter text");
    expect(inputElement.getAttribute("value")).toBe("initial value");
    expect(inputElement).toHaveAttribute("name", "myInput");
    expect(inputElement).toHaveAttribute("id", "input-id");
    expect(inputElement).toHaveAttribute("data-test", "test-attr");
  });

  test("applies disabled attribute and associated classes", () => {
    render(<Input disabled />);
    const inputElement = screen.getByTestId("input");
    expect(inputElement).toBeDisabled();
    expect(inputElement.getAttribute("class")).toContain("disabled:opacity-50");
    expect(inputElement.getAttribute("class")).toContain(
      "disabled:pointer-events-none"
    );
  });

  test('applies aria-invalid="true" attribute', () => {
    render(<Input aria-invalid="true" />);
    const inputElement = screen.getByTestId("input");
    expect(inputElement).toHaveAttribute("aria-invalid", "true");
  });

  test('applies aria-invalid="false" attribute', () => {
    render(<Input aria-invalid="false" />);
    const inputElement = screen.getByTestId("input");
    expect(inputElement).toHaveAttribute("aria-invalid", "false");
  });

  test("does not apply aria-invalid attribute when aria-invalid prop is absent", () => {
    render(<Input />);
    const inputElement = screen.getByTestId("input");
    expect(inputElement).not.toHaveAttribute("aria-invalid");
  });
});
