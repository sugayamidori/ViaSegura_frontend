"use client";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@viasegura/components/ui/card";
import { LoginForm } from "@viasegura/modules/auth/components/login-form/index";
import { Activity, ArrowLeft, MapPin } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para home
        </Link>
      </div>
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="relative">
          <MapPin className="h-10 w-10 text-primary" />
          <Activity className="h-5 w-5 text-accent absolute -bottom-1 -right-1" />
        </div>
        <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          ViaSegura
        </span>
      </div>
      <Card className="border-border/50 shadow-elegant w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Entre na sua conta para acessar o dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
