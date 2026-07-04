import React, { useState, useEffect } from "react";
import { Sparkles, Hammer, Cpu, Layout, CheckCircle, Flame } from "lucide-react";

export default function LoadingScreen() {
  const [step, setStep] = useState(0);
  const [strikeCount, setStrikeCount] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const statusMessages = [
    "Understanding business goals...",
    "Analyzing audience...",
    "Organizing KPIs...",
    "Designing dashboard architecture...",
    "Applying Data Storytelling principles...",
    "Generating StoryLens Blueprint..."
  ];

  // Advance step over time
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep((prev) => {
        if (prev < statusMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2800);

    return () => clearInterval(stepInterval);
  }, []);

  // Sync hammer hits and spawn sparkly particle debris in the dashboard grid area
  useEffect(() => {
    const hitInterval = setInterval(() => {
      setStrikeCount((prev) => prev + 1);
      
      // Spawn sparkly colorful particles around the hit zone
      const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
      const newParticles = Array.from({ length: 5 }).map((_, i) => ({
        id: Date.now() + i,
        x: 40 + (Math.random() - 0.5) * 60,
        y: 40 + (Math.random() - 0.5) * 60,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));

      setParticles(newParticles);

      // Clean up particles
      setTimeout(() => {
        setParticles([]);
      }, 800);

    }, 800); // swings every 800ms

    return () => clearInterval(hitInterval);
  }, []);

  return (
    <div id="loading-screen-container" className="max-w-3xl mx-auto py-12 px-6 flex flex-col items-center justify-center text-center space-y-8 bg-slate-900 text-white border border-slate-800 rounded-3xl shadow-xl relative overflow-hidden">
      
      {/* Blueprint grid layout in background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />
      
      {/* Decorative neon ambient glows */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Animation Centerpiece */}
      <div className="relative w-full max-w-lg bg-slate-950/80 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-around gap-6 z-10 backdrop-blur-sm">
        
        {/* Figma styled Character side */}
        <div className="relative flex flex-col items-center justify-center space-y-4 md:w-1/2">
          
          {/* Sparkle banner */}
          <div className="absolute -top-4 bg-gradient-to-r from-brand-500 to-indigo-600 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-brand-500/20 z-20">
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin" /> IA Diseñando
          </div>

          {/* Premium Vector Illustration Container */}
          <div className="relative w-44 h-44 md:w-48 md:h-48 flex items-center justify-center bg-slate-900 border-2 border-slate-800 rounded-2xl shadow-2xl overflow-visible">
            
            {/* Ambient radiating rings */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute w-[110%] h-[110%] border border-dashed border-slate-800/30 rounded-full animate-[spin_40s_linear_infinite] pointer-events-none" />
            <div className="absolute w-[125%] h-[125%] border border-slate-800/20 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none" />

            {/* Premium Isometric/Modern SaaS SVG Illustration */}
            <svg className="w-full h-full p-2 relative z-10" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="avatarGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="panelGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="neonGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>

              {/* Background isometric grids */}
              <g opacity="0.25">
                <line x1="10" y1="90" x2="170" y2="90" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="90" y1="10" x2="90" y2="170" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="90" cy="90" r="70" stroke="#334155" strokeWidth="1" />
                <circle cx="90" cy="90" r="45" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
              </g>

              {/* Character: Modern Creator/Architect */}
              {/* Torso/Hoodie */}
              <path d="M50 145 C50 115, 130 115, 130 145 Z" fill="url(#avatarGrad)" />
              <path d="M72 110 L108 110 L102 125 L78 125 Z" fill="#312e81" /> {/* Hoodie collar */}
              
              {/* Head */}
              <rect x="68" y="55" width="44" height="46" rx="14" fill="#fbcfe8" /> {/* Face skin */}
              <path d="M68 55 C68 40, 112 40, 112 55 Z" fill="#1e1b4b" /> {/* Sleek hair */}
              <rect x="65" y="48" width="50" height="10" rx="4" fill="#1e1b4b" /> {/* Hair fringe */}
              <rect x="100" y="42" width="18" height="18" rx="4" fill="#6366f1" opacity="0.3" /> {/* Bun hair tie */}

              {/* Minimal designer glasses */}
              <circle cx="80" cy="74" r="9" stroke="#ffffff" strokeWidth="2" fill="#1e293b" fillOpacity="0.4" />
              <circle cx="100" cy="74" r="9" stroke="#ffffff" strokeWidth="2" fill="#1e293b" fillOpacity="0.4" />
              <line x1="89" y1="74" x2="91" y2="74" stroke="#ffffff" strokeWidth="2" />
              <line x1="72" y1="70" x2="70" y2="72" stroke="#ffffff" strokeWidth="1.5" />

              {/* Focused eyes */}
              <circle cx="80" cy="74" r="2" fill="#818cf8" />
              <circle cx="100" cy="74" r="2" fill="#818cf8" />

              {/* Gentle smile of confidence */}
              <path d="M86 88 Q90 92 94 88" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

              {/* Sleek over-ear designer headphones */}
              <rect x="61" y="65" width="7" height="18" rx="3.5" fill="#10b981" />
              <rect x="112" y="65" width="7" height="18" rx="3.5" fill="#10b981" />
              <path d="M65 65 C65 48, 115 48, 115 65" stroke="#10b981" strokeWidth="3" fill="none" />

              {/* Floating holographic UI elements */}
              {/* Left Widget: Floating Bar Chart Panel */}
              <g className="animate-bounce" style={{ animationDuration: "3s" }}>
                <rect x="12" y="48" width="36" height="28" rx="6" fill="url(#panelGrad)" stroke="#475569" strokeWidth="1.2" />
                <rect x="18" y="66" width="5" height="6" rx="1" fill="#3b82f6" />
                <rect x="25" y="60" width="5" height="12" rx="1" fill="#10b981" />
                <rect x="32" y="55" width="5" height="17" rx="1" fill="#8b5cf6" />
                <line x1="16" y1="69" x2="44" y2="69" stroke="#475569" strokeWidth="1" />
              </g>

              {/* Right Widget: Floating KPI metric card */}
              <g className="animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
                <rect x="132" y="58" width="38" height="26" rx="6" fill="url(#panelGrad)" stroke="#475569" strokeWidth="1.2" />
                <circle cx="142" cy="67" r="3" fill="#ec4899" />
                <rect x="149" y="65" width="14" height="4" rx="1" fill="#cbd5e1" opacity="0.6" />
                <rect x="139" y="73" width="24" height="4" rx="1" fill="#10b981" />
              </g>

              {/* Center Tool: Active Figma-style design cursor drawing a wireframe */}
              <g 
                style={{
                  transform: `translate(${strikeCount % 2 === 0 ? "5px, -3px" : "-4px, 4px"})`,
                  transition: "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)"
                }}
              >
                {/* Vector pen path line */}
                <path d="M 40 110 Q 90 125 140 100" fill="none" stroke="url(#neonGlow)" strokeWidth="2.5" strokeDasharray="3 3" />
                
                {/* Active Stylus/Pen Tool */}
                <g transform="translate(95, 115) rotate(-35)">
                  {/* Pen body */}
                  <path d="M -2 -25 L 2 -25 L 3 -5 L 0 5 L -3 -5 Z" fill="#64748b" />
                  <path d="M -3 -5 L 3 -5 L 0 5 Z" fill="#cbd5e1" />
                  <circle cx="0" cy="5" r="3" fill="#10b981" className="animate-ping" />
                  <circle cx="0" cy="5" r="1.5" fill="#ffffff" />
                </g>

                {/* Classic Figma Cursor with Designer tag */}
                <g transform="translate(115, 95)">
                  <path d="M0 0 L14 5 L8 8 L5 14 Z" fill="#6366f1" stroke="#ffffff" strokeWidth="1" />
                  <rect x="10" y="10" width="46" height="13" rx="3" fill="#6366f1" />
                  <text x="14" y="19" fill="#ffffff" fontSize="7" fontFamily="sans-serif" fontWeight="bold">STORYLENS</text>
                </g>
              </g>

              {/* Animated orbital spark stars */}
              <circle cx="45" cy="35" r="1.5" fill="#fbbf24" className="animate-pulse" />
              <circle cx="145" cy="40" r="2" fill="#38bdf8" className="animate-pulse" />
              <circle cx="90" cy="155" r="2.5" fill="#a78bfa" className="animate-pulse" />

            </svg>

          </div>

          <span className="text-[10px] tracking-widest text-indigo-300 font-extrabold font-mono uppercase bg-indigo-950/60 border border-indigo-900/50 px-3 py-1 rounded-md">
            Ciclo de Arquitectura: <span className="text-emerald-400 font-black">{strikeCount}</span>
          </span>
        </div>

        {/* Dynamic Canvas Assembly Side (Assembled live by hammer hits) */}
        <div className="relative w-full max-w-[240px] aspect-square bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between overflow-hidden shadow-inner">
          
          {/* Blueprint background grid lines inside container */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1.2px,transparent_1.2px),linear-gradient(to_bottom,#1e293b_1.2px,transparent_1.2px)] bg-[size:12px_12px] opacity-50 pointer-events-none" />

          {/* Particle explosions spawned from hits */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-2 h-2 rounded-full animate-ping pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}`
              }}
            />
          ))}

          {/* Dynamic Mockup elements as loading advances */}
          <div className="space-y-2 z-10 w-full">
            
            {/* 1. Header/Filter element (Visible from step 0) */}
            <div className={`h-6 rounded border text-[8px] px-1.5 flex items-center justify-between transition-all duration-300 ${
              step >= 0 ? "bg-brand-600/20 border-brand-500 text-brand-300" : "bg-slate-950/20 border-slate-800/50 text-slate-700"
            }`}>
              <div className="flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                <span>FILTERS_PANEL</span>
              </div>
              <span className="font-bold opacity-60 font-sans">100%</span>
            </div>

            {/* 2. KPI Cards (Visible from step 1) */}
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-1.5 rounded border text-[8px] transition-all duration-500 transform ${
                step >= 1 ? "bg-emerald-600/20 border-emerald-500 scale-100 opacity-100" : "bg-slate-950/10 border-slate-900/30 scale-95 opacity-30"
              }`}>
                <span className="block text-[6px] opacity-60 font-semibold uppercase font-mono">KPI_Primary</span>
                <span className="font-extrabold text-white font-mono">$480K</span>
              </div>
              <div className={`p-1.5 rounded border text-[8px] transition-all duration-500 transform ${
                step >= 2 ? "bg-purple-600/20 border-purple-500 scale-100 opacity-100" : "bg-slate-950/10 border-slate-900/30 scale-95 opacity-30"
              }`}>
                <span className="block text-[6px] opacity-60 font-semibold uppercase font-mono">KPI_Secondary</span>
                <span className="font-extrabold text-purple-300 font-mono">82%</span>
              </div>
            </div>

            {/* 3. Main Trend Chart (Visible from step 3) */}
            <div className={`h-14 rounded border p-2 flex flex-col justify-between transition-all duration-700 transform ${
              step >= 3 ? "bg-blue-600/20 border-blue-500 scale-100 opacity-100" : "bg-slate-950/10 border-slate-900/30 scale-95 opacity-20"
            }`}>
              <span className="text-[7px] font-mono text-blue-300">MAIN_TREND_LINE</span>
              <svg className="w-full h-6 opacity-80" viewBox="0 0 100 20">
                <path d="M 0 18 Q 20 2 40 12 T 80 5 T 100 2" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
                <circle cx="40" cy="12" r="1.5" fill="#3b82f6" />
                <circle cx="80" cy="5" r="1.5" fill="#3b82f6" />
              </svg>
            </div>

            {/* 4. Secondary donut/bar chart (Visible from step 4) */}
            <div className="grid grid-cols-2 gap-2">
              <div className={`h-8 rounded border p-1 flex items-center gap-1.5 transition-all duration-700 transform ${
                step >= 4 ? "bg-amber-600/20 border-amber-500 scale-100 opacity-100" : "bg-slate-950/10 border-slate-900/30 scale-95 opacity-20"
              }`}>
                <div className="w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin-slow shrink-0" />
                <span className="text-[6px] font-mono text-amber-300 leading-none">DONUT_DIST</span>
              </div>

              <div className={`h-8 rounded border p-1 flex flex-col justify-between transition-all duration-700 transform ${
                step >= 4 ? "bg-indigo-600/20 border-indigo-500 scale-100 opacity-100" : "bg-slate-950/10 border-slate-900/30 scale-95 opacity-20"
              }`}>
                <span className="text-[5px] font-mono opacity-50 block leading-none">BAR_COMP</span>
                <div className="w-full h-1 bg-slate-800 rounded">
                  <div className="bg-indigo-400 h-full rounded" style={{ width: "75%" }} />
                </div>
              </div>
            </div>

            {/* 5. Supporting table (Visible from step 5) */}
            <div className={`p-1.5 rounded border text-[7px] space-y-1 transition-all duration-700 transform ${
              step >= 5 ? "bg-slate-800/50 border-slate-600 scale-100 opacity-100 animate-pulse" : "bg-slate-950/10 border-slate-900/30 scale-95 opacity-10"
            }`}>
              <div className="flex justify-between text-[5px] opacity-50 font-mono">
                <span>ENTITY_ID</span>
                <span>METRIC</span>
              </div>
              <div className="h-0.5 bg-slate-700 w-full rounded" />
              <div className="h-0.5 bg-slate-800 w-full rounded" />
            </div>

          </div>

          <span className="text-[8px] text-slate-500 font-mono text-right w-full block">
            Figma Sandbox v1.4
          </span>
        </div>

      </div>

      {/* Progress & Informative messaging section */}
      <div className="space-y-4 max-w-lg mx-auto w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/10 text-brand-300 text-xs font-bold rounded-full border border-brand-500/30 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-spin" /> Motor de Composición StoryLens
        </div>

        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-black tracking-tight text-white font-display">
            Construyendo tu Blueprint Metodológico
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Estamos aplicando técnicas de arquitectura de información en tiempo real. Por favor mantené esta pestaña activa.
          </p>
        </div>

        {/* Rotating Progress Messages */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500/10 rounded-lg flex items-center justify-center border border-brand-500/20 shrink-0">
              <Cpu className="w-4 h-4 text-brand-400 animate-pulse" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                Paso {step + 1} de {statusMessages.length}
              </span>
              <p className="text-sm font-semibold text-brand-200 font-sans tracking-wide">
                {statusMessages[step]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 font-mono text-xs font-bold text-brand-400 shrink-0 bg-brand-950/80 px-2 py-1 rounded border border-brand-500/20">
            <span>{Math.round(((step + 1) / statusMessages.length) * 100)}%</span>
          </div>
        </div>

        {/* Simulated elegant progress bar */}
        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800 p-0.5">
          <div 
            className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${((step + 1) / statusMessages.length) * 100}%` }}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <CheckCircle className={`w-3.5 h-3.5 ${step >= 1 ? "text-emerald-500" : "text-slate-700"}`} /> Goals defined
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className={`w-3.5 h-3.5 ${step >= 3 ? "text-emerald-500" : "text-slate-700"}`} /> Layout traced
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className={`w-3.5 h-3.5 ${step >= 5 ? "text-emerald-500" : "text-slate-700"}`} /> Gestalt checked
          </span>
        </div>
      </div>

    </div>
  );
}
