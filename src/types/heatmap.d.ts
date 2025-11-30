export interface HeatmapMetric {
  h3Cell: string;
  year: number;
  month: number;
  numCasualties: number;
  createdAt: string;
}

export interface HeatmapCoordinate {
  h3Cell: string;
  latitude: number;
  longitude: number;
  neighborhood: string;
  createdAt: string;
}

export interface HeatmapPoint {
  heatmap: HeatmapMetric;
  coordinates: HeatmapCoordinate[];
}

export interface HeatmapParams {
  neighborhood?: string;
  h3Cell?: string;
  start_year?: number;
  start_month?: number;
  end_year?: number;
  end_month?: number;
  num_casualties?: number;
  page?: number;
  pageSize?: number;
}

export interface ExportHeatmapParams {
  neighborhood?: string;
  start_year?: number;
  start_month?: number;
  end_year?: number;
  end_month?: number;
}

export interface HeatmapResponse {
  content: HeatmapPoint[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
