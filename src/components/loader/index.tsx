import { cn } from "@viasegura/lib/utils";
import { Loader2 } from "lucide-react";

const Loader = ({ className }: React.ComponentProps<"div">) => {
  return (
    <div data-testid="loader-component">
      <Loader2 className={cn("h-16 w-16 animate-spin", className)} />
    </div>
  );
};

const PrimarySpinner = ({ className }: React.ComponentProps<"div">) => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

const PulseLoader = ({ className }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className="absolute h-24 w-24 animate-ping rounded-full bg-primary/20 opacity-75 duration-1000" />
      <div className="absolute h-16 w-16 rounded-full bg-primary/10 animate-pulse" />

      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
        <Loader2 className="h-6 w-6 text-primary-foreground animate-spin" />
      </div>
    </div>
  );
};

export { Loader, PrimarySpinner, PulseLoader };
