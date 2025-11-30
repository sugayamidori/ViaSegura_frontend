import dynamic from "next/dynamic";
import { HeatmapResponse } from "@viasegura/types/heatmap";

export const HeatmapMap = dynamic(
  () => import("@viasegura/components/heatmap"),
  {
    ssr: false,
  }
);

export const EMPTY_RESPONSE: HeatmapResponse = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  size: 0,
  number: 0,
  first: true,
  last: true,
  empty: true,
};

export const HEATMAP_DEFAULTS = {
  START_YEAR: 2015,
  END_YEAR: 2024,
  IGNORED_NEIGHBORHOOD: "All",
};

export const HEATMAP_ENDPOINTS = {
  EXPORT: "heatmap/export",
};
