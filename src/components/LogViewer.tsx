import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface LogMessage {
  type: 'info' | 'success' | 'error' | 'done';
  message: string;
  details?: any;
  timestamp: string;
}

interface LogViewerProps {
  logs: LogMessage[];
  className?: string;
}

export function LogViewer({ logs, className }: LogViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [logs]);

  return (
    <div className={cn("border rounded-md bg-zinc-950 p-4 font-mono text-xs", className)}>
      <ScrollArea className="h-[300px] w-full" ref={scrollRef}>
        <div className="flex flex-col gap-1.5">
          {logs.length === 0 && (
            <span className="text-zinc-500 italic">Aguardando início do processo...</span>
          )}
          {logs.map((log, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="text-zinc-500 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <div className="flex flex-col gap-1">
                <span className={cn(
                  "break-all",
                  log.type === 'info' && "text-blue-400",
                  log.type === 'success' && "text-green-400",
                  log.type === 'error' && "text-red-400 font-bold",
                  log.type === 'done' && "text-purple-400 font-bold"
                )}>
                  {log.type === 'success' && "✓ "}
                  {log.type === 'error' && "✕ "}
                  {log.message}
                </span>
                {log.details && (
                  <pre className="text-zinc-600 text-[10px] overflow-x-auto bg-zinc-900/50 p-1 rounded">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
