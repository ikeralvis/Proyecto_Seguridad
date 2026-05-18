import React, { useState } from "react";
import { UploadCloud, CheckCircle2, Globe, Code } from "lucide-react";
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
  const [showSource, setShowSource] = useState(false);

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center h-full text-neutral-200">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold uppercase tracking-[0.2em] text-neutral-100">
          {labMode === "pdf" ? "Laboratorio de Documentos" : "Laboratorio Web"}
        </h2>
        <p className="text-neutral-500 text-xs mt-2">
          {labMode === "pdf" 
            ? "Sube un PDF para analizar inyecciones en metadatos y cuerpo." 
            : "Renderiza la pagina para el usuario y analiza el HTML crudo en el motor."}
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
            "w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all duration-300 shadow-sm",
            file 
              ? "border-green-500/60 bg-green-500/10 ring-2 ring-green-500/10" 
              : "border-neutral-800 bg-neutral-900/70 group-hover:border-blue-500/60 group-hover:bg-blue-500/10"
          )}>
            {file ? (
              <>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <p className="font-semibold text-neutral-100">{file.name}</p>
                <p className="text-xs text-neutral-400 mt-2 font-mono uppercase">
                  {(file.size / 1024).toFixed(1)} KB • PDF Document
                </p>
                <button 
                  className="mt-4 text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-widest"
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
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <UploadCloud className="w-8 h-8 text-neutral-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="font-medium text-neutral-300 text-sm">Arrastra tu PDF aqui o haz clic para abrir</p>
                <p className="text-xs text-neutral-500 mt-2 italic">
                  Solo archivos <span className="font-bold text-neutral-300">.pdf</span>
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 shadow-inner overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                Vista navegador
              </div>
              <button
                onClick={() => setShowSource((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-neutral-800 px-3 py-1 text-[9px] font-bold text-neutral-400 hover:text-neutral-200"
              >
                <Code className="w-3 h-3" />
                {showSource ? "Ocultar HTML" : "Editar HTML"}
              </button>
            </div>
            <div className="p-5 bg-[#f5f1ea] text-neutral-900">
              <div dangerouslySetInnerHTML={{ __html: htmlContent || "" }} />
            </div>
          </div>
          {showSource && (
            <div className="relative">
              <div className="absolute top-4 left-4 text-neutral-500">
                <Code className="w-4 h-4" />
              </div>
              <textarea
                value={htmlContent}
                onChange={(e) => onHtmlChange?.(e.target.value)}
                placeholder="Copia aqui el codigo HTML..."
                className="w-full h-64 bg-neutral-900 border border-neutral-800 rounded-xl p-10 font-mono text-xs text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
              />
            </div>
          )}
          <p className="text-[10px] text-neutral-400 text-center uppercase tracking-widest font-black flex items-center justify-center gap-2">
            <Globe className="w-3 h-3 text-blue-500" />
            Simulador de Web Scraping Activo
          </p>
        </div>
      )}

    </div>
  );
}
