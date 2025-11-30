import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Header } from "@viasegura/components/header";

const mockPush = jest.fn();
const mockUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockUsePathname(),
}));

const mockClearToken = jest.fn();
jest.mock("@viasegura/utils/auth", () => ({
  clearToken: () => mockClearToken(),
}));

jest.mock("@viasegura/constants/routes", () => ({
  PROTECTED_ROUTES: ["/heatmap", "api-dashboard"],
}));

jest.mock("lucide-react", () => ({
  MapPin: () => <div data-testid="icon-mappin" />,
  Activity: () => <div data-testid="icon-activity" />,
  LogOut: () => <div data-testid="icon-logout" />,
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("@viasegura/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@viasegura/components/colorBlindness", () => ({
  ColorBlindnessToggle: () => <div data-testid="color-toggle-mock" />,
}));

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Public Routes behavior", () => {
    beforeEach(() => {
      mockUsePathname.mockReturnValue("/");
    });

    test("should render public navigation links and buttons", () => {
      render(<Header />);

      expect(screen.getByText("ViaSegura").closest("a")).toHaveAttribute(
        "href",
        "/"
      );

      expect(screen.getByText("Início")).toBeInTheDocument();
      expect(screen.getByText("API")).toBeInTheDocument();

      expect(screen.getByText("Entrar")).toBeInTheDocument();
      expect(screen.getByText("Registre-se")).toBeInTheDocument();

      expect(screen.getByTestId("color-toggle-mock")).toBeInTheDocument();

      expect(screen.queryByText("Sair")).not.toBeInTheDocument();
    });
  });

  test("should render logout button when on a protected route", () => {
    mockUsePathname.mockReturnValue("/heatmap");
    render(<Header />);

    expect(screen.getByText("ViaSegura").closest("a")).toHaveAttribute(
      "href",
      "#"
    );

    expect(screen.getByText("Sair")).toBeInTheDocument();
    expect(screen.getByTestId("icon-logout")).toBeInTheDocument();
    expect(screen.getByTestId("color-toggle-mock")).toBeInTheDocument();

    expect(screen.queryByText("Início")).not.toBeInTheDocument();
    expect(screen.queryByText("Entrar")).not.toBeInTheDocument();
    expect(screen.queryByText("Registre-se")).not.toBeInTheDocument();
  });

  test("should call clearToken and push to /login on logout", () => {
    mockUsePathname.mockReturnValue("/heatmap");
    render(<Header />);

    const logoutButton = screen.getByText("Sair");
    fireEvent.click(logoutButton);

    expect(mockClearToken).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
