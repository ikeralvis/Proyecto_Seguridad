import React from "react";
import { UploadCloud, FileText, CheckCircle2, Globe, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface HumanViewProps {
  labMode: "pdf" | "web";
  file: File | null;
  onFileChange: (file: File | null) => void;
  htmlContent?: string;
  onHtmlChange?: (val: string) => void;
}

export default function HumanView({ 
  labMode, 
  file, 
  onFileChange, 
  htmlContent, 
  onHtmlChange 
}: HumanViewProps) {
  return (
    <div className="max-w-xl mx-auto flex flex-col items-center justify-center h-full text-neutral-800">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 uppercase tracking-tight">
          {labMode === "pdf" ? "Laboratorio de Documentos" : "Laboratorio Web"}
        </h2>
        <p className="text-neutral-600 text-sm mt-2">
          {labMode === "pdf" 
            ? "Sube un archivo PDF para analizar posibles inyecciones de prompt en metadatos." 
            : "Inserta el código HTML del sitio web que la IA debe analizar y resumir."}
        </p>
      </div>
      
      {labMode === "pdf" ? (
        <div className="w-full relative group">
          <input 
            type="file" 
            accept="application/pdf"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          
          <div className={cn(
            "w-full h-64 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all duration-300 shadow-sm",
            file 
              ? "border-green-500 bg-green-50 ring-4 ring-green-500/10" 
              : "border-neutral-200 bg-neutral-50 group-hover:border-blue-400 group-hover:bg-blue-50/50"
          )}>
            {file ? (
              <>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <p className="font-semibold text-neutral-900">{file.name}</p>
                <p className="text-xs text-neutral-600 mt-2 font-mono uppercase">
                  {(file.size / 1024).toFixed(1)} KB • PDF Document
                </p>
                <button 
                  className="mt-4 text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileChange(null);
                  }}
                >
                  Eliminar archivo
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <UploadCloud className="w-8 h-8 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <p className="font-medium text-neutral-600 text-sm">Arrastra tu PDF aquí o haz clic para abrir</p>
                <p className="text-xs text-neutral-400 mt-2 italic">
                  Solo archivos <span className="font-bold text-neutral-500">.pdf</span>
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <div className="relative">
            <div className="absolute top-4 left-4 text-neutral-400">
              <Code className="w-4 h-4" />
            </div>
            <textarea
              value={htmlContent}
              onChange={(e) => onHtmlChange?.(e.target.value)}
              placeholder="Copia aquí el código HTML..."
              className="w-full h-80 bg-neutral-50 border-2 border-neutral-200 rounded-xl p-10 font-mono text-xs text-neutral-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all resize-none shadow-inner"
            />
          </div>
          <p className="text-[10px] text-neutral-400 text-center uppercase tracking-widest font-black flex items-center justify-center gap-2">
            <Globe className="w-3 h-3 text-blue-500" />
            Simulador de Web Scraping Activo
          </p>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between text-[10px] text-neutral-400 border-t border-neutral-100 pt-6 w-full uppercase tracking-widest font-black">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Análisis de Contenido</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Filtro de Seguridad Activo</span>
        </div>
      </div>
    </div>
  );
}
