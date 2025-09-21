import { cn } from "@viasegura/lib/utils";
import { Loader2 } from "lucide-react";

export const Loader = ({ className }: { className?: string }) => {
  return (
    <div data-testid="loader-component">
      <Loader2 className={cn("h-16 w-16 animate-spin", className)} />
    </div>
  );
};
