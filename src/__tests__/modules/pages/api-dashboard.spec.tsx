import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import ApiDashboard from "@viasegura/modules/api-dashboard/page/index";

jest.mock("@viasegura/components/header", () => ({
  Header: () => <div data-testid="mock-header">Header</div>,
}));

jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

jest.mock("@viasegura/components/loader", () => ({
  PrimarySpinner: () => <div data-testid="primary-spinner">Loading...</div>,
}));

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("API Dashboard Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should render loading state initially", () => {
    render(<ApiDashboard />);
    expect(screen.getByTestId("primary-spinner")).toBeInTheDocument();
  });

  test("should render dashboard content after loading", async () => {
    render(<ApiDashboard />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("primary-spinner")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Gerenciamento de API")).toBeInTheDocument();
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(
      screen.getByText("mock_api_key_live_123abc456def789ghi")
    ).toBeInTheDocument();
    expect(screen.getByText("Requisições Usadas")).toBeInTheDocument();
    expect(screen.getAllByText("22").length).toBeGreaterThan(0);
  });

  test("should copy API key to clipboard", async () => {
    render(<ApiDashboard />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(
        screen.getByText("mock_api_key_live_123abc456def789ghi")
      ).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole("button");
    const copyBtn = buttons.find((btn) => btn.className.includes("shrink-0"));

    if (copyBtn) {
      fireEvent.click(copyBtn);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "mock_api_key_live_123abc456def789ghi"
      );
    } else {
      throw new Error("Copy button not found");
    }
  });
});
