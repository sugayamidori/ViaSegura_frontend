import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MonthYearPicker } from "@viasegura/components/monthYearPicker";

const MIN_YEAR = 2015;
const MAX_YEAR = 2024;

jest.mock("lucide-react", () => ({
  ChevronLeft: () => <span data-testid="chevron-left" />,
  ChevronRight: () => <span data-testid="chevron-right" />,
  Calendar: () => <span data-testid="calendar-icon" />,
  AlertCircle: () => <span data-testid="alert-circle" />,
}));

jest.mock("@viasegura/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    className,
    disabled,
    variant,
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

jest.mock("@viasegura/components/ui/popover", () => ({
  Popover: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-root">{children}</div>
  ),
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-trigger">{children}</div>
  ),
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-content">{children}</div>
  ),
}));

jest.mock("@viasegura/lib/utils", () => ({
  cn: (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(" "),
}));

describe("MonthYearPicker Component", () => {
  const mockSetDate = jest.fn();
  const defaultDate = new Date(2023, 5, 15);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render with placeholder when no date is provided", () => {
    render(<MonthYearPicker setDate={mockSetDate} />);

    expect(screen.getByText("Selecione a Data")).toBeInTheDocument();
    expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
  });

  test("should render with formatted date when date is provided", () => {
    render(<MonthYearPicker date={defaultDate} setDate={mockSetDate} />);

    expect(screen.getByText(/Junho de 2023/)).toBeInTheDocument();
  });

  test("should display the current year and months grid", () => {
    render(<MonthYearPicker date={defaultDate} setDate={mockSetDate} />);

    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText(/Jan/)).toBeInTheDocument();
    expect(screen.getByText(/Dez/)).toBeInTheDocument();
  });

  test("should highlight the selected month", () => {
    render(<MonthYearPicker date={defaultDate} setDate={mockSetDate} />);

    const junButton = screen.getByText("Jun").closest("button");
    const janButton = screen.getByText("Jan").closest("button");

    expect(junButton).toHaveAttribute("data-variant", "default");
    expect(janButton).toHaveAttribute("data-variant", "ghost");
  });

  test("should navigate to previous year when clicking previous chevron", () => {
    render(<MonthYearPicker date={defaultDate} setDate={mockSetDate} />);

    const prevButton = screen.getByTestId("chevron-left").closest("button");

    fireEvent.click(prevButton!);
    expect(screen.getByText("2022")).toBeInTheDocument();
  });

  test("should navigate to next year when clicking next chevron", () => {
    render(<MonthYearPicker date={defaultDate} setDate={mockSetDate} />);

    const nextButton = screen.getByTestId("chevron-right").closest("button");

    fireEvent.click(nextButton!);
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  test("should disable previous button when on MIN_YEAR", () => {
    const minDate = new Date(MIN_YEAR, 0, 1);
    render(<MonthYearPicker date={minDate} setDate={mockSetDate} />);

    expect(screen.getByText(String(MIN_YEAR))).toBeInTheDocument();

    const prevButton = screen.getByTestId("chevron-left").closest("button");
    expect(prevButton).toBeDisabled();
  });

  test("should disable next button when on MAX_YEAR", () => {
    const maxDate = new Date(MAX_YEAR, 0, 1);
    render(<MonthYearPicker date={maxDate} setDate={mockSetDate} />);

    expect(screen.getByText(String(MAX_YEAR))).toBeInTheDocument();

    const nextButton = screen.getByTestId("chevron-right").closest("button");
    expect(nextButton).toBeDisabled();
  });

  test("should call setDate with correct date when a month is selected", () => {
    render(<MonthYearPicker date={defaultDate} setDate={mockSetDate} />);

    const setButton = screen.getByText("Set");
    fireEvent.click(setButton);

    expect(mockSetDate).toHaveBeenCalledTimes(1);

    const callArg = mockSetDate.mock.calls[0][0];
    expect(callArg.getFullYear()).toBe(2023);
    expect(callArg.getMonth()).toBe(8);
    expect(callArg.getDate()).toBe(1);
  });

  test("should update internal year state when changing years and then selecting a month", () => {
    render(<MonthYearPicker date={defaultDate} setDate={mockSetDate} />); // 2023

    const nextButton = screen.getByTestId("chevron-right").closest("button");
    fireEvent.click(nextButton!);

    expect(screen.getByText("2024")).toBeInTheDocument();

    const fevButton = screen.getByText("Fev");
    fireEvent.click(fevButton);

    const callArg = mockSetDate.mock.calls[0][0];
    expect(callArg.getFullYear()).toBe(2024);
    expect(callArg.getMonth()).toBe(1);
  });

  test("should render the available data range info", () => {
    render(<MonthYearPicker setDate={mockSetDate} />);

    expect(
      screen.getByText((content, element) => {
        const normalizedText = content.replace(/\s+/g, " ").trim();
        return normalizedText.includes(
          `Dados disponíveis: ${MIN_YEAR} a ${MAX_YEAR}`
        );
      })
    ).toBeInTheDocument();

    expect(screen.getByTestId("alert-circle")).toBeInTheDocument();
  });
});
