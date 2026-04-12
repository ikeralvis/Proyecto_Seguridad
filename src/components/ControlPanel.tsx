import React from "react";
import { Shield, ShieldAlert, Play, RefreshCw, Terminal, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlPanelProps {
  labMode: "pdf" | "web";
  isDefenseActive: boolean;
  onToggle: (val: boolean) => void;
  onAnalyze: () => void;
  isDisabled: boolean;
  isLoading: boolean;
}

export default function ControlPanel({ 
  labMode,
  isDefenseActive, 
  onToggle, 
  onAnalyze, 
  isDisabled, 
  isLoading 
}: ControlPanelProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[240px] h-full justify-between py-6">
      <div className="w-full text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
           {labMode === "pdf" ? <Terminal className="w-3 h-3 text-neutral-500" /> : <Globe className="w-3 h-3 text-neutral-500" />}
           <h3 className="text-neutral-400 font-bold uppercase tracking-widest text-[9px]">
             {labMode === "pdf" ? "Seguridad de Documentos" : "Seguridad Web"}
           </h3>
        </div>
        <p className="text-neutral-500 text-[10px] leading-tight px-4">
          {labMode === "pdf" 
            ? "Filtra metadatos antes del envío." 
            : "Elimina elementos ocultos del DOM."}
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => onToggle(!isDefenseActive)}
          className={cn(
            "relative flex items-center justify-center w-24 h-24 rounded-full border-2 transition-all duration-300 shadow-xl group",
            isDefenseActive 
              ? "bg-green-500/10 border-green-500 text-green-400 shadow-green-500/20" 
              : "bg-red-500/10 border-red-500 text-red-500 shadow-red-500/20"
          )}
        >
          {/* Decorative Ring */}
          <div className={cn(
            "absolute inset-0 rounded-full border border-dashed animate-[spin_15s_linear_infinite] opacity-30",
            isDefenseActive ? "border-green-500" : "border-red-500"
          )} />
          
          <div className="flex flex-col items-center gap-1 z-10">
            {isDefenseActive ? <Shield className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
            <span className="text-[9px] font-black uppercase tracking-tighter mt-1">
              {isDefenseActive ? "Protegido" : "Vulnerable"}
            </span>
          </div>
        </button>
        
        <div className={cn(
          "px-3 py-1 rounded-full text-[9px] font-bold border uppercase tracking-widest",
          isDefenseActive 
            ? "bg-green-950 border-green-500/50 text-green-400"
            : "bg-red-950 border-red-500/50 text-red-400"
        )}>
          {isDefenseActive ? "Guard: ON" : "Guard: OFF"}
        </div>
      </div>

      <button
        onClick={onAnalyze}
        disabled={isDisabled}
        className={cn(
          "w-full py-4 px-6 rounded-xl font-bold uppercase tracking-[0.15em] text-[11px] transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl",
          isDisabled 
            ? "bg-neutral-800 text-neutral-600 grayscale cursor-not-allowed border border-neutral-700" 
            : "bg-[#7C3AED] hover:bg-[#6D28D9] text-white hover:scale-105 active:scale-95 shadow-indigo-500/30 ring-2 ring-indigo-400/20"
        )}
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Analizando...
          </>
        ) : (
          <>
            <Play className="w-3 h-3 fill-current" />
            {labMode === "pdf" ? "Analizar Documento" : "Analizar Web"}
          </>
        )}
      </button>
    </div>
  );
}
