import { fetchAPI } from ".";
import { getCookie } from "cookies-next";
import { COOKIE_TOKEN } from "@viasegura/constants/cookies";

import {
  ExportHeatmapParams,
  HeatmapParams,
  HeatmapResponse,
} from "@viasegura/types/heatmap";
import {
  EMPTY_RESPONSE,
  HEATMAP_ENDPOINTS,
} from "@viasegura/constants/heatmap";
import {
  buildExportQueryParams,
  buildHeatmapQueryParams,
} from "@viasegura/utils/heatmap-params";

let token = getCookie(COOKIE_TOKEN);

export const heatmap = async (
  params?: HeatmapParams
): Promise<HeatmapResponse> => {
  const queryString = buildHeatmapQueryParams(params);
  const url = queryString
    ? `${HEATMAP_ENDPOINTS.GET}?${queryString}`
    : HEATMAP_ENDPOINTS.GET;

  const response = await fetchAPI({
    url: url,
    options: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  if (!response.ok) return EMPTY_RESPONSE as HeatmapResponse;

  return response.json().catch(() => EMPTY_RESPONSE as HeatmapResponse);
};

export const neighborhood = async () => {
  const response = await fetchAPI({
    url: `h3_grid/neighborhoods`,
    options: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  return response.json();
};

export const exportHeatmapData = async (params?: ExportHeatmapParams) => {
  const queryString = buildExportQueryParams(params);
  const url = `${HEATMAP_ENDPOINTS.EXPORT}?${queryString}`;

  const response = await fetchAPI({
    url: url,
    options: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  return response.json();
};
