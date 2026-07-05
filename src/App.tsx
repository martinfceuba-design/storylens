import React, { useState, useEffect } from "react";
import Landing from "./components/Landing";
import ProgressIndicator from "./components/ProgressIndicator";
import ObjectiveStep from "./components/ObjectiveStep";
import AudienceStep from "./components/AudienceStep";
import PlatformStep from "./components/PlatformStep";
import DataStep from "./components/DataStep";
import ValidationStep from "./components/ValidationStep";
import LoadingScreen from "./components/LoadingScreen";
import BlueprintView from "./components/BlueprintView";
import { parseRawColumns } from "./utils/parser";
import { StoryLensSession, StoryLensBlueprint, ColumnInfo } from "./types";
import { BookOpen, Sparkles, AlertCircle, Sun, Moon } from "lucide-react";

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 = Landing
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem("storylens-theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return "light";
  });

  // Automatically scroll to top whenever the user moves between steps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Sync theme class with local state
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("storylens-theme", theme);
    }
  }, [theme]);
  
  // Guided flow state
  const [session, setSession] = useState<StoryLensSession>({
    tipoDashboard: "",
    tipoDashboardOtro: "",
    decisionPrincipal: "",
    audiencia: "",
    audienciaOtro: "",
    nivelDetalle: "",
    plataforma: "Power BI",
    rawDataColumns: "",
    columns: []
  });

  const [blueprint, setBlueprint] = useState<StoryLensBlueprint | null>(null);
  const [apiError, setApiError] = useState<string>("");

  const updateSession = (fields: Partial<StoryLensSession>) => {
    setSession((prev) => ({ ...prev, ...fields }));
  };

  const handleUpdateColumn = (id: string, updatedFields: Partial<ColumnInfo>) => {
    setSession((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => (col.id === id ? { ...col, ...updatedFields } : col))
    }));
  };

  const handleStart = () => {
    setCurrentStep(1);
  };

  // Convert raw columns pasted text into array structure
  const handleAnalyzeDataStructure = () => {
    const parsed = parseRawColumns(session.rawDataColumns);
    updateSession({ columns: parsed });
    setCurrentStep(5);
  };

  // Trigger Gemini Blueprint Generation via fullstack endpoint
  const handleGenerateBlueprint = async () => {
    setCurrentStep(6); // Go to loading screen
    setApiError("");

    try {
      const response = await fetch("/api/blueprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(session)
      });

      if (!response.ok) {
        throw new Error("La solicitud al servidor falló.");
      }

      const data: StoryLensBlueprint = await response.json();
      
      // Enforce artificial delay for architectural animation
      setTimeout(() => {
        setBlueprint(data);
        setCurrentStep(7); // View blueprint
      }, 2500);

    } catch (err) {
      console.error("Error generating blueprint from server, running local client engine fallback:", err);
      
      // High quality client-side fallback generation so the application NEVER crashes
      setTimeout(() => {
        const clientFallback = generateClientFallback(session);
        setBlueprint(clientFallback);
        setCurrentStep(7);
      }, 2500);
    }
  };

  const handleRestart = () => {
    // Reset state for a new design session
    setSession({
      tipoDashboard: "",
      tipoDashboardOtro: "",
      decisionPrincipal: "",
      audiencia: "",
      audienciaOtro: "",
      nivelDetalle: "",
      plataforma: "Power BI",
      rawDataColumns: "",
      columns: []
    });
    setBlueprint(null);
    setApiError("");
    setCurrentStep(0); // Back to landing
  };

  // Safe client-side fallback builder to guarantee robust operation
  const generateClientFallback = (sess: StoryLensSession): StoryLensBlueprint => {
    const dashType = sess.tipoDashboard === "Otro" ? sess.tipoDashboardOtro : sess.tipoDashboard;
    const keyMetric = sess.columns.find(c => c.suggestedRol === "Métrica")?.originalName || "ventas";
    const keyDim = sess.columns.find(c => c.suggestedRol === "Dimensión")?.originalName || "producto";
    const keyTime = sess.columns.find(c => c.suggestedRol === "Dimensión temporal")?.originalName || "fecha";

    return {
      estrategiaComunicacion: {
        problemaNegocio: `El usuario requiere controlar y justificar las variaciones de rendimiento asociadas a ${dashType} para la audiencia.`,
        decisionFacilitar: sess.decisionPrincipal || "Optimizar la rentabilidad de las campañas y operaciones.",
        audiencia: sess.audiencia === "Otro" ? sess.audienciaOtro : sess.audiencia,
        nivelDetalle: sess.nivelDetalle,
        narrativaRecomendada: "Flujo deductivo: Presentar KPIs globales de impacto, luego tendencias evolutivas cruzadas y finalmente una grilla con drill-down detallado para auditar desvíos.",
        mensajesPrincipales: [
          `Identificar qué categorías o registros de ${keyDim} están concentrando el 80% del valor total.`,
          `Evaluar el impacto estacional o fluctuación periódica respecto al campo temporal ${keyTime}.`,
          `Facilitar un filtrado ágil para aislar contingencias operativas regionales o departamentales.`
        ]
      },
      estrategiaDiseno: {
        kpisRecomendados: [
          {
            id: "k-1",
            kpi: `${keyMetric.toUpperCase()} Consolidadas`,
            descripcion: `Mapea el rendimiento general de la variable ${keyMetric} para evaluar metas globales.`,
            columns: [keyMetric],
            justificacion: "Es el indicador monetario/numérico definitivo de la salud del negocio."
          },
          {
            id: "k-2",
            kpi: "Eficiencia de Margen",
            descripcion: "Mide el retorno relativo sobre los recursos invertidos en el período.",
            columns: [keyMetric],
            justificacion: "Aporta contexto de productividad para evitar el sesgo de volumen absoluto."
          }
        ],
        wireframe: {
          layoutType: sess.nivelDetalle.toLowerCase().includes("ejecutiva") ? "executive" : "analytical",
          blocks: [
            {
              id: "b-filt",
              title: "Panel de Selección de Filtros",
              type: "filter",
              x: 1, y: 1, w: 12, h: 1,
              questionAnswered: "¿Cómo puedo restringir el alcance temporal o categórico?",
              columnsUsed: [keyTime],
              whyRecommended: "Ubicación estándar superior para garantizar un punto de partida libre de confusión visual.",
              alternativeDiscarded: "Filtros laterales. Se descartó para dar máximo ancho físico al gráfico de tendencias.",
              storytellingPrinciple: "Ley de Proximidad de la Gestalt: Agrupar los controles en una misma franja ayuda a entenderlos como una única consola."
            },
            {
              id: "b-kpi-1",
              title: `KPI: ${keyMetric.toUpperCase()} acumulados`,
              type: "kpi",
              x: 1, y: 2, w: 6, h: 2,
              questionAnswered: `¿Cuál es el acumulado histórico de ${keyMetric}?`,
              columnsUsed: [keyMetric],
              whyRecommended: "Tarjeta de gran tamaño para anclaje visual primario en la zona superior izquierda.",
              alternativeDiscarded: "Gráfico de tacómetro. Se descartó por saturar espacio con adornos innecesarios.",
              storytellingPrinciple: "Patrón de lectura en F: El ojo asimila los KPIs agregados primero si están arriba a la izquierda."
            },
            {
              id: "b-kpi-2",
              title: "KPI: Indicador de Conversión",
              type: "kpi",
              x: 7, y: 2, w: 6, h: 2,
              questionAnswered: "¿Cómo varió el rendimiento promedio?",
              columnsUsed: [keyMetric],
              whyRecommended: "Tarjeta complementaria para contextualizar el KPI principal.",
              alternativeDiscarded: "Gráfico circular. Se descartó para mantener consistencia de números gigantes de KPI.",
              storytellingPrinciple: "Reducción de Ruido: Simplificar los indicadores secundarios acelera la asimilación."
            },
            {
              id: "b-trend",
              title: `Curva Temporal de ${keyMetric}`,
              type: "chart_area",
              x: 1, y: 4, w: 8, h: 4,
              questionAnswered: `¿Cómo evoluciona la variable ${keyMetric} en relación al tiempo (${keyTime})?`,
              columnsUsed: [keyTime, keyMetric],
              whyRecommended: "Gráfico de área suavizado con gradiente para destacar tendencias estacionales y valles operacionales.",
              alternativeDiscarded: "Gráfico de barras apiladas (sobrecarga el eje temporal si hay demasiados períodos).",
              storytellingPrinciple: "Principio de Continuidad: Las líneas continuas son el medio idóneo para guiar la lectura cronológica."
            },
            {
              id: "b-pie",
              title: `Participación por ${keyDim}`,
              type: "chart_pie",
              x: 9, y: 4, w: 4, h: 4,
              questionAnswered: `¿Cómo se reparte porcentualmente el total de ${keyMetric}?`,
              columnsUsed: [keyDim, keyMetric],
              whyRecommended: "Gráfico de dona de alta definición limitado a 4 categorías clave para evitar saturación visual.",
              alternativeDiscarded: "Gráfico de torta de 15 categorías. Se descartó porque las porciones diminutas son imposibles de leer.",
              storytellingPrinciple: "Ley de Simplicidad Gestalt: El cerebro interpreta relaciones parte-todo a través de círculos limpios divididos."
            },
            {
              id: "b-table",
              title: `Tabla Analítica: Auditoría de ${keyDim}`,
              type: "table",
              x: 1, y: 8, w: 12, h: 4,
              questionAnswered: "¿Cuál es el desglose transaccional detallado?",
              columnsUsed: sess.columns.slice(0, 4).map(c => c.originalName),
              whyRecommended: "Tabla tabular limpia que permite ordenar, contrastar y explorar registros específicos sin contaminar la vista macro.",
              alternativeDiscarded: "Tarjetas modulares individuales. Se descartó para maximizar el espacio de filas compactas.",
              storytellingPrinciple: "Principio de Exploración: El analista requiere pasar de la asimilación rápida (KPIs) a la auditoría exhaustiva (grillas)."
            }
          ]
        },
        visualizacionesSugeridas: [
          {
            visualizacion: "Área Suavizada",
            columns: [keyTime, keyMetric],
            porQue: "Suaviza ruidos en el eje temporal facilitando la visualización del patrón de crecimiento.",
            alternativaDescartada: "Barras sueltas."
          }
        ],
        recomendacionesPlataforma: [
          "Definí una rejilla simétrica limitando el uso de colores chillones.",
          "Establecé títulos conversacionales en cada objeto del reporte (ej: ¿Cuáles son las ventas?).",
          "Evitá agrupar más de 5 gráficos en una sola pestaña."
        ]
      }
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans transition-colors duration-300">
      
      {/* SaaS Application Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={handleRestart}
            className="flex items-center gap-2.5 text-left bg-transparent border-0 cursor-pointer"
          >
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/10 animate-[pulse_3s_infinite]">
              SL
            </div>
            <div>
              <span className="font-extrabold text-brand-950 font-display text-lg tracking-tight block leading-none">
                StoryLens
              </span>
              <span className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-widest mt-0.5 block leading-none">
                Data Storytelling Mentor
              </span>
            </div>
          </button>

          {currentStep > 0 && currentStep < 6 && (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
              <BookOpen className="w-4 h-4 text-brand-500" />
              <span>Metodología de Diseño de Dashboards</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200 flex items-center justify-center bg-transparent"
              aria-label="Toggle Theme"
              title="Cambiar Tema"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-slate-600" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </button>

            {currentStep > 0 && (
              <button
                id="navbar-btn-restart"
                onClick={handleRestart}
                className="text-xs font-semibold text-slate-500 hover:text-brand-600 border border-slate-200 hover:border-brand-200 px-3 py-1.5 rounded-lg transition-colors bg-white cursor-pointer"
              >
                Reiniciar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Multi-step Content Arena */}
      <main className="flex-grow py-8 px-4 md:py-12 relative">
        
        {/* Render Progress timeline for active steps */}
        {currentStep > 0 && currentStep < 6 && (
          <ProgressIndicator currentStep={currentStep} />
        )}

        {/* Dynamic Step Router */}
        <div className="relative">
          {currentStep === 0 && (
            <Landing onStart={handleStart} />
          )}

          {currentStep === 1 && (
            <ObjectiveStep
              tipoDashboard={session.tipoDashboard}
              tipoDashboardOtro={session.tipoDashboardOtro}
              decisionPrincipal={session.decisionPrincipal}
              onChange={updateSession}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <AudienceStep
              audiencia={session.audiencia}
              audienciaOtro={session.audienciaOtro}
              nivelDetalle={session.nivelDetalle}
              onChange={updateSession}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <PlatformStep
              plataforma={session.plataforma}
              onChange={updateSession}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <DataStep
              rawDataColumns={session.rawDataColumns}
              onChange={updateSession}
              onAnalyze={handleAnalyzeDataStructure}
              onBack={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 5 && (
            <ValidationStep
              columns={session.columns}
              onUpdateColumn={handleUpdateColumn}
              onGenerate={handleGenerateBlueprint}
              onBack={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 6 && (
            <LoadingScreen />
          )}

          {currentStep === 7 && blueprint && (
            <BlueprintView 
              blueprint={blueprint} 
              plataforma={session.plataforma} 
              onRestart={handleRestart} 
            />
          )}
        </div>
      </main>

      {/* Corporate Dashboard Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 StoryLens. Todos los derechos reservados. Diseñado bajo metodologías de Storytelling de Datos.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Primero comprender, después visualizar.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
