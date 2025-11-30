import { fetchAPI } from ".";
import { getCookie } from "cookies-next";
import { COOKIE_TOKEN } from "@viasegura/constants/cookies";

import { HeatmapParams, HeatmapResponse } from "@viasegura/types/heatmap";
import { EMPTY_RESPONSE } from "@viasegura/constants/heatmap";

let token = getCookie(COOKIE_TOKEN);

export const heatmap = async (
  params?: HeatmapParams
): Promise<HeatmapResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.neighborhood && params.neighborhood !== "All") {
    searchParams.set("neighborhood", params.neighborhood);
  }

  const queryString = searchParams.toString();
  const url = queryString ? `h3_grid?${queryString}` : "h3_grid?";

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

  if (!response.ok) return EMPTY_RESPONSE;

  return response.json().catch(() => EMPTY_RESPONSE);
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
