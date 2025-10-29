"use client";

import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";
import { MapPin, Activity, LogOut } from "lucide-react";
import { Button } from "@viasegura/components/ui/button";

import { clearToken } from "@viasegura/utils/auth";
import { PROTECTED_ROUTES } from "@viasegura/constants/routes";

export const Header = () => {
  const route = useRouter();
  const pathname = usePathname();

  const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);

  const handleLogout = () => {
    clearToken();
    route.push("/login");
  };
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href={isProtectedRoute ? "#" : "/"}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <MapPin className="h-8 w-8 text-primary" />
              <Activity className="h-4 w-4 text-accent absolute -bottom-1 -right-1" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ViaSegura
            </span>
          </Link>

          {isProtectedRoute ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          ) : (
            <>
              <nav className="hidden md:flex items-center gap-8">
                <Link
                  href="/"
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  Início
                </Link>
                <Link
                  href="/api-dashboard"
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  API
                </Link>
              </nav>

              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-foreground/80 hover:text-foreground"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                    Registre-se
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
