import React, { useState, useEffect } from "react";
import { 
  FileText, Download, Play, Info, Layers, CheckCircle, 
  ChevronRight, Calendar, Landmark, MapPin, Grid, BarChart3, 
  HelpCircle, ExternalLink, Lightbulb, AlertTriangle, ArrowLeft,
  Sparkles, Sliders, RefreshCw, Layers2, Maximize2, Move, Ruler, ArrowRight
} from "lucide-react";
import { StoryLensBlueprint, BlueprintBlock } from "../types";

interface BlueprintViewProps {
  blueprint: StoryLensBlueprint;
  plataforma: string;
  onRestart: () => void;
}

export default function BlueprintView({ blueprint, plataforma, onRestart }: BlueprintViewProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const { estrategiaComunicacion, estrategiaDiseno } = blueprint;
  const blocks = estrategiaDiseno.wireframe.blocks;

  // Select first block by default
  useEffect(() => {
    if (blocks && blocks.length > 0) {
      setSelectedBlockId(blocks[0].id);
    }
  }, [blocks]);

  const activeBlock = blocks.find(b => b.id === selectedBlockId) || blocks[0];

  const handleExport = () => {
    setIsExporting(true);
    setExportSuccess(false);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
    }, 1800);
  };

  // Extract blocks by semantic type to build a flawless realistic dashboard layout
  const filterBlock = blocks.find(b => b.type === "filter") || blocks[0];
  const kpiBlocks = blocks.filter(b => b.type === "kpi");
  
  // Main charts can be area, line, bar, etc.
  const mainChartBlock = blocks.find(b => b.type === "chart_area" || b.type === "chart_line" || b.type === "chart_bar") || blocks.find(b => b.type !== "filter" && b.type !== "kpi" && b.type !== "table");
  
  // Secondary charts are pie, map, or other non-main chart blocks
  const secondaryBlocks = blocks.filter(b => b.id !== filterBlock?.id && !kpiBlocks.some(kb => kb.id === b.id) && b.id !== mainChartBlock?.id && b.type !== "table");
  
  const tableBlock = blocks.find(b => b.type === "table") || blocks.find(b => b.id === "b-table");

  // Helper to render visual placeholders in the wireframe blocks as beautiful premium vector low-fi blueprints
  const renderSimulatedChart = (block: BlueprintBlock, isSelected: boolean) => {
    const { type, title } = block;
    
    // Highlight states
    const borderStyle = isSelected 
      ? "border-brand-500 bg-brand-50/20 shadow-md ring-2 ring-brand-500/15" 
      : "border-slate-200/90 hover:border-brand-400 hover:shadow-md hover:bg-slate-50/30";

    const commonCardClass = `w-full h-full p-4 rounded-xl border-2 transition-all duration-300 relative group flex flex-col justify-between overflow-hidden cursor-pointer bg-white ${borderStyle}`;

    // Dimensions labels to make it look like an architectural plan/Figma spec
    const dimensionTag = (
      <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[8px] font-mono font-bold text-brand-500 bg-brand-50 border border-brand-200 px-1 py-0.5 rounded pointer-events-none flex items-center gap-0.5">
        <Maximize2 className="w-2 h-2" />
        <span>W:{block.w * 10}% H:{block.h * 60}px</span>
      </div>
    );

    const checkIndicator = isSelected && (
      <div className="absolute bottom-2 right-2 w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-sm shadow-brand-500/20">
        ✓
      </div>
    );

    switch (type) {
      case "filter":
        return (
          <div 
            onClick={() => setSelectedBlockId(block.id)}
            className={`${commonCardClass} py-3 px-4 flex-row items-center gap-3 justify-start min-h-[60px]`}
          >
            {dimensionTag}
            <div className="flex items-center gap-2 border-r border-slate-200 pr-3 mr-1 shrink-0">
              <Sliders className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">Consola</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-600 font-mono w-full">
              <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs hover:border-brand-400 transition-colors flex items-center gap-1.5 font-sans font-medium text-slate-800">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Fecha: Último Año ▼</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs hover:border-brand-400 transition-colors flex items-center gap-1.5 font-sans font-medium text-slate-800">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Categoría: Todos ▼</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs hover:border-brand-400 transition-colors flex items-center gap-1.5 font-sans font-medium text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Ubicación: Principal ▼</span>
              </div>
            </div>
            
            <span className="text-[10px] font-mono bg-brand-100 text-brand-800 font-bold px-2 py-0.5 rounded shrink-0">
              {title}
            </span>
            {checkIndicator}
          </div>
        );

      case "kpi":
        return (
          <div 
            onClick={() => setSelectedBlockId(block.id)}
            className={`${commonCardClass} min-h-[120px]`}
          >
            {dimensionTag}
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block truncate">
                {title}
              </span>
              <span className="text-[8px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded">
                KPI
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl md:text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                $482,500
              </span>
              <span className="text-xs text-emerald-600 font-bold font-mono bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                ▲ 12.4%
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-2 w-full text-[9px] text-slate-400 font-mono">
              <span>Meta: $450K (107%)</span>
              <span className="text-brand-600">vs. año anterior</span>
            </div>
            {checkIndicator}
          </div>
        );

      case "chart_line":
      case "chart_area":
        return (
          <div 
            onClick={() => setSelectedBlockId(block.id)}
            className={`${commonCardClass} min-h-[260px]`}
          >
            {dimensionTag}
            <div className="flex items-center justify-between w-full border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="text-xs font-bold text-slate-900 font-sans">{title}</span>
              </div>
              <span className="text-[8px] font-mono bg-brand-50 border border-brand-200 text-brand-700 px-1.5 py-0.5 rounded uppercase">
                Área de Tendencia
              </span>
            </div>

            {/* Sparkline Visual Drafting Drawing */}
            <div className="relative flex-grow w-full my-4 flex items-center justify-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200 p-2 overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:10px_10px] opacity-10" />
              
              {/* Drafting crosshairs */}
              <div className="absolute left-1/4 top-0 bottom-0 border-l border-brand-500/10 border-dashed" />
              <div className="absolute right-1/3 top-0 bottom-0 border-l border-brand-500/10 border-dashed" />
              <div className="absolute left-0 right-0 top-1/2 border-t border-brand-500/10 border-dashed" />

              <svg className="w-full h-full min-h-[140px]" viewBox="0 0 400 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference grid lines */}
                <line x1="0" y1="35" x2="400" y2="35" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="400" y2="70" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="0" y1="105" x2="400" y2="105" stroke="#e2e8f0" strokeDasharray="3 3" />
                
                {/* Filled Area */}
                <path d="M 0 120 Q 50 40 100 90 T 200 30 T 300 80 T 400 20 L 400 140 L 0 140 Z" fill="url(#areaGrad)" />
                
                {/* Curve line */}
                <path d="M 0 120 Q 50 40 100 90 T 200 30 T 300 80 T 400 20" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                
                {/* Interactive markers */}
                <circle cx="100" cy="90" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                <circle cx="200" cy="30" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                <circle cx="300" cy="80" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                
                {/* Value annotations */}
                <text x="210" y="25" fill="#1e3a8a" fontSize="9" fontFamily="monospace" fontWeight="bold">MAX_VAL: $98K</text>
              </svg>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Ene 2026</span>
              <span>Mar 2026</span>
              <span>May 2026</span>
              <span>Jul 2026</span>
            </div>
            {checkIndicator}
          </div>
        );

      case "chart_bar":
        return (
          <div 
            onClick={() => setSelectedBlockId(block.id)}
            className={`${commonCardClass} min-h-[260px]`}
          >
            {dimensionTag}
            <div className="flex items-center justify-between w-full border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="text-xs font-bold text-slate-900 font-sans">{title}</span>
              </div>
              <span className="text-[8px] font-mono bg-indigo-50 border border-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded uppercase">
                Barras Laterales
              </span>
            </div>

            <div className="relative flex-grow w-full my-4 flex flex-col justify-around bg-slate-50/50 rounded-lg border border-dashed border-slate-200 p-4 min-h-[140px]">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[9px] text-slate-500">
                    <span>Aporte Categoría Alfa</span>
                    <span className="font-bold text-slate-700">75% ($140K)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-brand-600 h-full rounded-full transition-all duration-500" style={{ width: "75%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[9px] text-slate-500">
                    <span>Aporte Categoría Beta</span>
                    <span className="font-bold text-slate-700">55% ($95K)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-brand-500 h-full rounded-full transition-all duration-500" style={{ width: "55%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[9px] text-slate-500">
                    <span>Aporte Categoría Gama</span>
                    <span className="font-bold text-slate-700">35% ($52K)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-brand-400 h-full rounded-full transition-all duration-500" style={{ width: "35%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[9px] text-slate-400 font-mono text-center">
              * Datos ordenados de mayor a menor jerarquía visual
            </div>
            {checkIndicator}
          </div>
        );

      case "chart_pie":
        return (
          <div 
            onClick={() => setSelectedBlockId(block.id)}
            className={`${commonCardClass} min-h-[260px]`}
          >
            {dimensionTag}
            <div className="flex items-center justify-between w-full border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 font-sans block truncate">{title}</span>
              <span className="text-[8px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                DONUT
              </span>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center my-4">
              <div className="flex items-center justify-center gap-4 w-full">
                <svg className="w-24 h-24 transform -rotate-90 filter drop-shadow-sm" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
                  
                  {/* Outer circle layout */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563eb" strokeWidth="4.5" strokeDasharray="50 50" strokeDashoffset="0" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray="30 70" strokeDashoffset="-50" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="20 80" strokeDashoffset="-80" />
                </svg>

                <div className="space-y-1.5 font-mono text-[10px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-600 shrink-0" />
                    <span>50% Cat Principal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>30% Cat Alterna</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span>20% Otros</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono text-center">
              Limitado a 3 variables para evitar fatiga cognitiva.
            </div>
            {checkIndicator}
          </div>
        );

      case "table":
        return (
          <div 
            onClick={() => setSelectedBlockId(block.id)}
            className={`${commonCardClass} min-h-[220px]`}
          >
            {dimensionTag}
            <div className="flex items-center justify-between w-full border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-bold text-slate-900 font-sans">{title}</span>
              </div>
              <span className="text-[8px] font-mono bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">
                AUDITORÍA DETALLADA
              </span>
            </div>

            {/* Grid table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden my-3 text-[11px] font-mono w-full">
              <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200 px-3 py-2 font-bold text-slate-600">
                <span>Entidad Clave</span>
                <span className="text-right">Volumen (KPI)</span>
                <span className="text-right">Margen %</span>
                <span className="text-right">Estado</span>
              </div>
              <div className="divide-y divide-slate-100 bg-white text-slate-700">
                <div className="grid grid-cols-4 px-3 py-2.5 hover:bg-slate-50 transition-colors">
                  <span className="font-semibold text-slate-900">Sucursal Regional Metropolitana</span>
                  <span className="text-right font-bold">$184,200</span>
                  <span className="text-right text-emerald-600 font-bold">42.5%</span>
                  <span className="text-right"><span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-semibold">ESTABLE</span></span>
                </div>
                <div className="grid grid-cols-4 px-3 py-2.5 hover:bg-slate-50 transition-colors">
                  <span className="font-semibold text-slate-900">Sucursal Territorial Norte</span>
                  <span className="text-right font-bold">$125,400</span>
                  <span className="text-right text-emerald-600 font-bold">38.1%</span>
                  <span className="text-right"><span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-semibold">ESTABLE</span></span>
                </div>
                <div className="grid grid-cols-4 px-3 py-2.5 hover:bg-slate-50 transition-colors">
                  <span className="font-semibold text-slate-900">Sucursal Territorial Sur</span>
                  <span className="text-right font-bold">$92,100</span>
                  <span className="text-right text-amber-600 font-bold">29.4%</span>
                  <span className="text-right"><span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[9px] font-semibold">MONITORIZAR</span></span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>* Fila de totales calculada dinámicamente</span>
              <span className="text-brand-600">Siguiente página »</span>
            </div>
            {checkIndicator}
          </div>
        );

      case "map":
        return (
          <div 
            onClick={() => setSelectedBlockId(block.id)}
            className={`${commonCardClass} min-h-[260px]`}
          >
            {dimensionTag}
            <div className="flex items-center justify-between w-full border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 font-sans block truncate">{title}</span>
              <span className="text-[8px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                GEOGRAFÍA
              </span>
            </div>

            <div className="relative flex-grow w-full my-4 bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200 overflow-hidden min-h-[140px]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:10px_10px] opacity-20 pointer-events-none" />
              
              <MapPin className="w-8 h-8 text-brand-600/30 absolute" />
              
              <svg className="w-full h-full min-h-[120px] opacity-10" viewBox="0 0 160 90">
                <path d="M20 20 Q50 40 80 20 T140 60 T160 40 L160 90 L0 90 Z" fill="#3b82f6" />
                <circle cx="80" cy="20" r="4" fill="#3b82f6" />
              </svg>
              
              <div className="absolute bg-white/95 border border-slate-200/80 rounded-md px-2 py-1 flex items-center gap-1.5 text-[9px] font-mono text-slate-800 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping shrink-0" />
                <span>Ubicación Crítica: Metropolitana</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono text-center">
              Recomendado para segmentar rendimientos territoriales.
            </div>
            {checkIndicator}
          </div>
        );

      default:
        return (
          <div 
            onClick={() => setSelectedBlockId(block.id)}
            className={`${commonCardClass} min-h-[160px]`}
          >
            {dimensionTag}
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider truncate block">
              {title}
            </span>
            <div className="flex items-center justify-center h-24 my-2 bg-slate-50 rounded border border-dashed border-slate-200">
              <span className="text-[10px] font-mono text-slate-400">{type.toUpperCase()} Visualizer</span>
            </div>
            <span className="text-[9px] font-mono text-slate-500 block truncate">
              ID: {block.id}
            </span>
            {checkIndicator}
          </div>
        );
    }
  };

  return (
    <div id="blueprint-main-container" className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Blueprint background grid lines for outer layout */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f1f5f9_1.2px,transparent_1.2px),linear-gradient(to_bottom,#f1f5f9_1.2px,transparent_1.2px)] bg-[size:32px_32px] opacity-45 pointer-events-none -z-10" />

      {/* 1. Header with architectural styling */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        {/* Subtle engineering scale bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-[repeating-linear-gradient(90deg,#e2e8f0,#e2e8f0_10px,transparent_10px,transparent_20px)] opacity-60" />
        <div className="absolute top-2 right-4 text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider hidden md:block">
          DOC-REF: STORYLENS-V1-A • SCALE: 1:1
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-brand-600 text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-sm font-mono">
              ★ Blueprint Metodológico Certificado
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display">
              StoryLens Blueprint
            </h1>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              Pautas de composición, storytelling de datos y orden jerárquico cognitivo. Utilizá esta especificación técnica para dar de alta tu dashboard en tu herramienta final de Business Intelligence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="btn-restart-design-top"
              onClick={onRestart}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Diseñar Otro Tablero
            </button>
            
            <button
              id="btn-trigger-export-pdf-top"
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Exportar Blueprint (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* 2. Resumen Ejecutivo (Top Section) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-1 hover:border-slate-300 transition-colors">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Foco de Negocio</span>
          <p className="text-sm font-black text-slate-900 leading-tight">Control y optimización de {estrategiaComunicacion.audiencia}</p>
        </div>
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-1 hover:border-slate-300 transition-colors">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Audiencia Clave</span>
          <p className="text-sm font-black text-slate-900 leading-tight">{estrategiaComunicacion.audiencia}</p>
        </div>
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-1 hover:border-slate-300 transition-colors">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Tipo de Dashboard</span>
          <p className="text-sm font-black text-slate-900 leading-tight">{estrategiaComunicacion.nivelDetalle}</p>
        </div>
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-1 border-brand-500 bg-brand-50/10 hover:bg-brand-50/20 transition-colors">
          <span className="text-[10px] text-brand-600 font-bold uppercase tracking-wider block font-mono">Motor BI Recomendado</span>
          <p className="text-sm font-black text-brand-950 leading-tight flex items-center gap-1">
            <Landmark className="w-4 h-4 text-brand-600" /> {plataforma}
          </p>
        </div>
      </div>

      {/* 3. Core Workspace: Redesigned Wireframe + Right Methodological explanation panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* REDESIGNED Wireframe Area (Col-span 8) - Realistic Figma Canvas layout */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm flex-grow relative overflow-hidden">
            
            {/* Header area inside canvas */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-100 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-slate-400" />
                <h3 className="font-extrabold text-slate-900 text-sm md:text-base">
                  Lienzo de Composición e Interacción
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] bg-slate-100 border border-slate-200 text-slate-600 font-mono px-2.5 py-0.5 rounded font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                Canvas Interactivo
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Este lienzo simula el diseño de tu reporte. <strong>Hacé clic sobre cualquier tarjeta</strong> para conocer su fundamentación metodológica, las variables sugeridas y el principio de la psicología visual que justifica su posición.
            </p>

            {/* Figma-Style Workbench Canvas Frame */}
            <div className="relative bg-slate-100 border-2 border-slate-200 rounded-3xl p-10 md:p-12 overflow-hidden shadow-inner flex flex-col">
              
              {/* Drafting grid overlay inside workbench */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1.2px,transparent_1.2px),linear-gradient(to_bottom,#cbd5e1_1.2px,transparent_1.2px)] bg-[size:16px_16px] opacity-40 pointer-events-none" />
              
              {/* Horizontal / Vertical rulers mimicking professional CAD drawing */}
              <div className="absolute top-0 left-0 right-0 h-5 bg-slate-200/90 border-b border-slate-300 font-mono text-[8px] text-slate-400 flex items-center px-2 justify-between select-none">
                <span>0px</span>
                <span>100px</span>
                <span>200px</span>
                <span>300px</span>
                <span>400px</span>
                <span>500px</span>
                <span>600px</span>
                <span>700px</span>
              </div>
              <div className="absolute top-5 left-0 bottom-0 w-5 bg-slate-200/90 border-r border-slate-300 font-mono text-[8px] text-slate-400 flex flex-col justify-between py-2 items-center select-none">
                <span>0</span>
                <span>100</span>
                <span>200</span>
                <span>300</span>
                <span>400</span>
              </div>

              {/* Real desktop dashboard layout flow with robust sizing and no overlap with rulers */}
              <div className="mt-6 space-y-6 w-full relative z-10 pl-8 pt-8 pr-4 pb-4">
                
                {/* 1. Filter Area */}
                {filterBlock && (
                  <div className="w-full">
                    {renderSimulatedChart(filterBlock, selectedBlockId === filterBlock.id)}
                  </div>
                )}

                {/* 2. KPI Cards - Aligned Side-by-Side as in premium dashboards */}
                {kpiBlocks.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {kpiBlocks.map((block) => (
                      <div key={block.id} className="w-full">
                        {renderSimulatedChart(block, selectedBlockId === block.id)}
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Main Visuals Area + Secondary widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                  {/* Left Main Chart (2 cols wide) */}
                  {mainChartBlock && (
                    <div className="lg:col-span-2 w-full">
                      {renderSimulatedChart(mainChartBlock, selectedBlockId === mainChartBlock.id)}
                    </div>
                  )}

                  {/* Right Secondary Chart (1 col wide) */}
                  <div className="lg:col-span-1 flex flex-col gap-6">
                    {secondaryBlocks.length > 0 ? (
                      secondaryBlocks.map((block) => (
                        <div key={block.id} className="w-full h-full">
                          {renderSimulatedChart(block, selectedBlockId === block.id)}
                        </div>
                      ))
                    ) : (
                      // Fallback dummy secondary block if none exists
                      <div className="w-full h-full bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Contexto Adicional</span>
                        <p className="text-[9px] text-slate-400 mt-1">Habilitado según segmentaciones.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Detailed Data Table (100% width ledger) */}
                {tableBlock && (
                  <div className="w-full">
                    {renderSimulatedChart(tableBlock, selectedBlockId === tableBlock.id)}
                  </div>
                )}

              </div>

            </div>

            {/* Design Spec footer */}
            <div className="mt-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-100 pt-3">
              <span className="flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5" /> Rejilla alineada con Ley de Simetría de la Gestalt
              </span>
              <span>GRID-UNIT: 12 Cols • SPACING: 16px</span>
            </div>

          </div>
        </div>

        {/* Right Explanation Panel (Col-span 4) */}
        <div className="lg:col-span-4 bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 relative">
          
          {/* Subtle side blueprint watermark */}
          <div className="absolute top-2 right-4 text-[10px] font-mono font-bold text-slate-300">
            SPEC_BLOCK
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Info className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-slate-900 text-sm md:text-base">
                Fundamentación Metodológica
              </h3>
            </div>

            {activeBlock ? (
              <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
                {/* Block Header */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-brand-600 font-mono tracking-wider">
                    Elemento Activo del Plano:
                  </span>
                  <h4 className="text-lg font-black text-slate-900 font-display">
                    {activeBlock.title}
                  </h4>
                  <span className="inline-block mt-1 text-xs px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-md font-mono">
                    Tipo de visualización: {activeBlock.type.toUpperCase()}
                  </span>
                </div>

                {/* Question it answers */}
                <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                    ¿Qué pregunta de negocio responde?
                  </span>
                  <p className="text-sm font-semibold text-slate-800 italic leading-relaxed">
                    "{activeBlock.questionAnswered}"
                  </p>
                </div>

                {/* Columns used */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                    Columnas lógicas utilizadas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeBlock.columnsUsed.map((col, idx) => (
                      <span key={idx} className="text-xs font-mono bg-brand-50 text-brand-700 px-2 py-1 rounded border border-brand-100">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Why recommended */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Por qué se recomienda:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeBlock.whyRecommended}
                  </p>
                </div>

                {/* Alternative discarded */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider flex items-center gap-1 text-amber-700">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" /> Alternativa descartada y por qué:
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {activeBlock.alternativeDiscarded}
                  </p>
                </div>

                {/* Gestalt Principle */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-brand-500 shrink-0 animate-pulse" /> Principio de Storytelling:
                  </span>
                  <p className="text-xs text-brand-950 font-medium leading-relaxed bg-brand-50/40 p-3 rounded-lg border border-brand-100/50">
                    {activeBlock.storytellingPrinciple}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm font-mono">
                Hacé clic en cualquier componente del lienzo de la izquierda para desplegar sus especificaciones analíticas.
              </div>
            )}
          </div>

          {/* Quick Note */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 leading-relaxed">
            <strong>Especificación StoryLens:</strong> El plano estructural asegura la simetría visual y de contenido antes de que inviertas tiempo configurando el código o bases en tu software BI final.
          </div>
        </div>
      </div>

      {/* 4. Executive Communication Strategy Detail (Middle bottom section) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Comunicación */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-900 text-sm md:text-base">
              A. Estrategia de Comunicación de Negocio
            </h3>
          </div>

          <div className="space-y-4 text-xs md:text-sm">
            <div className="space-y-1">
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider font-mono">Problema de Negocio de Base:</span>
              <p className="text-slate-700 leading-relaxed">{estrategiaComunicacion.problemaNegocio}</p>
            </div>
            
            <div className="space-y-1">
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider font-mono">Decisión Crítica a Facilitar:</span>
              <p className="text-slate-700 leading-relaxed">{estrategiaComunicacion.decisionFacilitar}</p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider font-mono">Mensajes Estratégicos que Debe Comunicar:</span>
              <ul className="space-y-2">
                {estrategiaComunicacion.mensajesPrincipales.map((msg, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                    <ChevronRight className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    <span>{msg}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Diseño */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BarChart3 className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-900 text-sm md:text-base">
              B. Recomendaciones de KPIs Clave
            </h3>
          </div>

          <div className="space-y-4">
            {estrategiaDiseno.kpisRecomendados.map((kpi, idx) => (
              <div key={kpi.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 hover:border-brand-300 transition-colors">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-950">{kpi.kpi}</h4>
                  <div className="flex gap-1">
                    {kpi.columns.map((col, cidx) => (
                      <span key={cidx} className="text-[10px] font-mono bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{kpi.descripcion}</p>
                <p className="text-[11px] text-brand-700 italic font-medium">Justificación: {kpi.justificacion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Platform Recommendations & Specific visualisations */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-md grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-15 pointer-events-none" />
        
        <div className="md:col-span-1 space-y-4 z-10">
          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-300 font-mono">Pautas para tu Software</span>
          <h3 className="text-xl md:text-2xl font-black font-display leading-tight">
            Guía de Implementación para {plataforma}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hemos calibrado estas recomendaciones en base a la herramienta seleccionada para asegurar máxima compatibilidad de componentes.
          </p>
        </div>

        <div className="md:col-span-2 space-y-3 z-10">
          {estrategiaDiseno.recomendacionesPlataforma.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2.5 bg-slate-950/40 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200">
              <span className="w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. REDESIGNED Premium Blueprint Closing (Part 4) */}
      <div className="bg-brand-950 text-white rounded-3xl p-8 md:p-12 text-center space-y-8 relative overflow-hidden border-2 border-brand-800 shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 pointer-events-none" />
        
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1 bg-brand-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-mono">
            ★ Siguientes Pasos
          </div>
          
          <h2 className="text-2xl md:text-4xl font-black tracking-tight font-display text-white">
            ¿Listo para construir tu Dashboard?
          </h2>
          
          <p className="text-sm text-slate-300 leading-relaxed">
            StoryLens ha completado la arquitectura cognitiva de tu reporte. Podés exportar este entregable como un informe formal PDF para alinear a tu equipo de desarrollo, o iniciar un nuevo plano con diferentes variables de negocio.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 max-w-md mx-auto">
          {/* Main CTA: Export */}
          <button
            id="btn-closing-export-pdf"
            onClick={() => setShowExportModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-extrabold rounded-xl text-sm shadow-lg hover:shadow-brand-500/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Exportar Blueprint a PDF
          </button>

          {/* Secondary CTA: Create another */}
          <button
            id="btn-closing-restart"
            onClick={onRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-transparent hover:bg-white/10 text-slate-100 font-bold rounded-xl text-sm transition-colors cursor-pointer border border-white/20"
          >
            Diseñar Otro Tablero <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-slate-400 font-mono">
          Metodología StoryLens v1.4 • Licencia Corporativa Activa
        </p>
      </div>

      {/* 7. Simulated Export PDF Modal */}
      {showExportModal && (
        <div id="pdf-export-modal" className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-400 animate-pulse" />
                <h3 className="font-bold font-display text-base">Simulación de Exportación - StoryLens</h3>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Simulated letterhead layout */}
            <div className="p-6 space-y-6">
              <p className="text-xs text-slate-500 leading-relaxed">
                A continuación podés previsualizar la carátula y el resumen metodológico estructurado que se descargará como un informe corporativo en formato PDF de alta definición:
              </p>

              {/* Letterhead card */}
              <div className="border border-slate-300 rounded-xl p-6 space-y-6 bg-slate-50 font-sans shadow-inner max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                  <div>
                    <span className="font-bold text-base text-slate-900 tracking-tight">STORYLENS BLUEPRINT</span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5 font-mono">Guía de Especificación Metodológica</p>
                  </div>
                  <span className="text-[10px] bg-brand-100 border border-brand-200 text-brand-700 font-bold px-2 py-0.5 rounded uppercase">
                    Versión MVP
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-700 leading-relaxed font-mono">
                  <div>
                    <strong>Tipo de Dashboard:</strong> {estrategiaComunicacion.problemaNegocio.split(" ")[10] || "General"}
                  </div>
                  <div>
                    <strong>Audiencia Clave:</strong> {estrategiaComunicacion.audiencia}
                  </div>
                  <div>
                    <strong>Nivel de Detalle:</strong> {estrategiaComunicacion.nivelDetalle}
                  </div>
                  <div>
                    <strong>Plataforma de BI:</strong> {plataforma}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                  <h4 className="font-bold text-slate-900">1. Resumen de la Estrategia de Comunicación</h4>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Este tablero facilitará la decisión de: <em>"{estrategiaComunicacion.decisionFacilitar}"</em>. La narrativa del storytelling sigue un orden lógico diseñado para convencer y movilizar a la audiencia clave.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900">2. Estructura de Objetos del Wireframe</h4>
                  <div className="space-y-1.5 font-mono text-[10px] text-slate-600">
                    {blocks.map((b, bIdx) => (
                      <div key={bIdx} className="flex justify-between border-b border-slate-100 py-1">
                        <span>• {b.title} ({b.type.toUpperCase()})</span>
                        <span className="text-slate-400">Pregunta: {b.questionAnswered}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions inside modal */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-xs text-slate-400">Simulación interactiva certificada</span>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    {isExporting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Procesando PDF...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" /> Generar Descarga
                      </>
                    )}
                  </button>
                </div>
              </div>

              {exportSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl leading-relaxed flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>¡Simulación completada con éxito!</strong> El Blueprint metodológico ha sido empaquetado y formateado. En un entorno real, esto descarga el PDF optimizado con las firmas de diseño.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
