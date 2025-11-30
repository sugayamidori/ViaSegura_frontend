import { fetchAPI } from ".";
import { getCookie } from "cookies-next";
import { COOKIE_TOKEN } from "@viasegura/constants/cookies";

import { HeatmapResponse } from "@viasegura/types/heatmap";
import { queryParams } from "@viasegura/constants/heatmap";
import { EMPTY_RESPONSE } from "@viasegura/constants/heatmap";

let token = getCookie(COOKIE_TOKEN);

export const heatmap = async (): Promise<HeatmapResponse> => {
  const response = await fetchAPI({
    url: `h3_grid?${queryParams.toString()}`,
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
