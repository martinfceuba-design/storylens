import React, { useState } from "react";
import { ArrowRight, Sparkles, LayoutGrid, HeartHandshake } from "lucide-react";

interface ObjectiveStepProps {
  tipoDashboard: string;
  tipoDashboardOtro: string;
  decisionPrincipal: string;
  onChange: (fields: Partial<{ tipoDashboard: string; tipoDashboardOtro: string; decisionPrincipal: string }>) => void;
  onNext: () => void;
}

export default function ObjectiveStep({
  tipoDashboard,
  tipoDashboardOtro,
  decisionPrincipal,
  onChange,
  onNext
}: ObjectiveStepProps) {
  const [error, setError] = useState("");

  const dashboardTypes = [
    { name: "Ventas", label: "Ventas y Comercial", desc: "Monitoreo de ingresos, conversión y objetivos comerciales." },
    { name: "Marketing", label: "Marketing y Tráfico", desc: "Análisis de campañas, ROI, leads y comportamiento digital." },
    { name: "Finanzas", label: "Finanzas y Tesorería", desc: "Flujo de caja, rentabilidad, costos y presupuestos corporativos." },
    { name: "Operaciones", label: "Operaciones", desc: "Rendimiento interno, eficiencia de procesos y cuellos de botella." },
    { name: "Logística", label: "Logística y Distribución", desc: "Despacho de stock, tiempos de entrega y costos logísticos." },
    { name: "RRHH", label: "Recursos Humanos (RRHH)", desc: "Rotación, clima, reclutamiento y capacitación interna." },
    { name: "Atención al cliente", label: "Atención al Cliente (CX)", desc: "SLA de soporte, satisfacción (NPS) y resolución de tickets." },
    { name: "Otro", label: "Otro Tipo", desc: "Definí un área personalizada o industria específica de gestión." }
  ];

  const decisionSuggestions = [
    "Detectar oportunidades comerciales de forma oportuna para aumentar la conversión.",
    "Monitorear los KPIs principales de la operación diaria e identificar anomalías.",
    "Comparar el desempeño de rentabilidad entre distintas sucursales, áreas o productos.",
    "Analizar la evolución temporal de los costos para optimizar el presupuesto mensual.",
    "Detectar desvíos críticos o alertas operativas tempranas antes de que impacten al cliente.",
    "Priorizar acciones de gestión inmediata basándose en los productos o servicios de peor rendimiento."
  ];

  const handleNext = () => {
    if (!tipoDashboard) {
      setError("Por favor, seleccioná un tipo de dashboard.");
      return;
    }
    if (tipoDashboard === "Otro" && !tipoDashboardOtro.trim()) {
      setError("Por favor, describí el tipo de dashboard personalizado.");
      return;
    }
    if (!decisionPrincipal.trim()) {
      setError("Por favor, indicá qué decisión estratégica o de gestión facilitará este dashboard.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div id="step-objective-container" className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Paso 1 de 5 • Propósito del Tablero
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          ¿Qué historia necesitamos contar?
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          StoryLens es un mentor metodológico. Para proponerte la mejor arquitectura y visualizaciones, primero necesitamos establecer la meta del dashboard.
        </p>
      </div>

      {/* Part A: Dashboard Type */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-slate-500" /> 1. ¿Qué tipo de dashboard querés diseñar?
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardTypes.map((type) => {
            const isSelected = tipoDashboard === type.name;
            return (
              <button
                key={type.name}
                id={`btn-dashboard-type-${type.name}`}
                type="button"
                onClick={() => {
                  onChange({ tipoDashboard: type.name });
                  setError("");
                }}
                className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? "bg-brand-50 border-brand-500 shadow-sm ring-1 ring-brand-500" 
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="font-semibold text-sm text-slate-900">{type.label}</div>
                <div className="text-xs text-slate-500 mt-1">{type.desc}</div>
              </button>
            );
          })}
        </div>

        {tipoDashboard === "Otro" && (
          <div className="mt-3">
            <input
              id="input-dashboard-type-otro"
              type="text"
              value={tipoDashboardOtro}
              onChange={(e) => onChange({ tipoDashboardOtro: e.target.value })}
              placeholder="Ej: Análisis de Sostenibilidad Ambiental, Tablero de Control de Flota de Camiones..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
            />
          </div>
        )}
      </div>

      {/* Part B: Decision Focus */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <label className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-slate-500" /> 2. ¿Qué decisión debería ayudar a tomar este dashboard?
        </label>
        <p className="text-xs text-slate-500">
          Un buen dashboard responde preguntas específicas para gatillar acciones, no solo muestra métricas desconectadas.
        </p>

        {/* Suggestion Quick Clicks */}
        <div className="flex flex-wrap gap-2">
          {decisionSuggestions.map((suggestion, index) => {
            return (
              <button
                key={index}
                id={`btn-decision-suggestion-${index}`}
                type="button"
                onClick={() => {
                  onChange({ decisionPrincipal: suggestion });
                  setError("");
                }}
                className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-3 py-1.5 transition-colors duration-150 cursor-pointer text-left"
              >
                {suggestion}
              </button>
            );
          })}
        </div>

        <textarea
          id="textarea-decision-principal"
          rows={3}
          value={decisionPrincipal}
          onChange={(e) => {
            onChange({ decisionPrincipal: e.target.value });
            setError("");
          }}
          placeholder="Escribí detalladamente la decisión crítica que este reporte facilitará a su audiencia..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button
          id="btn-next-step-1"
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
        >
          Siguiente paso <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
