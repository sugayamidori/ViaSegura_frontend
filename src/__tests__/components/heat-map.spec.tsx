import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HeatmapMap from "@viasegura/components/heat-map";
import { MapContainer, TileLayer } from "react-leaflet";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

jest.mock("leaflet/dist/leaflet.css", () => ({}));

jest.mock("react-leaflet", () => ({
  MapContainer: jest.fn(({ children }) => (
    <div data-testid="mock-map-container">{children}</div>
  )),
  TileLayer: jest.fn(() => <div data-testid="mock-tile-layer" />),
}));

jest.mock("react-leaflet-heatmap-layer-v3", () => ({
  HeatmapLayer: jest.fn(() => <div data-testid="mock-heatmap-layer" />),
}));

describe("HeatmapMap Component", () => {
  const mockData: [number, number, number][] = [
    [-8.05, -34.88, 5],
    [-8.06, -34.89, 10],
  ];

  const mockMapUrl = "https://mock.tile.server/tile.png";
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_MAP_TILE_URL = mockMapUrl;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("should render the MapContainer with the correct props", () => {
    render(<HeatmapMap data={mockData} />);

    expect(screen.getByTestId("mock-map-container")).toBeInTheDocument();

    expect(MapContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [-8.05428, -34.8813],
        zoom: 12,
        style: { height: "100%", width: "100%" },
        className: "z-0",
      }),
      undefined
    );
  });

  test("should render the TileLayer with the environment URL", () => {
    render(<HeatmapMap data={mockData} />);

    expect(screen.getByTestId("mock-tile-layer")).toBeInTheDocument();

    expect(TileLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        url: mockMapUrl,
      }),
      undefined
    );
  });

  test("should render the HeatmapLayer with the correct data and extractors", () => {
    render(<HeatmapMap data={mockData} />);

    expect(screen.getByTestId("mock-heatmap-layer")).toBeInTheDocument();

    expect(HeatmapLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        points: mockData,
        radius: 25,
        blur: 20,
      }),
      undefined
    );

    const heatmapProps = (HeatmapLayer as jest.Mock).mock.calls[0][0];
    const testPoint: [number, number, number] = [10, 20, 30];
    expect(heatmapProps.latitudeExtractor(testPoint)).toBe(10);
    expect(heatmapProps.longitudeExtractor(testPoint)).toBe(20);
    expect(heatmapProps.intensityExtractor(testPoint)).toBe(30);
  });

  test("should use the TileLayer fallback URL if the env var is not set", () => {
    delete process.env.NEXT_PUBLIC_MAP_TILE_URL;

    render(<HeatmapMap data={mockData} />);

    expect(TileLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "",
      }),
      undefined
    );
  });
});
