import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@viasegura/app/page";

jest.mock("@viasegura/components/header", () => ({
  Header: () => <header data-testid="header-mock">Header</header>,
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("lucide-react", () => ({
  MapPin: () => <span data-testid="icon-map-pin" />,
  Activity: () => <span data-testid="icon-activity" />,
  Zap: () => <span data-testid="icon-zap" />,
  Users: () => <span data-testid="icon-users" />,
  Globe: () => <span data-testid="icon-globe" />,
  CheckCircle: () => <span data-testid="icon-check-circle" />,
  ArrowRight: () => <span data-testid="icon-arrow-right" />,
  Map: () => <span data-testid="icon-map" />,
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
    <h3>{children}</h3>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@viasegura/components/ui/button", () => ({
  Button: ({ children, className, ...props }: any) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@viasegura/constants/heatmap", () => ({
  HeatmapMap: ({ data }: { data: any[] }) => (
    <div data-testid="heatmap-mock" data-length={data?.length}>
      Heatmap Component
    </div>
  ),
}));

jest.mock("@viasegura/constants/img", () => ({
  BackgroundRecife: {
    img: "/mock-image.jpg",
    title: "Imagem Aérea do Recife",
  },
}));

describe("Home Page", () => {
  test("should render the header and main hero title", () => {
    render(<Home />);

    expect(screen.getByTestId("header-mock")).toBeInTheDocument();
    expect(screen.getByText(/Visualize sinistros com/i)).toBeInTheDocument();

    const heatmapTexts = screen.getAllByText(/mapas de calor/i);
    expect(heatmapTexts.length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        /Transforme dados de sinistros em insights visuais poderosos/i
      )
    ).toBeInTheDocument();
  });

  test("should render the HeatmapMap component with data", () => {
    render(<Home />);

    const heatmap = screen.getByTestId("heatmap-mock");
    expect(heatmap).toBeInTheDocument();
    expect(heatmap).toHaveAttribute("data-length", "5");
  });

  test("should render the 'Recursos Poderosos' section with cards", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Recursos Poderosos" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Mapas de Calor")[0]).toBeInTheDocument();
    expect(screen.getByText("Performance Rápida")).toBeInTheDocument();
    expect(screen.getByText("Colaboração")).toBeInTheDocument();
    expect(screen.getByTestId("icon-zap")).toBeInTheDocument();
    expect(screen.getByTestId("icon-users")).toBeInTheDocument();
  });

  test("should render the 'About Recife/CTTU' section correctly", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /Explore o mapa de ocorrências de trânsito do Recife/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText("dados oficiais da CTTU")).toBeInTheDocument();

    const image = screen.getByAltText("Imagem Aérea do Recife");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/mock-image.jpg");
    expect(screen.getAllByTestId("icon-check-circle")).toHaveLength(3);
  });

  test("should render Call-to-Action (CTA) links correctly", () => {
    render(<Home />);

    const startNowBtn = screen.getByText("Começar Agora").closest("a");
    expect(startNowBtn).toHaveAttribute("href", "/register");

    const registerBtn = screen
      .getByRole("button", { name: "Registre-se" })
      .closest("a");
    expect(registerBtn).toHaveAttribute("href", "/register");

    const loginBtn = screen
      .getByRole("button", { name: "Já tenho conta" })
      .closest("a");
    expect(loginBtn).toHaveAttribute("href", "/login");
  });

  test("should render the footer", () => {
    render(<Home />);

    expect(screen.getByText(/© 2025 ViaSegura/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Todos os direitos reservados/i)
    ).toBeInTheDocument();

    const footers = screen.getAllByText("ViaSegura");
    expect(footers.length).toBeGreaterThanOrEqual(1);
  });
});
