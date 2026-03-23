"use client";

import { useState } from "react";
import { Bot, Sparkles, Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AiAnalysisPanelProps {
  type: "incident" | "inspection";
  data: Record<string, unknown>;
}

export function AiAnalysisPanel({ type, data }: AiAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data }),
      });
      if (!res.ok) throw new Error("Error al analizar");
      const json = await res.json();
      setAnalysis(json.analysis);
    } catch {
      setError("No se pudo conectar con la IA. Verifica tu API key.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-violet-500" />
          <h3 className="text-sm font-semibold text-violet-900">Análisis IA</h3>
        </div>
        {analysis && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-violet-500 hover:text-violet-700"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}
      </div>

      {!analysis && !loading && (
        <div className="text-center py-2">
          <p className="text-xs text-violet-700 mb-3">
            Obtén un análisis detallado de causas raíz, acciones correctivas
            y normativa aplicable generado por IA.
          </p>
          <Button
            size="sm"
            onClick={runAnalysis}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Analizar con IA
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-violet-700 text-sm py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Analizando con Claude AI...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {analysis && expanded && (
        <div className="mt-2">
          <p className="text-sm text-violet-900 whitespace-pre-wrap leading-relaxed">
            {analysis}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={runAnalysis}
            className="mt-3 text-xs text-violet-600 hover:text-violet-800 h-auto py-1"
          >
            <Sparkles className="mr-1 h-3 w-3" />
            Regenerar análisis
          </Button>
        </div>
      )}
    </div>
  );
}
