import { ExportHeatmapParams, HeatmapParams } from "@viasegura/types/heatmap";
import { HEATMAP_DEFAULTS } from "@viasegura/constants/heatmap";

export const buildHeatmapQueryParams = (params?: HeatmapParams): string => {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  const queryParams = {
    neighborhood:
      params.neighborhood === HEATMAP_DEFAULTS.IGNORED_NEIGHBORHOOD
        ? undefined
        : params.neighborhood,
    h3Cell: params.h3Cell,
    start_year: params.start_year,
    start_month: params.start_month,
    end_year: params.end_year,
    end_month: params.end_month,
    num_casualties: params.num_casualties,
    page: params.page,
    pageSize: params.pageSize,
  };

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
};

export const buildExportQueryParams = (
  params?: ExportHeatmapParams
): string => {
  const searchParams = new URLSearchParams();

  const queryParams = {
    start_year: params?.start_year ?? HEATMAP_DEFAULTS.START_YEAR,
    end_year: params?.end_year ?? HEATMAP_DEFAULTS.END_YEAR,
    neighborhood:
      params?.neighborhood === HEATMAP_DEFAULTS.IGNORED_NEIGHBORHOOD
        ? undefined
        : params?.neighborhood,
    start_month: params?.start_month,
    end_month: params?.end_month,
  };

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
};
