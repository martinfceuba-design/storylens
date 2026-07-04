import React from "react";
import { Compass, Users, Cpu, Table, FileSpreadsheet, Layers, HelpCircle, ArrowRight, ShieldCheck, Database } from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  const steps = [
    {
      icon: Compass,
      title: "1. Objetivo del Dashboard",
      desc: "Definir con precisión el tipo de reporte y, lo más importante, qué decisión de negocio crítica debe facilitar.",
      color: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      icon: Users,
      title: "2. Conocer la Audiencia",
      desc: "Identificar los usuarios (directivos, analistas, personal operativo) y el nivel de profundidad de datos requerido.",
      color: "text-indigo-600 bg-indigo-50 border-indigo-100"
    },
    {
      icon: Cpu,
      title: "3. Seleccionar Plataforma",
      desc: "Determinar la herramienta de BI (Power BI, Tableau, Looker Studio, etc.) para personalizar las recomendaciones de diseño.",
      color: "text-amber-600 bg-amber-50 border-amber-100"
    },
    {
      icon: Table,
      title: "4. Estructura de Datos",
      desc: "Declarar únicamente las cabeceras o nombres de campos desde Excel. Sin subir datos sensibles, archivos ni valores reales.",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      icon: ShieldCheck,
      title: "5. Validar Interpretación",
      desc: "Revisar y ajustar el rol sugerido de cada columna (métrica, dimensión, geografía) antes de elaborar el plano final.",
      color: "text-violet-600 bg-violet-50 border-violet-100"
    },
    {
      icon: Layers,
      title: "6. Generar el Blueprint",
      desc: "Obtener un plano arquitectónico con un wireframe de bloques interactivos, justificación técnica y principios de storytelling.",
      color: "text-rose-600 bg-rose-50 border-rose-100"
    }
  ];

  return (
    <div id="landing-container" className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-100 text-brand-700 text-xs font-semibold rounded-full border border-brand-200 uppercase tracking-wider">
          <Database className="w-3.5 h-3.5" /> Mentor en Metodología de Diseño BI
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-950 leading-tight">
          StoryLens
        </h1>
        
        <p className="text-2xl md:text-3xl font-medium text-slate-800 tracking-tight">
          Contá historias con tus datos.
        </p>
        
        <p className="text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
          Un buen dashboard no empieza con un gráfico vacío; empieza entendiendo la historia que tus datos necesitan contar. StoryLens te guía paso a paso en el diseño metodológico de tu tablero y genera un plano arquitectónico argumentado, visual y listo para implementar.
        </p>

        <div className="pt-6">
          <button
            id="btn-create-blueprint"
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            Crear mi Blueprint <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="mt-16 border-t border-slate-200 pt-16">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            La Metodología StoryLens
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            StoryLens actúa como un consultor senior que deconstruye tu modelo mental y de datos para crear un entregable metodológico sólido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                id={`methodology-card-${idx}`}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-start space-y-4"
              >
                <div className={`p-3 rounded-xl border ${step.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-grow">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Principles Section */}
      <div className="mt-16 bg-brand-950 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-radial-gradient from-brand-800/20 to-transparent opacity-50 pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="text-sm uppercase tracking-wider text-brand-200 font-bold">Filosofía StoryLens</h4>
            <h3 className="text-2xl md:text-3xl font-bold font-display">Primero comprender, después visualizar.</h3>
            <p className="text-sm text-slate-300">Un dashboard exitoso descansa sobre una decisión estratégica clara, no sobre la acumulación de métricas aleatorias.</p>
          </div>
          <div className="space-y-3 border-t md:border-t-0 md:border-l border-brand-800 pt-6 md:pt-0 md:pl-8">
            <h4 className="text-sm uppercase tracking-wider text-brand-200 font-bold">Privacidad Absoluta</h4>
            <h3 className="text-2xl md:text-3xl font-bold font-display">Sin datos sensibles.</h3>
            <p className="text-sm text-slate-300">StoryLens no requiere bases de datos completas, archivos reales ni credenciales. Trabajamos puramente con nombres lógicos de columnas.</p>
          </div>
          <div className="space-y-3 border-t md:border-t-0 md:border-l border-brand-800 pt-6 md:pt-0 md:pl-8">
            <h4 className="text-sm uppercase tracking-wider text-brand-200 font-bold">Criterio Profesional</h4>
            <h3 className="text-2xl md:text-3xl font-bold font-display">El analista decide.</h3>
            <p className="text-sm text-slate-300">StoryLens propone y fundamenta metodológicamente, pero te otorga el control total para validar y ajustar el rol e interpretación de cada campo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
