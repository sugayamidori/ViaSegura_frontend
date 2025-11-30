import { ExportHeatmapParams } from "@viasegura/types/heatmap";
import { HEATMAP_DEFAULTS } from "@viasegura/constants/heatmap";

export const buildExportQueryParams = (
  params?: ExportHeatmapParams
): string => {
  const {
    start_year = HEATMAP_DEFAULTS.START_YEAR,
    end_year = HEATMAP_DEFAULTS.END_YEAR,
    neighborhood,
    start_month,
    end_month,
  } = params || {};

  const searchParams = new URLSearchParams();

  searchParams.set("start_year", String(start_year));
  searchParams.set("end_year", String(end_year));

  if (neighborhood && neighborhood !== HEATMAP_DEFAULTS.IGNORED_NEIGHBORHOOD) {
    searchParams.set("neighborhood", neighborhood);
  }

  if (start_month) searchParams.set("start_month", String(start_month));
  if (end_month) searchParams.set("end_month", String(end_month));

  return searchParams.toString();
};
