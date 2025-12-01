import {
  heatmap,
  neighborhood,
  exportHeatmapData,
} from "@viasegura/services/heatmap";

import { fetchAPI } from "@viasegura/services";
import { getCookie } from "cookies-next";
import {
  buildHeatmapQueryParams,
  buildExportQueryParams,
} from "@viasegura/utils/heatmap-params";
import {
  EMPTY_RESPONSE,
  HEATMAP_ENDPOINTS,
} from "@viasegura/constants/heatmap";

jest.mock("@viasegura/services", () => ({
  __esModule: true,
  fetchAPI: jest.fn(),
}));

jest.mock("cookies-next", () => ({
  getCookie: jest.fn().mockReturnValue("fake-auth-token"),
}));

jest.mock("@viasegura/utils/heatmap-params", () => ({
  buildHeatmapQueryParams: jest.fn(),
  buildExportQueryParams: jest.fn(),
}));

describe("Heatmap Service", () => {
  const mockToken = "fake-auth-token";
  const mockFetchAPI = fetchAPI as jest.Mock;
  const mockBuildHeatmapParams = buildHeatmapQueryParams as jest.Mock;
  const mockBuildExportParams = buildExportQueryParams as jest.Mock;
  const mockGetCookie = getCookie as jest.Mock;

  beforeAll(() => {
    mockGetCookie.mockReturnValue(mockToken);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCookie.mockReturnValue(mockToken);
  });

  describe("heatmap function", () => {
    const mockSuccessResponse = {
      content: [{ some: "data" }],
      totalElements: 1,
    };

    test("should call fetchAPI with correct URL (no params) and headers", async () => {
      mockBuildHeatmapParams.mockReturnValue("");
      mockFetchAPI.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSuccessResponse),
      });

      const result = await heatmap();

      expect(mockBuildHeatmapParams).toHaveBeenCalledWith(undefined);
      expect(mockFetchAPI).toHaveBeenCalledWith({
        url: HEATMAP_ENDPOINTS.GET,
        options: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockToken}`,
          },
        },
      });
      expect(result).toEqual(mockSuccessResponse);
    });

    test("should call fetchAPI with query params when provided", async () => {
      const params = { start_year: 2023 };
      mockBuildHeatmapParams.mockReturnValue("start_year=2023");
      mockFetchAPI.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSuccessResponse),
      });

      await heatmap(params);

      expect(mockBuildHeatmapParams).toHaveBeenCalledWith(params);
      expect(mockFetchAPI).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${HEATMAP_ENDPOINTS.GET}?start_year=2023`,
        })
      );
    });

    test("should return EMPTY_RESPONSE if fetchAPI returns ok: false", async () => {
      mockFetchAPI.mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn(),
      });

      const result = await heatmap();

      expect(result).toEqual(EMPTY_RESPONSE);
    });

    test("should return EMPTY_RESPONSE if response.json() fails", async () => {
      mockFetchAPI.mockResolvedValue({
        ok: true,
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      });

      const result = await heatmap();

      expect(result).toEqual(EMPTY_RESPONSE);
    });
  });

  describe("neighborhood function", () => {
    test("should fetch neighborhoods list correctly", async () => {
      const mockNeighborhoods = ["Centro", "Boa Viagem"];
      mockFetchAPI.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockNeighborhoods),
      });

      const result = await neighborhood();

      expect(mockFetchAPI).toHaveBeenCalledWith({
        url: "h3_grid/neighborhoods",
        options: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockToken}`,
          },
        },
      });
      expect(result).toEqual(mockNeighborhoods);
    });
  });

  describe("exportHeatmapData function", () => {
    test("should construct export URL with query params and return result", async () => {
      const mockExportParams = { neighborhood: "Centro" };
      const mockResponse = { base64: "xyz" };

      mockBuildExportParams.mockReturnValue("neighborhood=Centro");
      mockFetchAPI.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await exportHeatmapData(mockExportParams);

      expect(mockBuildExportParams).toHaveBeenCalledWith(mockExportParams);
      expect(mockFetchAPI).toHaveBeenCalledWith({
        url: `${HEATMAP_ENDPOINTS.EXPORT}?neighborhood=Centro`,
        options: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockToken}`,
          },
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
