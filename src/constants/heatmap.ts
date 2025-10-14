import dynamic from "next/dynamic";

export const HeatmapMap = dynamic(
  () => import("@viasegura/components/heat-map"),
  {
    ssr: false,
  }
);
