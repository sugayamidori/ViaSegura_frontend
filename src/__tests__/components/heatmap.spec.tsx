import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HeatmapMap from "@viasegura/components/heatmap";
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

    const mapContainerMock = MapContainer as unknown as jest.Mock;
    const mapProps = mapContainerMock.mock.calls[0][0];

    expect(mapProps.center).toEqual([-8.05428, -34.8813]);
    expect(mapProps.zoom).toBe(11);
    expect(mapProps.style).toEqual({ height: "100%", width: "100%" });
    expect(mapProps.className).toBe("z-0");
  });

  test("should render the TileLayer with the environment URL", () => {
    render(<HeatmapMap data={mockData} />);

    expect(screen.getByTestId("mock-tile-layer")).toBeInTheDocument();

    const tileLayerMock = TileLayer as unknown as jest.Mock;
    const tileProps = tileLayerMock.mock.calls[0][0];

    expect(tileProps.url).toBe(mockMapUrl);
  });

  test("should render the HeatmapLayer with the correct data and extractors", () => {
    render(<HeatmapMap data={mockData} />);

    expect(screen.getByTestId("mock-heatmap-layer")).toBeInTheDocument();

    const heatmapLayerMock = HeatmapLayer as unknown as jest.Mock;
    const heatmapProps = heatmapLayerMock.mock.calls[0][0];

    expect(heatmapProps.points).toEqual(mockData);
    expect(heatmapProps.radius).toBe(25);
    expect(heatmapProps.blur).toBe(20);

    const testPoint: [number, number, number] = [10, 20, 30];

    expect(heatmapProps.latitudeExtractor(testPoint)).toBe(10);
    expect(heatmapProps.longitudeExtractor(testPoint)).toBe(20);
    expect(heatmapProps.intensityExtractor(testPoint)).toBe(30);
  });

  test("should use the TileLayer fallback URL if the env var is not set", () => {
    delete process.env.NEXT_PUBLIC_MAP_TILE_URL;

    render(<HeatmapMap data={mockData} />);

    const tileLayerMock = TileLayer as unknown as jest.Mock;
    const tileProps = tileLayerMock.mock.calls[0][0];

    expect(tileProps.url).toBe("");
  });
});
