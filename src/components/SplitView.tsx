import React from "react";
interface SplitViewProps {
  humanView: React.ReactNode;
  machineView: React.ReactNode;
  consolePanel: React.ReactNode;
  controlPanel: React.ReactNode;
}

export default function SplitView({
  humanView,
  machineView,
  consolePanel,
  controlPanel,
}: SplitViewProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-neutral-950 overflow-hidden">
      {/* Top Split View */}
      <div className="flex flex-1 overflow-hidden border-b border-neutral-800">
        {/* Left Side: Human View */}
        <div className="flex-1 flex flex-col border-r border-neutral-800 bg-neutral-950">
          <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Vista Humana</span>
            <span className="bg-neutral-950 px-2 flex items-center rounded h-5 border border-neutral-800">Navegador</span>
          </div>
          <div className="flex-1 overflow-auto bg-neutral-950 p-6">
            {humanView}
          </div>
        </div>

        {/* Right Side: Machine View */}
        <div className="flex-1 flex flex-col bg-[#1E1E1E]">
          <div className="px-4 py-2 bg-[#2D2D2D] border-b border-[#1E1E1E] text-xs font-medium text-neutral-400 uppercase tracking-wider flex justify-between items-center">
            <span>Vista Máquina (Under the hood)</span>
            <span className="bg-[#1E1E1E] px-2 flex items-center rounded h-5 border border-neutral-700">document.html</span>
          </div>
          <div className="flex-1 overflow-auto p-6 font-mono text-sm text-neutral-300 leading-relaxed">
            {machineView}
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="h-80 flex">
        {/* Left: Console */}
        <div className="flex-1 flex flex-col border-r border-neutral-800">
          <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Consola IA (Respuesta del modelo)
          </div>
          <div className="flex-1 overflow-auto bg-neutral-950 p-4">
            {consolePanel}
          </div>
        </div>
        
        {/* Right: Controls */}
        <div className="w-80 flex flex-col bg-neutral-900">
          <div className="px-4 py-2 border-b border-neutral-800 text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Panel de Control
          </div>
          <div className="flex-1 p-4 flex flex-col items-center justify-center">
            {controlPanel}
          </div>
        </div>
      </div>
    </div>
  );
}
