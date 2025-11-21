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
  PROTECTED_ROUTES: ["/heat-map", "api-dashboard"],
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
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@viasegura/components/colorBlindness", () => ({
  ColorBlindnessToggle: () => <div data-testid="color-toggle-mock" />,
}));

describe("Header Component", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockClearToken.mockClear();
    mockUsePathname.mockClear();
  });

  test("should render public links when on a public route", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Header />);

    expect(screen.getByText("ViaSegura").closest("a")).toHaveAttribute(
      "href",
      "/"
    );

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("API")).toBeInTheDocument();
    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.getByText("Registre-se")).toBeInTheDocument();
    expect(screen.queryByText("Sair")).not.toBeInTheDocument();
  });

  test("should render logout button when on a protected route", () => {
    mockUsePathname.mockReturnValue("/heat-map");
    render(<Header />);

    expect(screen.getByText("ViaSegura").closest("a")).toHaveAttribute(
      "href",
      "#"
    );

    expect(screen.getByText("Sair")).toBeInTheDocument();
    expect(screen.getByTestId("icon-logout")).toBeInTheDocument();
    expect(screen.queryByText("Início")).not.toBeInTheDocument();
    expect(screen.queryByText("Entrar")).not.toBeInTheDocument();
  });

  test("should call clearToken and push to /login on logout", () => {
    mockUsePathname.mockReturnValue("/heat-map");
    render(<Header />);

    const logoutButton = screen.getByText("Sair");
    fireEvent.click(logoutButton);

    expect(mockClearToken).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  test("should render public links on /api-dashboard (due to constant mismatch)", () => {
    mockUsePathname.mockReturnValue("/api-dashboard");
    render(<Header />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("API")).toBeInTheDocument();
    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.queryByText("Sair")).not.toBeInTheDocument();
  });
});
