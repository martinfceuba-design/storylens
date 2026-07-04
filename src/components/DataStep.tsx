import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Shield, Sparkles, FileSpreadsheet, Copy, CheckCircle2 } from "lucide-react";

interface DataStepProps {
  rawDataColumns: string;
  onChange: (fields: Partial<{ rawDataColumns: string }>) => void;
  onAnalyze: () => void;
  onBack: () => void;
}

export default function DataStep({
  rawDataColumns,
  onChange,
  onAnalyze,
  onBack
}: DataStepProps) {
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const dataExamples = [
    {
      id: 1,
      name: "Ventas Farmacéuticas / Retail (Comas)",
      text: "fecha, laboratorio, producto, provincia, unidades, ventas, farmacia, categoria",
      desc: "Ideal para tableros de control comercial de laboratorios o distribuidoras de consumo masivo."
    },
    {
      id: 2,
      name: "Métricas de Suscripciones SaaS (Saltos de línea)",
      text: "fecha_registro\nID_cliente\nplan_suscripcion\nmonto_mensual\npais_cliente\ntickets_soporte\ncalificacion_nps\nchurn",
      desc: "Excelente para analistas enfocados en retención, ingresos recurrentes (MRR) e interacciones de soporte."
    },
    {
      id: 3,
      name: "Gestión de Talento y RRHH (Tabulaciones)",
      text: "codigo_colaborador\tfecha_ingreso\tarea_negocio\tpuesto_trabajo\tevaluacion_desempeño\tsalario_mensual\tcapacitaciones_completadas\testado_activo",
      desc: "Adecuado para tableros de gestión humana, análisis de rotación y planes de carrera."
    }
  ];

  const handleQuickLoad = (text: string, id: number) => {
    onChange({ rawDataColumns: text });
    setCopiedId(id);
    setError("");
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleAnalyze = () => {
    if (!rawDataColumns.trim()) {
      setError("Por favor, ingresá al menos algunos nombres de columnas o pega una estructura de datos de prueba.");
      return;
    }
    setError("");
    onAnalyze();
  };

  return (
    <div id="step-data-container" className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Paso 4 de 5 • Mapeo de Datos
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Compartí la estructura de tus datos
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          StoryLens diseña la arquitectura visual de tu reporte basándose en las variables de tu modelo. No cargues datos confidenciales ni filas completas: solo requerimos los encabezados.
        </p>
      </div>

      {/* Security Banner */}
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
        <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-emerald-950">Privacidad y Seguridad por Diseño</h4>
          <p className="text-xs text-emerald-700 leading-relaxed">
            <strong>StoryLens no necesita datos sensibles ni la base de datos completa.</strong> Compartí únicamente nombres de columnas o una fila de encabezados copiada desde tu planilla Excel o Google Sheets.
          </p>
        </div>
      </div>

      {/* Examples Block */}
      <div className="space-y-3">
        <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold">
          Cargar estructura de prueba de un clic:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {dataExamples.map((ex) => {
            const isLoaded = copiedId === ex.id;
            return (
              <button
                key={ex.id}
                id={`btn-load-example-${ex.id}`}
                type="button"
                onClick={() => handleQuickLoad(ex.text, ex.id)}
                className={`text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-36 ${
                  isLoaded 
                    ? "border-emerald-500 bg-emerald-50/20" 
                    : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/50"
                }`}
              >
                <div>
                  <div className="font-semibold text-xs text-slate-900 flex items-center justify-between">
                    <span>{ex.name}</span>
                    {isLoaded ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    {ex.desc}
                  </p>
                </div>
                <div className="text-[10px] font-mono bg-white/75 border border-slate-200/50 rounded px-1.5 py-1 text-slate-600 overflow-hidden text-ellipsis whitespace-nowrap w-full">
                  {ex.text.replace(/\n/g, ", ")}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Text Area Input */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-slate-500" /> Pegá aquí tus encabezados de columna:
        </label>
        <p className="text-xs text-slate-500 leading-relaxed">
          Podés copiar una fila de encabezados o una columna de nombres de campos directamente desde tu archivo y pegarla abajo. Aceptamos separaciones por comas, punto y coma, tabulaciones o saltos de línea.
        </p>

        <textarea
          id="textarea-data-columns"
          rows={6}
          value={rawDataColumns}
          onChange={(e) => {
            onChange({ rawDataColumns: e.target.value });
            setError("");
          }}
          placeholder="fecha, producto, provincia, unidades, ventas, farmacia, categoria..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-mono placeholder:font-sans"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-slate-100">
        <button
          id="btn-back-step-4"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <button
          id="btn-analyze-structure"
          onClick={handleAnalyze}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
        >
          Analizar estructura <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
