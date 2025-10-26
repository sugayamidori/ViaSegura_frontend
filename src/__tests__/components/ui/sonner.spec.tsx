import { render } from "@testing-library/react";
import { useTheme } from "next-themes";
import { Toaster as SonnerToasterMock } from "sonner";

import { Toaster } from "@viasegura/components/ui/sonner";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

jest.mock("sonner", () => ({
  Toaster: jest.fn(() => null),
}));

const mockUseTheme = useTheme as jest.Mock;
const mockedSonner = SonnerToasterMock as unknown as jest.Mock;

describe("Toaster Component", () => {
  beforeEach(() => {
    mockUseTheme.mockClear();
    mockedSonner.mockClear();
  });

  test('should use "system" theme by default if useTheme returns undefined', () => {
    mockUseTheme.mockReturnValue({ theme: undefined });

    render(<Toaster />);

    expect(mockedSonner).toHaveBeenCalledTimes(1);

    const propsPassedToSonner = mockedSonner.mock.calls[0][0];

    expect(propsPassedToSonner.theme).toBe("system");
  });

  test('should pass "light" theme correctly', () => {
    mockUseTheme.mockReturnValue({ theme: "light" });

    render(<Toaster />);

    const propsPassedToSonner = mockedSonner.mock.calls[0][0];
    expect(propsPassedToSonner.theme).toBe("light");
  });

  test('should pass "dark" theme correctly', () => {
    mockUseTheme.mockReturnValue({ theme: "dark" });

    render(<Toaster />);

    const propsPassedToSonner = mockedSonner.mock.calls[0][0];
    expect(propsPassedToSonner.theme).toBe("dark");
  });

  test("should pass hardcoded className and toastOptions correctly", () => {
    mockUseTheme.mockReturnValue({ theme: "system" });

    render(<Toaster />);

    expect(mockedSonner).toHaveBeenCalledTimes(1);
    const propsPassedToSonner = mockedSonner.mock.calls[0][0];

    expect(propsPassedToSonner.className).toBe("toaster group");

    expect(propsPassedToSonner.toastOptions).toEqual({
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        description: "group-[.toast]:text-muted-foreground",
        actionButton:
          "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
        cancelButton:
          "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
      },
    });
  });

  test("should spread other props to the Sonner component", () => {
    mockUseTheme.mockReturnValue({ theme: "system" });
    const customProps = {
      position: "top-center",
      richColors: true,
      closeButton: true,
    } as const;

    render(<Toaster {...customProps} />);

    expect(mockedSonner).toHaveBeenCalledTimes(1);

    expect(mockedSonner.mock.calls[0][0]).toMatchObject({
      theme: "system",
      className: "toaster group",
      position: "top-center",
      richColors: true,
      closeButton: true,
    });
  });
});
