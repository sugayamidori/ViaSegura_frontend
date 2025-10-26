import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@viasegura/components/ui/select";

jest.mock("@radix-ui/react-select", () => {
  const originalModule = jest.requireActual("@radix-ui/react-select");
  return {
    ...originalModule,
    Portal: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe("Select Component", () => {
  test("renders Select with trigger and placeholder", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </Select>
    );

    expect(screen.getByText("Select an option")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("renders select content with items when open", () => {
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  test("renders groups and labels correctly", () => {
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Group 1</SelectLabel>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Group 2</SelectLabel>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText("Group 1")).toBeInTheDocument();
    expect(screen.getByText("Group 2")).toBeInTheDocument();

    const separator = document.querySelector('[data-slot="select-separator"]');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass("bg-muted");
  });

  test("applies correct size classes", () => {
    const { rerender } = render(
      <Select>
        <SelectTrigger size="default">
          <SelectValue placeholder="Default size" />
        </SelectTrigger>
      </Select>
    );

    const defaultTrigger = screen.getByRole("combobox");
    expect(defaultTrigger).toHaveAttribute("data-size", "default");

    rerender(
      <Select>
        <SelectTrigger size="sm">
          <SelectValue placeholder="Small size" />
        </SelectTrigger>
      </Select>
    );

    const smallTrigger = screen.getByRole("combobox");
    expect(smallTrigger).toHaveAttribute("data-size", "sm");
  });

  test("disables the select when disabled prop is passed", () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Disabled select" />
        </SelectTrigger>
      </Select>
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeDisabled();
  });

  test("renders the chevron icon", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </Select>
    );

    expect(
      screen.getByRole("combobox").querySelector("svg")
    ).toBeInTheDocument();
  });
});
