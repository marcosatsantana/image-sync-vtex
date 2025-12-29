import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionBarProps {
  selectedCount: number;
  onUpdate: () => void;
  isUpdating?: boolean;
}

export function FloatingActionBar({ selectedCount, onUpdate, isUpdating = false }: FloatingActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-card border border-border rounded-full shadow-hover px-6 py-4 flex items-center gap-4">
        <div className="text-sm">
          <span className="font-semibold text-primary">{selectedCount}</span>
          <span className="text-muted-foreground ml-1">
            {selectedCount === 1 ? "item selecionado" : "itens selecionados"}
          </span>
        </div>

        <Button
          onClick={onUpdate}
          disabled={isUpdating}
          className="bg-gradient-primary hover:opacity-90 transition-opacity rounded-full disabled:opacity-50"
          size="lg"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Atualizar Selecionados
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
