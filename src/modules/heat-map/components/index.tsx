"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

type HeatmapDataPoint = [number, number, number];

interface HeatmapMapProps {
  data: HeatmapDataPoint[];
}

const HeatmapMap: React.FC<HeatmapMapProps> = ({ data }) => {
  return (
    <MapContainer
      center={[-8.05428, -34.8813]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url={process.env.NEXT_PUBLIC_MAP_TILE_URL || ""}
        //attribution={process.env.NEXT_PUBLIC_MAP_ATTRIBUTION || ""}
      />

      <HeatmapLayer
        points={data}
        longitudeExtractor={(p: HeatmapDataPoint) => p[1]}
        latitudeExtractor={(p: HeatmapDataPoint) => p[0]}
        intensityExtractor={(p: HeatmapDataPoint) => p[2]}
        radius={25}
        blur={20}
      />
    </MapContainer>
  );
};

export default HeatmapMap;
