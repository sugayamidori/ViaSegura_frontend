"use client";

import { useMemo, useState } from "react";
import Header from "@viasegura/components/header";
import { Button } from "@viasegura/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@viasegura/components/ui/card";
import { Input } from "@viasegura/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@viasegura/components/ui/select";
import { BarChart3, Calendar, Filter, MapPin, Search } from "lucide-react";
import { HeatmapMap } from "@viasegura/constants/heatmap";

const HeatMap = () => {
  const [filtros, setFiltros] = useState({
    bairro: "",
    periodo: "",
    tipoSinistro: "",
    pesquisa: "",
  });

  const dadosCalor = [
    { bairro: "Centro", sinistros: 45, intensidade: "alta" },
    { bairro: "Zona Sul", sinistros: 32, intensidade: "media" },
    { bairro: "Zona Norte", sinistros: 28, intensidade: "media" },
    { bairro: "Zona Leste", sinistros: 18, intensidade: "baixa" },
    { bairro: "Zona Oeste", sinistros: 22, intensidade: "baixa" },
  ];

  const tiposSinistro = [
    "Acidente de Trânsito",
    "Roubo/Furto",
    "Incêndio",
    "Vandalismo",
    "Colisão",
    "Todos",
  ];

  const bairros = [
    "Centro",
    "Zona Sul",
    "Zona Norte",
    "Zona Leste",
    "Zona Oeste",
    "Todos",
  ];

  const periodos = [
    "Última semana",
    "Último mês",
    "Últimos 3 meses",
    "Últimos 6 meses",
    "Último ano",
  ];

  const bairroCoordinates: { [key: string]: { lat: number; lng: number } } = {
    Centro: { lat: -8.06315, lng: -34.8812 },
    "Zona Sul": { lat: -8.132, lng: -34.903 },
    "Zona Norte": { lat: -8.033, lng: -34.909 },
    "Zona Leste": { lat: -8.025, lng: -34.885 },
    "Zona Oeste": { lat: -8.055, lng: -34.935 },
  };

  const heatmapData = useMemo(() => {
    return dadosCalor.map((item): [number, number, number] => {
      const coords = bairroCoordinates[item.bairro];
      return [coords?.lat || 0, coords?.lng || 0, item.sinistros];
    });
  }, [dadosCalor]);

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar localização..."
                    value={filtros.pesquisa}
                    onChange={(e) =>
                      setFiltros({ ...filtros, pesquisa: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>

                <Select
                  value={filtros.bairro}
                  onValueChange={(value) =>
                    setFiltros({ ...filtros, bairro: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    {bairros.map((bairro) => (
                      <SelectItem key={bairro} value={bairro}>
                        {bairro}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filtros.periodo}
                  onValueChange={(value) =>
                    setFiltros({ ...filtros, periodo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodos.map((periodo) => (
                      <SelectItem key={periodo} value={periodo}>
                        {periodo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filtros.tipoSinistro}
                  onValueChange={(value) =>
                    setFiltros({ ...filtros, tipoSinistro: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de sinistro" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposSinistro.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setFiltros({
                      bairro: "",
                      periodo: "",
                      tipoSinistro: "",
                      pesquisa: "",
                    })
                  }
                >
                  Limpar Filtros
                </Button>
                <Button className="bg-gradient-primary">Aplicar Filtros</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Mapa de Calor Regional
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="h-[500px] w-full rounded-lg overflow-hidden relative border">
                    <HeatmapMap data={heatmapData} />

                    <div className="absolute top-4 right-4 z-[1000]">
                      <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
                        <h5 className="font-semibold mb-2 text-sm">Legenda</h5>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-3 h-3 rounded bg-red-500/40"></div>
                            <span>Alta incidência</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-3 h-3 rounded bg-yellow-500/40"></div>
                            <span>Média incidência</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-3 h-3 rounded bg-green-500/40"></div>
                            <span>Baixa incidência</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
                    <div className="text-3xl font-bold text-primary">145</div>
                    <div className="text-sm text-muted-foreground">
                      Total de Sinistros
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                      <div className="text-xl font-semibold">5</div>
                      <div className="text-xs text-muted-foreground">
                        Regiões
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg">
                      <div className="text-xl font-semibold">89%</div>
                      <div className="text-xs text-muted-foreground">
                        Precisão
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Exportar Dados
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
