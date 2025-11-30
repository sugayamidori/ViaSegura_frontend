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
  pageable: {
    pageNumber: 0,
    pageSize: 0,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
    offset: 0,
    unpaged: false,
    paged: true,
  },
  last: true,
  totalElements: 0,
  totalPages: 0,
  size: 0,
  number: 0,
  sort: {
    empty: true,
    sorted: false,
    unsorted: true,
  },
  first: true,
  numberOfElements: 0,
  empty: true,
};

export const HEATMAP_DEFAULTS = {
  START_YEAR: 2015,
  END_YEAR: 2024,
  IGNORED_NEIGHBORHOOD: "All",
};

export const HEATMAP_ENDPOINTS = {
  GET: "heatmap",
  EXPORT: "heatmap/export",
};
