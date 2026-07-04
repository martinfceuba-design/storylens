import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Users, Eye, Sparkles } from "lucide-react";

interface AudienceStepProps {
  audiencia: string;
  audienciaOtro: string;
  nivelDetalle: string;
  onChange: (fields: Partial<{ audiencia: string; audienciaOtro: string; nivelDetalle: string }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AudienceStep({
  audiencia,
  audienciaOtro,
  nivelDetalle,
  onChange,
  onNext,
  onBack
}: AudienceStepProps) {
  const [error, setError] = useState("");

  const audiences = [
    { name: "Dirección o comité ejecutivo", label: "Dirección / Comité Ejecutivo", desc: "Necesita foco estratégico, metas corporativas y lectura en 10 segundos." },
    { name: "Gerencia de área", label: "Gerencia de Área", desc: "Monitoreo de metas mensuales, presupuestos y desvíos tácticos." },
    { name: "Equipo operativo", label: "Equipo Operativo", desc: "Alertas inmediatas, estado de actividades y listados diarios de acción." },
    { name: "Equipo comercial", label: "Equipo Comercial", desc: "Cumplimiento de cuotas individuales, clientes clave y conversión." },
    { name: "Analistas internos", label: "Analistas Internos / BI", desc: "Requiere exploración flexible de múltiples variables cruzadas." },
    { name: "Cliente externo", label: "Clientes Externos", desc: "Reportes interactivos públicos o privados, foco en transparencia y claridad." },
    { name: "Otro", label: "Otro Perfil", desc: "Definí una audiencia personalizada para tu entrega de diseño." }
  ];

  const detailLevels = [
    {
      name: "Vista ejecutiva y sintética",
      label: "Vista Ejecutiva y Sintética",
      desc: "Indicadores altamente agregados, foco absoluto en variaciones anuales/mensuales y alertas críticas sin tablas saturadas."
    },
    {
      name: "Vista de gestión con indicadores principales",
      label: "Vista de Gestión (Táctica)",
      desc: "Gráficos de evolución temporal, rankings de productos o canales y apertura de desvíos por sucursal o equipo."
    },
    {
      name: "Vista operativa con mayor detalle",
      label: "Vista Operativa (Detallada)",
      desc: "Métricas en tiempo casi real, listado de entregas o reclamos pendientes, y filtros lógicos por estado de trámite."
    },
    {
      name: "Vista analítica para explorar información",
      label: "Vista Analítica / Exploración",
      desc: "Grandes tablas matriciales, diagramas de dispersión, múltiples segmentadores y capacidad de drill-down profundo."
    }
  ];

  const handleNext = () => {
    if (!audiencia) {
      setError("Por favor, seleccioná la audiencia que utilizará el dashboard.");
      return;
    }
    if (audiencia === "Otro" && !audienciaOtro.trim()) {
      setError("Por favor, describí la audiencia personalizada.");
      return;
    }
    if (!nivelDetalle) {
      setError("Por favor, seleccioná el nivel de detalle requerido.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div id="step-audience-container" className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Paso 2 de 5 • Audiencia Clave
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          ¿Para quién estamos diseñando?
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          El lenguaje visual cambia según la audiencia. Un directivo necesita síntesis y respuestas inmediatas; un analista requiere autonomía técnica.
        </p>
      </div>

      {/* Part A: Who */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-500" /> 1. ¿Quién va a usar este dashboard de manera principal?
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {audiences.map((aud) => {
            const isSelected = audiencia === aud.name;
            return (
              <button
                key={aud.name}
                id={`btn-audience-${aud.name}`}
                type="button"
                onClick={() => {
                  onChange({ audiencia: aud.name });
                  setError("");
                }}
                className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? "bg-brand-50 border-brand-500 shadow-sm ring-1 ring-brand-500" 
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="font-semibold text-sm text-slate-900">{aud.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{aud.desc}</div>
              </button>
            );
          })}
        </div>

        {audiencia === "Otro" && (
          <div className="mt-3">
            <input
              id="input-audience-otro"
              type="text"
              value={audienciaOtro}
              onChange={(e) => onChange({ audienciaOtro: e.target.value })}
              placeholder="Ej: Auditores Gubernamentales, Pacientes Médicos, Proveedores Mayoristas..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
            />
          </div>
        )}
      </div>

      {/* Part B: Detail Level */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <label className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Eye className="w-4 h-4 text-slate-500" /> 2. ¿Qué nivel de detalle necesita esa audiencia?
        </label>
        
        <div className="space-y-3">
          {detailLevels.map((lvl) => {
            const isSelected = nivelDetalle === lvl.name;
            return (
              <button
                key={lvl.name}
                id={`btn-detail-level-${lvl.name}`}
                type="button"
                onClick={() => {
                  onChange({ nivelDetalle: lvl.name });
                  setError("");
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 cursor-pointer ${
                  isSelected 
                    ? "bg-brand-50 border-brand-500 shadow-sm ring-1 ring-brand-500" 
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className={`mt-1.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  isSelected ? "border-brand-600 bg-brand-600" : "border-slate-300 bg-white"
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900">{lvl.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{lvl.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-slate-100">
        <button
          id="btn-back-step-2"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <button
          id="btn-next-step-2"
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
        >
          Siguiente paso <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
