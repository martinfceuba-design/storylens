import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Shield, Sparkles } from "lucide-react";

interface PlatformStepProps {
  plataforma: 'Power BI' | 'Qlik Sense' | 'Tableau' | 'Looker Studio' | 'Aún no lo sé';
  onChange: (fields: Partial<{ plataforma: 'Power BI' | 'Qlik Sense' | 'Tableau' | 'Looker Studio' | 'Aún no lo sé' }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PlatformStep({
  plataforma,
  onChange,
  onNext,
  onBack
}: PlatformStepProps) {
  const [error, setError] = useState("");

  const platforms = [
    {
      name: "Power BI" as const,
      brand: "Microsoft Power BI",
      color: "border-amber-300 bg-amber-50/20 text-amber-800 focus:ring-amber-400",
      accent: "#f2c811",
      desc: "Excelente para integraciones con el ecosistema Office 365, modelado DAX complejo y reportes corporativos robustos."
    },
    {
      name: "Tableau" as const,
      brand: "Salesforce Tableau",
      color: "border-sky-300 bg-sky-50/20 text-sky-800 focus:ring-sky-400",
      accent: "#e03a3e",
      desc: "Líder en exploración visual avanzada, control detallado de formato e interactividad analítica de alto nivel."
    },
    {
      name: "Looker Studio" as const,
      brand: "Google Looker Studio",
      color: "border-blue-300 bg-blue-50/20 text-blue-800 focus:ring-blue-400",
      accent: "#4285f4",
      desc: "Ideal para conexiones directas con BigQuery, Google Ads/Analytics, rápido despliegue web y reportes ágiles y gratuitos."
    },
    {
      name: "Qlik Sense" as const,
      brand: "Qlik Sense",
      color: "border-emerald-300 bg-emerald-50/20 text-emerald-800 focus:ring-emerald-400",
      accent: "#009845",
      desc: "Poderoso motor asociativo in-memory, excelente para explorar relaciones ocultas entre múltiples fuentes de datos."
    },
    {
      name: "Aún no lo sé" as const,
      brand: "General / Sin plataforma definida",
      color: "border-slate-300 bg-slate-50/20 text-slate-800 focus:ring-slate-400",
      accent: "#64748b",
      desc: "StoryLens formulará recomendaciones de diseño universales basadas en las mejores prácticas de Data Storytelling."
    }
  ];

  const handleNext = () => {
    if (!plataforma) {
      setError("Por favor, seleccioná una opción de plataforma.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div id="step-platform-container" className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Paso 3 de 5 • Medio de Implementación
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          ¿En qué plataforma vas a construir el tablero?
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Las herramientas de Business Intelligence tienen capacidades y limitaciones específicas. Seleccionar una plataforma ayuda a StoryLens a sugerir trucos prácticos y técnicas a medida.
        </p>
      </div>

      {/* Grid of Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((plat) => {
          const isSelected = plataforma === plat.name;
          return (
            <button
              key={plat.name}
              id={`btn-platform-card-${plat.name.replace(/\s+/g, "-")}`}
              type="button"
              onClick={() => {
                onChange({ plataforma: plat.name });
                setError("");
              }}
              className={`text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected 
                  ? "border-brand-600 bg-brand-50/40 shadow-sm ring-2 ring-brand-500/50" 
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{plat.brand}</span>
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: plat.accent }} 
                  />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {plat.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Metodología adaptada</span>
                <span className={`text-xs font-semibold ${isSelected ? "text-brand-600" : "text-slate-500"}`}>
                  {isSelected ? "Seleccionada" : "Seleccionar"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-slate-100">
        <button
          id="btn-back-step-3"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <button
          id="btn-next-step-3"
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
        >
          Siguiente paso <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
