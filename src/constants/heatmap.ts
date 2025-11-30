import dynamic from "next/dynamic";
import { HeatmapResponse } from "@viasegura/types/heatmap";

export const HeatmapMap = dynamic(
  () => import("@viasegura/components/heat-map"),
  {
    ssr: false,
  }
);

export const queryParams = new URLSearchParams();

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
