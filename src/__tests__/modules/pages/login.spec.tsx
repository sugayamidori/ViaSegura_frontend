import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "@viasegura/app/login/page";

jest.mock("@viasegura/modules/auth/components/login-form/index", () => ({
  LoginForm: () => <div data-testid="login-form-mock" />,
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("lucide-react", () => ({
  ArrowLeft: () => <span data-testid="icon-arrow-left" />,
  MapPin: () => <span data-testid="icon-map-pin" />,
  Activity: () => <span data-testid="icon-activity" />,
}));

jest.mock("@viasegura/components/ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className: string;
  }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h1>{children}</h1>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("Login Page", () => {
  test("should render the branding and title correctly", () => {
    render(<Login />);

    expect(screen.getByText("ViaSegura")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Bem-vindo de volta" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Entre na sua conta para acessar o dashboard")
    ).toBeInTheDocument();

    expect(screen.getByTestId("icon-map-pin")).toBeInTheDocument();
  });

  test("should render the 'Back to home' link", () => {
    render(<Login />);

    const backLink = screen.getByText("Voltar para home").closest("a");
    expect(backLink).toHaveAttribute("href", "/");
    expect(screen.getByTestId("icon-arrow-left")).toBeInTheDocument();
  });

  test("should render the LoginForm component", () => {
    render(<Login />);
    expect(screen.getByTestId("login-form-mock")).toBeInTheDocument();
  });
});
