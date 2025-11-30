export interface HeatmapPoint {
  h3Cell: string;
  latitude: number;
  longitude: number;
  neighborhood: string;
  createdAt: string;
}

export interface HeatmapResponse {
  content: HeatmapPoint[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface HeatmapParams {
  page?: number;
  pageSize?: number;
  h3Cell?: string;
  latitude?: number;
  longitude?: number;
  neighborhood?: string;
}

export interface ExportHeatmapParams {
  start_year?: number;
  start_month?: number;
  end_year?: number;
  end_month?: number;
  num_casualties?: number;
  neighborhood?: string;
}
