import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import * as LabelPrimitive from "@radix-ui/react-label";
import { Label } from "@viasegura/components/ui/label";

jest.mock("@viasegura/lib/utils", () => ({
  cn: (...inputs: (string | number | boolean | undefined | null)[]): string => {
    return inputs.filter(Boolean).join(" ");
  },
}));

jest.mock("@radix-ui/react-label", () => ({
  Root: ({
    children,
    ...props
  }: React.ComponentProps<typeof LabelPrimitive.Root>) => (
    <label {...props}>{children}</label>
  ),
}));

describe("Label", () => {
  const keyBaseClasses = [
    "flex",
    "items-center",
    "gap-2",
    "text-sm",
    "leading-none",
    "font-medium",
    "select-none",
    "group-data-[disabled=true]:pointer-events-none",
    "group-data-[disabled=true]:opacity-50",
    "peer-disabled:cursor-not-allowed",
    "peer-disabled:opacity-50",
  ];

  test("renders a label element with data-slot and key base classes", () => {
    const labelText = "My Label";
    render(<Label>{labelText}</Label>);
    const labelElement = screen.getByText(labelText);

    expect(labelElement).toBeInTheDocument();
    expect(labelElement.tagName).toBe("LABEL");
    expect(labelElement).toHaveAttribute("data-slot", "label");
    expect(labelElement).toHaveTextContent(labelText);

    keyBaseClasses.forEach((cls) => {
      expect(labelElement.getAttribute("class")).toContain(cls);
    });
  });

  test("merges custom className with base classes", () => {
    const labelText = "Another Label";
    render(<Label className="custom-label-class">{labelText}</Label>);
    const labelElement = screen.getByText(labelText);

    expect(labelElement).toBeInTheDocument();
    expect(labelElement.tagName).toBe("LABEL");
    expect(labelElement.getAttribute("class")).toContain("custom-label-class");

    expect(labelElement.getAttribute("class")).toContain("flex");
    expect(labelElement.getAttribute("class")).toContain("text-sm");
  });

  test("passes down standard label attributes like htmlFor", () => {
    const labelText = "Label for Input";
    render(
      <Label htmlFor="input-id" id="label-id">
        {labelText}
      </Label>
    );
    const labelElement = screen.getByText(labelText);

    expect(labelElement).toBeInTheDocument();
    expect(labelElement.tagName).toBe("LABEL");

    expect(labelElement.getAttribute("for")).toBe("input-id");
    expect(labelElement).toHaveAttribute("id", "label-id");
  });

  test("passes down other custom or aria attributes", () => {
    const labelText = "Hidden Label";
    render(
      <Label data-state="checked" aria-hidden="true">
        {labelText}
      </Label>
    );
    const labelElement = screen.getByText(labelText);

    expect(labelElement).toBeInTheDocument();
    expect(labelElement.tagName).toBe("LABEL");
    expect(labelElement).toHaveAttribute("data-state", "checked");
    expect(labelElement).toHaveAttribute("aria-hidden", "true");
  });
});
