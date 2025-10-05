import dynamic from "next/dynamic";

export const HeatmapMap = dynamic(
  () => import("@viasegura/modules/heat-map/components"),
  {
    ssr: false,
  }
);
