import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ColorBlindnessToggle } from "@viasegura/components/colorBlindness";

jest.mock("lucide-react", () => ({
  Eye: () => <div data-testid="eye-icon" />,
  Palette: () => <div data-testid="palette-icon" />,
}));

jest.mock("@viasegura/components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@viasegura/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    className: string;
  }) => (
    <button onClick={onClick} className={className} data-testid="dropdown-item">
      {children}
    </button>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuSeparator: () => <hr />,
}));

let mockStorage: Record<string, string> = {};

const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

const mockClassListAdd = jest.fn();
const mockClassListRemove = jest.fn();

Object.defineProperty(document, "documentElement", {
  value: {
    classList: {
      add: mockClassListAdd,
      remove: mockClassListRemove,
    },
  },
  writable: true,
  configurable: true,
});

describe("ColorBlindnessToggle Component", () => {
  beforeEach(() => {
    mockStorage = {};
    getItemSpy.mockClear();
    setItemSpy.mockClear();
    mockClassListAdd.mockClear();
    mockClassListRemove.mockClear();

    getItemSpy.mockImplementation((key: string) => mockStorage[key] || null);
    setItemSpy.mockImplementation((key: string, value: string) => {
      mockStorage[key] = value;
    });
  });

  test("should render in normal mode by default", () => {
    render(<ColorBlindnessToggle />);

    expect(screen.getByTestId("eye-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("palette-icon")).not.toBeInTheDocument();
    expect(getItemSpy).toHaveBeenCalledWith("colorblind-mode");
    expect(mockClassListAdd).not.toHaveBeenCalled();
  });

  test("should load the mode from localStorage on mount", () => {
    mockStorage["colorblind-mode"] = "protan";

    render(<ColorBlindnessToggle />);

    expect(screen.getByTestId("palette-icon")).toBeInTheDocument();
    expect(mockClassListAdd).toHaveBeenCalledWith("colorblind-protan");

    const protanItem = screen.getByText("Protanopia/Deuteranopia");
    expect(protanItem.closest("button")).toHaveClass(
      "bg-accent text-accent-foreground"
    );
  });

  test("should change mode, update localStorage, and apply class on click", () => {
    render(<ColorBlindnessToggle />);

    expect(screen.queryByTestId("palette-icon")).not.toBeInTheDocument();

    const tritanItem = screen.getByText("Tritanopia");
    fireEvent.click(tritanItem);

    expect(screen.getByTestId("palette-icon")).toBeInTheDocument();
    expect(setItemSpy).toHaveBeenCalledWith("colorblind-mode", "tritan");
    expect(mockStorage["colorblind-mode"]).toBe("tritan");
    expect(mockClassListAdd).toHaveBeenCalledWith("colorblind-tritan");
    expect(tritanItem.closest("button")).toHaveClass(
      "bg-accent text-accent-foreground"
    );
  });

  test("should remove the old class when changing from one mode to another", () => {
    mockStorage["colorblind-mode"] = "protan";
    render(<ColorBlindnessToggle />);

    expect(mockClassListAdd).toHaveBeenCalledWith("colorblind-protan");
    mockClassListAdd.mockClear();

    const achromItem = screen.getByText("Alto Contraste");
    fireEvent.click(achromItem);

    expect(mockClassListRemove).toHaveBeenCalledWith("colorblind-protan");
    expect(mockClassListAdd).toHaveBeenCalledWith("colorblind-achrom");
  });

  test("should remove the class and palette icon when returning to Normal mode", () => {
    mockStorage["colorblind-mode"] = "tritan";
    render(<ColorBlindnessToggle />);

    expect(screen.getByTestId("palette-icon")).toBeInTheDocument();
    expect(mockClassListAdd).toHaveBeenCalledWith("colorblind-tritan");
    mockClassListAdd.mockClear();

    const normalItem = screen.getByText("Clássico");
    fireEvent.click(normalItem);

    expect(screen.queryByTestId("palette-icon")).not.toBeInTheDocument();
    expect(setItemSpy).toHaveBeenCalledWith("colorblind-mode", "classico");
    expect(mockClassListRemove).toHaveBeenCalledWith("colorblind-tritan");
    expect(mockClassListAdd).not.toHaveBeenCalled();
  });
});
