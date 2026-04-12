import React from "react";
import { Terminal, ShieldX, Info, ScanSearch, Globe, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface MachineViewProps {
  labMode: "pdf" | "web";
  metadata?: { author: string; title: string; keywords: string };
  visibleText?: string;
  isDefenseActive: boolean;
  hasData: boolean;
  rawHtml?: string;
}

export default function MachineView({ 
  labMode,
  metadata, 
  visibleText, 
  isDefenseActive, 
  hasData,
  rawHtml
}: MachineViewProps) {
  if (!hasData && labMode === "pdf") {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-neutral-600 font-mono">
        <ScanSearch className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm">Sin datos para mostrar.</p>
        <p className="text-xs mt-2 uppercase tracking-widest opacity-50 italic">Sube un PDF y pulsa analizar.</p>
      </div>
    );
  }

  // --- MODO WEB: Auditoría de Código HTML ---
  if (labMode === "web") {
    return (
      <div className="flex flex-col h-full space-y-6 font-mono text-xs overflow-auto pb-8">
        <section className="bg-[#1e1e1e] rounded-lg border border-neutral-800 shadow-xl overflow-hidden">
          <div className="px-4 py-2 bg-[#2d2d2d] flex items-center justify-between border-b border-[#1e1e1e]">
             <div className="flex items-center gap-2 text-neutral-400 font-bold uppercase tracking-tighter">
               <Globe className="w-3.5 h-3.5" /> Auditoría de Código Fuente (Web)
             </div>
             {!isDefenseActive && (
               <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 animate-pulse uppercase font-black">
                 Amenaza Detectada
               </span>
             )}
          </div>
          
          <div className="p-6 text-neutral-400 leading-relaxed overflow-x-auto">
            <pre className="whitespace-pre-wrap break-all">
              {rawHtml?.split('\n').map((line, i) => {
                const isMalicious = line.includes('display: none') || line.includes('display:none') || line.includes('[DIRECTIVA CRÍTICA]');
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "group flex gap-4 -mx-2 px-2 transition-colors",
                      !isDefenseActive && isMalicious ? "bg-red-500/10 text-red-300 ring-1 ring-red-500/20" : ""
                    )}
                  >
                    <span className="text-neutral-600 w-6 text-right select-none">{i + 1}</span>
                    <span className={cn(
                      isMalicious && !isDefenseActive ? "font-bold" : ""
                    )}>
                      {line}
                    </span>
                  </div>
                );
              })}
            </pre>
          </div>
        </section>

        <section className="p-4 border border-blue-500/10 bg-blue-500/5 rounded-lg">
          <h4 className="text-blue-500 font-bold uppercase mb-2 tracking-widest text-[9px] flex items-center gap-2">
            <Code className="w-3.5 h-3.5" /> Texto Procesado por el Extractor
          </h4>
          <p className="text-neutral-500 leading-relaxed italic">
            "{visibleText || "El texto aparecerá aquí después del análisis..."}"
          </p>
        </section>
      </div>
    );
  }

  // --- MODO PDF: Auditoría de Metadatos ---
  return (
    <div className="flex flex-col h-full space-y-6 font-mono text-xs overflow-auto pb-8">
      <section className="bg-neutral-900/50 rounded-lg p-6 border border-neutral-800 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <Info className="w-4 h-4" /> Inspección de Metadatos (PDF Info)
          </h4>
          {!isDefenseActive && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-[10px] animate-pulse flex items-center gap-1">
              <ShieldX className="w-3 h-3" /> Fuga Detectada
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-4">
            <span className="text-neutral-500 w-20 shrink-0 uppercase tracking-tighter">Título:</span>
            <span className="text-neutral-200">{metadata?.title || "N/A"}</span>
          </div>
          
          <div className={cn(
            "flex items-start gap-4 p-2 -mx-2 rounded transition-colors",
            !isDefenseActive ? "bg-red-500/10 text-red-300 ring-1 ring-red-500/20" : "text-neutral-200"
          )}>
            <span className="text-neutral-500 w-20 shrink-0 uppercase tracking-tighter">Autor:</span>
            <span className="font-bold">{metadata?.author || "N/A"}</span>
          </div>

          <div className={cn(
             "flex items-start gap-4 p-2 -mx-2 rounded transition-colors",
             !isDefenseActive ? "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20" : "text-neutral-200"
          )}>
            <span className="text-neutral-500 w-20 shrink-0 uppercase tracking-tighter">Keywords:</span>
            <span className="font-bold italic">{metadata?.keywords || "N/A"}</span>
          </div>
        </div>
      </section>

      <section className="p-4 border border-neutral-800/50 rounded-lg">
        <h4 className="text-neutral-500 font-bold uppercase mb-4 tracking-widest text-[10px] flex items-center gap-2">
          <Terminal className="w-3 h-3" /> Cuerpo del Documento (Snippet)
        </h4>
        <div className="bg-neutral-900 rounded p-4 text-neutral-400 leading-relaxed line-clamp-[12] whitespace-pre-wrap">
          {visibleText || "Extrayendo texto..."}
        </div>
      </section>
    </div>
  );
}
