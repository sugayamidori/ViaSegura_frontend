"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  Filter,
  MapPin,
  Search,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Header } from "@viasegura/components/header";
import { Button } from "@viasegura/components/ui/button";
import { Input } from "@viasegura/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@viasegura/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@viasegura/components/ui/select";

import { HeatmapMap } from "@viasegura/constants/heatmap";
import { heatmap } from "@viasegura/service/heatmap";
import { HeatmapResponse } from "@viasegura/types/heatmap";

const NEIGHBORHOODS = [
  "All",
  "Nova Descoberta",
  "Mangueira",
  "Boa Viagem",
  "Cajueiro",
  "Centro",
];

const TIME_PERIODS = [
  "Last week",
  "Last month",
  "Last 3 months",
  "Last 6 months",
  "Last year",
];

const HeatMap = () => {
  const [apiData, setApiData] = useState<HeatmapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const totalIncidents = apiData?.totalElements || 0;

  const [filters, setFilters] = useState({
    neighborhood: "",
    period: "",
    search: "",
  });

  const fetchHeatmapData = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await heatmap();
      setApiData(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading heatmap:", error);
      setIsLoading(false);
    }
  }, [filters.neighborhood]);

  const heatmapData = useMemo(() => {
    if (!apiData?.content) return [];

    return apiData.content
      .map((item) => {
        const lat = Number(item.latitude);
        const lng = Number(item.longitude);

        if (isNaN(lat) || isNaN(lng)) return null;

        return [lat, lng, 1] as [number, number, number];
      })
      .filter((item): item is [number, number, number] => item !== null);
  }, [apiData]);

  const topNeighborhood = useMemo(() => {
    if (!apiData?.content || apiData.content.length === 0) return "-";

    const counts: Record<string, number> = {};
    let maxCount = 0;
    let topName = "-";

    apiData.content.forEach((item) => {
      const name = item.neighborhood;
      counts[name] = (counts[name] || 0) + 1;
      if (counts[name] > maxCount) {
        maxCount = counts[name];
        topName = name;
      }
    });

    return topName
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [apiData]);

  const affectedRegionsCount = useMemo(() => {
    if (!apiData?.content) return 0;
    return new Set(apiData.content.map((i) => i.neighborhood)).size;
  }, [apiData]);

  useEffect(() => {
    fetchHeatmapData();
  }, [fetchHeatmapData]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Mapa de Calor de Sinistros
            </h1>
            <p className="text-muted-foreground text-lg">
              Visualize e analise a distribuição de sinistros por região com
              filtros avançados
            </p>
          </div>

          <Card className="mb-8 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros de Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar localização..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className="pl-10"
                  />
                </div>

                <Select
                  value={filters.neighborhood}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, neighborhood: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    {NEIGHBORHOODS.map((neighborhood) => (
                      <SelectItem key={neighborhood} value={neighborhood}>
                        {neighborhood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.period}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, period: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_PERIODS.map((period) => (
                      <SelectItem key={period} value={period}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      neighborhood: "",
                      period: "",
                      search: "",
                    })
                  }
                >
                  Limpar Filtros
                </Button>
                <Button
                  className="bg-gradient-primary"
                  onClick={fetchHeatmapData}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading
                    </>
                  ) : (
                    "Aplicar Filtros"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Mapa de Calor Regional
                  </CardTitle>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 transition-all hover:bg-muted"
                    onClick={fetchHeatmapData}
                    disabled={isLoading}
                    title="Recarregar dados"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        isLoading
                          ? "animate-spin text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </CardHeader>

                <CardContent>
                  <div className="h-[500px] w-full rounded-lg overflow-hidden relative border bg-muted/10 group">
                    {isLoading && (
                      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm transition-all duration-300">
                        <div className="relative flex items-center justify-center mb-4">
                          <div className="absolute h-24 w-24 animate-ping rounded-full bg-primary/20 opacity-75 duration-1000" />
                          <div className="absolute h-16 w-16 rounded-full bg-primary/10 animate-pulse" />
                          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
                            <Loader2 className="h-6 w-6 text-primary-foreground animate-spin" />
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm font-semibold text-foreground tracking-tight">
                            Atualizando mapa de calor
                          </span>
                          <span className="text-xs text-muted-foreground animate-pulse">
                            Sincronizando dados geográficos...
                          </span>
                        </div>
                      </div>
                    )}

                    {!isLoading && <HeatmapMap data={heatmapData} />}

                    {!isLoading && heatmapData.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-background/90 backdrop-blur px-6 py-4 rounded-full shadow-lg border border-border flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm font-medium">
                            Nenhum sinistro encontrado nesta região
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Resumo Geral
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-3xl font-bold text-primary">
                      {isLoading ? "-" : totalIncidents}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total de Sinistros
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/10">
                      <div className="text-xl font-semibold text-foreground">
                        {isLoading ? "-" : affectedRegionsCount}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        Bairros Afetados
                      </div>
                    </div>

                    <div className="text-center p-3 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-lg border border-destructive/10">
                      <div className="text-xl font-semibold text-foreground truncate px-1">
                        {isLoading ? "-" : topNeighborhood}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        Maior Incidência
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Exportar dados
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeatMap;
