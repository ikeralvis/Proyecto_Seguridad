import React, { useState } from "react";
import { Terminal, Bug, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIConsoleProps {
  isLoading: boolean;
  response?: string;
  debugPrompt?: string;
  error?: string;
}

export default function AIConsole({ isLoading, response, debugPrompt, error }: AIConsoleProps) {
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  return (
    <div className="flex flex-col h-full font-mono text-sm overflow-hidden bg-neutral-950">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/50 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-500 text-[10px] uppercase font-bold tracking-widest">
          <Terminal className="w-3 h-3 text-blue-500" />
          <span>Gemini-3-Flash.v1</span>
          {isLoading && <RefreshCw className="w-3 h-3 animate-spin ml-2 text-blue-400" />}
        </div>
        
        {debugPrompt && (
          <button 
            onClick={() => setIsDebugOpen(!isDebugOpen)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ring-1 tracking-tight",
              isDebugOpen 
                ? "bg-amber-500/20 text-amber-400 ring-amber-500/30 shadow-none scale-95" 
                : "bg-neutral-800 text-neutral-400 ring-neutral-700 hover:bg-neutral-700 active:scale-95 shadow-sm"
            )}
          >
            <Bug className="w-3 h-3" />
            {isDebugOpen ? "Cerrar Auditor" : "Auditar Prompt"}
          </button>
        )}
      </div>
      
      {/* 2. Chat / Output Area */}
      <div className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
        {/* Debug Panel Overlay (Slide down) */}
        {isDebugOpen && debugPrompt && (
          <div className="absolute top-0 inset-x-0 bg-neutral-900 border-b border-neutral-800 z-50 p-6 shadow-2xl animate-[slideDown_0.2s_ease-out]">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-[10px] font-black uppercase tracking-tighter text-amber-500 flex items-center gap-2">
                <Bug className="w-3 h-3" /> Prompt Crudo Enviado al LLM
              </h5>
              <span className="text-[8px] text-neutral-600 italic">IDPI Playground Auditor v1.0</span>
            </div>
            <pre className="text-xs text-neutral-400 bg-neutral-950 p-6 rounded-lg border border-neutral-800 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto font-mono ring-1 ring-amber-500/10">
              {debugPrompt}
            </pre>
            <div className="mt-4 text-[9px] text-amber-500/60 leading-tight italic">
              * Nota: Los bloques de metadatos ausentes indican que la sanitización funcionó con éxito.
            </div>
          </div>
        )}

        {/* AI Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <Terminal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            </div>
            <p className="text-xs uppercase tracking-widest font-bold text-blue-500 animate-pulse">Analizando Documento...</p>
          </div>
        )}

        {/* AI Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl flex items-start gap-4 animate-[bounceIn_0.4s_ease-out]">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div className="space-y-1">
              <h6 className="font-bold text-red-500 uppercase tracking-tighter text-xs">Error en el análisis</h6>
              <p className="text-sm text-red-300 font-medium leading-relaxed">{error}</p>
              <div className="text-[10px] text-red-600 mt-4 bg-red-950 rounded p-2 italic break-all underline-offset-4 decoration-red-900/50">
                Respuesta del servidor: {error.includes("Not Found") ? "Modelo de IA no disponible en tu región/cuenta." : "Error interno de servidor o PDF inválido."}
              </div>
            </div>
          </div>
        )}

        {/* AI Success Content */}
        {!isLoading && !error && response && (
          <div className="flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-[10px] font-black uppercase text-neutral-400 tracking-tighter">Respuesta Assistant (Deep Research Mode)</span>
            </div>
            <div className="pl-11 leading-relaxed text-neutral-100 text-lg font-medium whitespace-pre-wrap selection:bg-blue-500/30">
              {response}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && !response && (
          <div className="flex flex-col items-center justify-center h-full text-neutral-700 opacity-20">
            <Terminal className="w-16 h-16 mb-4" />
            <p className="uppercase tracking-[0.2em] text-xs font-black italic">Sin actividad registrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
