"use client";

import Link from "next/link";
import { Button } from "@viasegura/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/20">
      <div className="text-center max-w-2xl px-6">
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Ops! Página em Construção
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Esta página ainda está sendo construída. Nossa equipe está
            trabalhando duro para trazê-la até você em breve!
          </p>

          <div className="pt-6">
            <Button
              asChild
              className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-3 text-lg"
            >
              <Link href="/">Voltar ao Início</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
