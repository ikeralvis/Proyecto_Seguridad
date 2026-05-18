"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Send,
  Bug,
  Layers,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type DebugChunk = {
  score: number;
  docName: string;
  text: string;
};

type DebugInfo = {
  question: string;
  retrievedChunks: DebugChunk[];
  prompt: string;
};

export default function RagLab() {
  const [files, setFiles] = useState<File[]>([]);
  const [ingestInfo, setIngestInfo] = useState<string | null>(null);
  const [isIngesting, setIsIngesting] = useState(false);
  const [defenseMode, setDefenseMode] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<DebugInfo | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const hasDocs = useMemo(() => files.length > 0, [files]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) {
      setFiles([]);
      return;
    }
    setFiles(Array.from(fileList));
  };

  const handleIngest = async () => {
    if (!files.length) return;

    setIsIngesting(true);
    setIngestInfo(null);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/rag-chat", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Error indexando documentos");
      }

      const summary = `Indexados ${data.addedChunks} chunks en ${data.ingestedDocuments.length} documentos.`;
      setIngestInfo(summary);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error durante la ingesta";
      setError(message);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleSend = async () => {
    const question = input.trim();
    if (!question || isSending) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch("/api/rag-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, defenseMode }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Error consultando el modelo");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      setDebug(data.debug || null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error inesperado en el chat";
      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-neutral-950">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">RAG Lab</p>
            <h2 className="text-lg font-semibold text-neutral-100">RAG Chat Vulnerable</h2>
          </div>
        </div>
        <button
          onClick={() => setDefenseMode((prev) => !prev)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]",
            defenseMode
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/40 bg-red-500/10 text-red-300"
          )}
        >
          {defenseMode ? (
            <ShieldCheck className="h-3.5 w-3.5" />
          ) : (
            <ShieldAlert className="h-3.5 w-3.5" />
          )}
          Defense: {defenseMode ? "ON" : "OFF"}
        </button>
      </div>

      <div className="flex-1 grid gap-6 px-6 py-6 lg:grid-cols-[320px_1fr_360px] overflow-hidden">
        <section className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-300">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Document Upload</h3>
              <p className="text-xs text-neutral-400">PDF, TXT o MD para la base vectorial</p>
            </div>
          </div>

          <label className="group flex h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-neutral-700/70 bg-neutral-950/60 text-center text-sm text-neutral-400 transition hover:border-emerald-500/50 hover:bg-emerald-500/5">
            <input
              type="file"
              accept=".pdf,.txt,.md"
              multiple
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
            />
            <FileText className="h-8 w-8 text-neutral-500 group-hover:text-emerald-400" />
            <div>
              <p className="font-semibold text-neutral-200">Arrastra o selecciona documentos</p>
              <p className="text-xs text-neutral-500">El contenido se indexa sin sanitizar</p>
            </div>
          </label>

          <div className="space-y-2 text-xs text-neutral-400 overflow-auto">
            {files.length ? (
              files.map((file) => (
                <div key={file.name} className="flex items-center justify-between">
                  <span className="truncate">{file.name}</span>
                  <span className="text-neutral-500">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              ))
            ) : (
              <p className="text-neutral-500">No hay documentos cargados.</p>
            )}
          </div>

          <button
            disabled={!hasDocs || isIngesting}
            onClick={handleIngest}
            className={cn(
              "mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em]",
              !hasDocs || isIngesting
                ? "cursor-not-allowed border border-neutral-800 bg-neutral-900 text-neutral-600"
                : "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
            )}
          >
            <Layers className="h-4 w-4" />
            {isIngesting ? "Indexando..." : "Indexar documentos"}
          </button>

          {ingestInfo && <p className="text-xs text-emerald-300">{ingestInfo}</p>}
        </section>

        <section className="flex min-h-[70vh] flex-col rounded-2xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
          <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-sky-300" />
              <h3 className="text-lg font-semibold">Chat RAG</h3>
            </div>
            <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-sky-200">
              Vulnerable
            </span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
            {messages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-800/70 bg-neutral-950/60 p-6 text-sm text-neutral-500">
                <p className="text-neutral-300">Empieza subiendo documentos y lanza una pregunta.</p>
                <p className="text-xs text-neutral-500">La respuesta usa contexto recuperado sin filtrado.</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    message.role === "user"
                      ? "ml-auto bg-sky-500/15 text-sky-100"
                      : "mr-auto bg-neutral-950/70 text-neutral-200"
                  )}
                >
                  {message.content}
                </div>
              ))
            )}
            {isSending && (
              <div className="mr-auto max-w-[85%] rounded-2xl bg-neutral-950/70 px-4 py-3 text-sm text-neutral-400">
                Escribiendo...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-neutral-800 px-5 py-4">
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Pregunta algo sobre los documentos..."
                className="min-h-[56px] flex-1 resize-none rounded-xl border border-neutral-800/70 bg-neutral-950/60 px-4 py-3 text-sm text-neutral-200 focus:border-sky-500/60 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
              <button
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl border",
                  isSending || !input.trim()
                    ? "cursor-not-allowed border-neutral-800 bg-neutral-900 text-neutral-600"
                    : "border-sky-500/50 bg-sky-500/20 text-sky-100 hover:bg-sky-500/30"
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-500/10 p-2 text-red-300">
              <Bug className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Debug Panel</h3>
              <p className="text-xs text-neutral-400">RAG traces y prompt final</p>
            </div>
          </div>

          {!debug ? (
            <div className="rounded-xl border border-dashed border-neutral-800/70 bg-neutral-950/60 p-4 text-xs text-neutral-500">
              No hay trazas aun. Ejecuta una consulta para ver detalles.
            </div>
          ) : (
            <div className="space-y-4 text-xs text-neutral-300 overflow-auto">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Pregunta</p>
                <p className="mt-1 rounded-lg bg-neutral-950/70 px-3 py-2">{debug.question}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Chunks recuperados</p>
                <div className="mt-2 space-y-2">
                  {debug.retrievedChunks.map((chunk, index) => (
                    <div key={`${chunk.docName}-${index}`} className="rounded-lg border border-neutral-800/70 bg-neutral-950/70 p-3">
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>{chunk.docName}</span>
                        <span>score {chunk.score.toFixed(3)}</span>
                      </div>
                      <p className="mt-2 line-clamp-5 text-neutral-200">{chunk.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Prompt final</p>
                <pre className="mt-2 max-h-64 overflow-auto rounded-lg border border-neutral-800/70 bg-neutral-950/70 p-3 text-[11px] text-neutral-200 font-mono">
                  {debug.prompt}
                </pre>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
