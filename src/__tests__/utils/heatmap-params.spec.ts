import {
  buildHeatmapQueryParams,
  buildExportQueryParams,
} from "@viasegura/utils/heatmap-params";
import { HEATMAP_DEFAULTS } from "@viasegura/constants/heatmap";

describe("Heatmap Params Utils", () => {
  describe("buildHeatmapQueryParams", () => {
    test("should return empty string if params is undefined", () => {
      const result = buildHeatmapQueryParams(undefined);
      expect(result).toBe("");
    });

    test("should build query string with valid params", () => {
      const params = {
        start_year: 2020,
        page: 1,
        pageSize: 10,
      };
      const result = buildHeatmapQueryParams(params);

      const searchParams = new URLSearchParams(result);
      expect(searchParams.get("start_year")).toBe("2020");
      expect(searchParams.get("page")).toBe("1");
      expect(searchParams.get("pageSize")).toBe("10");
    });

    test("should ignore neighborhood if it equals IGNORED_NEIGHBORHOOD constant", () => {
      const params = {
        neighborhood: HEATMAP_DEFAULTS.IGNORED_NEIGHBORHOOD,
        start_year: 2020,
      };
      const result = buildHeatmapQueryParams(params);

      const searchParams = new URLSearchParams(result);
      expect(searchParams.has("neighborhood")).toBe(false);
      expect(searchParams.get("start_year")).toBe("2020");
    });

    test("should include neighborhood if it is a specific value", () => {
      const params = {
        neighborhood: "Centro",
      };
      const result = buildHeatmapQueryParams(params);

      expect(result).toBe("neighborhood=Centro");
    });

    test("should filter out undefined values", () => {
      const params = {
        start_year: 2020,
        end_year: undefined,
        h3Cell: undefined,
      };
      const result = buildHeatmapQueryParams(params);

      expect(result).toBe("start_year=2020");
    });

    test("should include numeric values equal to 0", () => {
      const params = {
        page: 0,
      };
      const result = buildHeatmapQueryParams(params);

      expect(result).toBe("page=0");
    });
  });

  describe("buildExportQueryParams", () => {
    test("should use default years if params are undefined", () => {
      const result = buildExportQueryParams();

      const searchParams = new URLSearchParams(result);
      expect(searchParams.get("start_year")).toBe(
        String(HEATMAP_DEFAULTS.START_YEAR)
      );
      expect(searchParams.get("end_year")).toBe(
        String(HEATMAP_DEFAULTS.END_YEAR)
      );
    });

    test("should override default years if provided in params", () => {
      const params = {
        start_year: 2018,
        end_year: 2019,
      };
      const result = buildExportQueryParams(params);

      const searchParams = new URLSearchParams(result);
      expect(searchParams.get("start_year")).toBe("2018");
      expect(searchParams.get("end_year")).toBe("2019");
    });

    test("should ignore neighborhood if it equals IGNORED_NEIGHBORHOOD", () => {
      const params = {
        neighborhood: HEATMAP_DEFAULTS.IGNORED_NEIGHBORHOOD,
      };
      const result = buildExportQueryParams(params);

      const searchParams = new URLSearchParams(result);
      expect(searchParams.has("neighborhood")).toBe(false);
    });

    test("should include neighborhood if specific", () => {
      const params = {
        neighborhood: "Boa Viagem",
      };
      const result = buildExportQueryParams(params);

      expect(result).toContain("neighborhood=Boa+Viagem");
    });

    test("should include optional month parameters", () => {
      const params = {
        start_month: 1,
        end_month: 12,
      };
      const result = buildExportQueryParams(params);

      const searchParams = new URLSearchParams(result);
      expect(searchParams.get("start_month")).toBe("1");
      expect(searchParams.get("end_month")).toBe("12");
      expect(searchParams.has("start_year")).toBe(true);
    });
  });
});
