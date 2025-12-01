import { useState, useEffect } from "react";
import { Eye, Palette } from "lucide-react";
import { Button } from "@viasegura/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@viasegura/components/ui/dropdown-menu";

type ColorBlindMode = "classico" | "protan" | "tritan" | "achrom";

const colorBlindModes = {
  classico: { label: "Clássico", class: "" },
  protan: { label: "Protanopia/Deuteranopia", class: "colorblind-protan" },
  tritan: { label: "Tritanopia", class: "colorblind-tritan" },
  achrom: { label: "Alto Contraste", class: "colorblind-achrom" },
};

export const ColorBlindnessToggle = () => {
  const [mode, setMode] = useState<ColorBlindMode>("classico");

  const applyMode = (newMode: ColorBlindMode) => {
    const root = document.documentElement;

    Object.values(colorBlindModes).forEach(({ class: className }) => {
      if (className) root.classList.remove(className);
    });

    if (colorBlindModes[newMode].class) {
      root.classList.add(colorBlindModes[newMode].class);
    }
  };

  const handleModeChange = (newMode: ColorBlindMode) => {
    setMode(newMode);
    applyMode(newMode);
    localStorage.setItem("colorblind-mode", newMode);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("colorblind-mode") as ColorBlindMode;
    if (savedMode && colorBlindModes[savedMode]) {
      setMode(savedMode);
      applyMode(savedMode);
    }
  }, []);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Alternar modo de acessibilidade visual"
        >
          <Eye className="h-5 w-5" />
          {mode !== "classico" && (
            <Palette className="absolute bottom-0 right-0 h-3 w-3 text-accent" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Acessibilidade</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(colorBlindModes).map(([key, { label }]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleModeChange(key as ColorBlindMode)}
            className={mode === key ? "bg-accent text-accent-foreground" : ""}
          >
            {label}
            {mode === key}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
