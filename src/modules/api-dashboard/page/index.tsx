"use client";

import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@viasegura/components/ui/card";
import { Button } from "@viasegura/components/ui/button";
import { Badge } from "@viasegura/components/ui/badge";
import Header from "@viasegura/components/header";
import { Progress } from "@viasegura/components/ui/progress";
import { Separator } from "@viasegura/components/ui/separator";
import { Copy, Key, TrendingUp, Clock, Shield, Code } from "lucide-react";

import { toast } from "sonner";

const ApiDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [usage, setUsage] = useState({ current: 0, limit: 50 });
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = () => {
    setTimeout(() => {
      try {
        setApiKey("mock_api_key_live_123abc456def789ghi");
        setUsage({
          current: 22,
          limit: 50,
        });
      } catch (error) {
        console.error("Erro ao carregar dados mockados:", error);
        toast("Erro ao carregar dados", {
          description: "Não foi possível carregar os dados de simulação.",
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    toast("API Key copiada!", {
      description: "Sua chave foi copiada para a área de transferência.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const progressPercentage = (usage.current / usage.limit) * 100;
  const isNearLimit = progressPercentage >= 80;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      <div className="container mx-auto px-6 pt-24 pb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciamento de API</h1>
            <p className="text-muted-foreground">
              Gerencie sua chave de API e monitore o uso
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card className="border-border/50 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Requisições Usadas
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usage.current}</div>
              <p className="text-xs text-muted-foreground">
                de {usage.limit} requisições gratuitas
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isNearLimit ? (
                  <Badge variant="destructive">Atenção</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-500">
                    Ativo
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {isNearLimit
                  ? "Você está próximo do limite"
                  : "Tudo funcionando normalmente"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Gratuito</div>
              <p className="text-xs text-muted-foreground">
                50 requisições/mês
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Sua Chave de API
              </CardTitle>
              <CardDescription>
                Use esta chave para autenticar suas requisições
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted p-3 rounded text-sm font-mono break-all">
                  {apiKey}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyKey}
                  className="shrink-0"
                >
                  <Copy
                    className={`h-4 w-4 ${isCopied ? "text-green-500" : ""}`}
                  />
                </Button>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-sm text-amber-600 dark:text-amber-500">
                  ⚠️ Mantenha sua chave em segredo! Não compartilhe
                  publicamente.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-elegant">
            <CardHeader>
              <CardTitle>Uso da API</CardTitle>
              <CardDescription>
                Acompanhe o consumo de suas requisições
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span className="font-medium">
                    {progressPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={progressPercentage}
                  className={isNearLimit ? "[&>*]:bg-red-500" : ""}
                />
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Você já utilizou <strong>{usage.current}</strong> de{" "}
                  <strong>{usage.limit}</strong> requisições gratuitas este mês.
                </p>
                {isNearLimit && (
                  <p className="text-amber-600 dark:text-amber-500 font-medium">
                    Considere fazer upgrade para continuar usando a API!
                  </p>
                )}
              </div>

              <Button
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                disabled={!isNearLimit}
              >
                Fazer Upgrade
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-elegant lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Exemplo de Uso
              </CardTitle>
              <CardDescription>
                Como fazer uma requisição para nossa API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`// Exemplo com fetch
fetch('https://api.sinistromap.com/v1/data', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApiDashboard;
