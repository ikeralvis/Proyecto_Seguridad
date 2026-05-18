"use client";

import React from "react";
import { ShieldCheck, FileText, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  labMode: "pdf" | "web" | "rag";
  onLabModeChange: (mode: "pdf" | "web" | "rag") => void;
}

export default function Header({ labMode, onLabModeChange }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950 text-neutral-100 flex-none h-[65px]">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-green-500" />
        <h1 className="font-semibold text-lg tracking-tight">IDPI Playground</h1>
      </div>

      <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800">
        <button
          onClick={() => onLabModeChange("pdf")}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all",
            labMode === "pdf" 
              ? "bg-neutral-800 text-white shadow-sm ring-1 ring-neutral-700" 
              : "text-neutral-500 hover:text-neutral-300"
          )}
        >
          <FileText className="w-3.5 h-3.5" />
          Laboratorio PDF
        </button>
        <button
          onClick={() => onLabModeChange("web")}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all",
            labMode === "web" 
              ? "bg-neutral-800 text-white shadow-sm ring-1 ring-neutral-700" 
              : "text-neutral-500 hover:text-neutral-300"
          )}
        >
          <Globe className="w-3.5 h-3.5" />
          Laboratorio Web
        </button>
        <button
          onClick={() => onLabModeChange("rag")}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all",
            labMode === "rag" 
              ? "bg-neutral-800 text-white shadow-sm ring-1 ring-neutral-700" 
              : "text-neutral-500 hover:text-neutral-300"
          )}
        >
          RAG Chat
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm text-neutral-400">
        <span className="bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800 text-[10px] font-bold uppercase tracking-widest text-blue-500">
          V1.2 Stable
        </span>
      </div>
    </header>
  );
}
