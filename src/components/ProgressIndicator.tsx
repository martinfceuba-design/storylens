import React from "react";
import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
}

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = [
    { label: "Objetivo", number: 1 },
    { label: "Audiencia", number: 2 },
    { label: "Plataforma", number: 3 },
    { label: "Datos", number: 4 },
    { label: "Validación", number: 5 },
    { label: "Blueprint", number: 6 }
  ];

  return (
    <div id="progress-indicator-bar" className="w-full max-w-4xl mx-auto px-4 py-6 bg-white border border-slate-200 rounded-2xl shadow-sm mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        
        {/* Progress Completed Active Line */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-brand-600 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((Math.min(currentStep, 6) - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          
          return (
            <div 
              key={step.number} 
              id={`progress-node-${step.number}`}
              className="flex flex-col items-center relative z-10"
            >
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border-2 ${
                  isCompleted 
                    ? "bg-brand-600 border-brand-600 text-white shadow-sm" 
                    : isActive 
                    ? "bg-white border-brand-600 text-brand-700 shadow-md scale-105" 
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  step.number
                )}
              </div>
              <span 
                className={`text-xs mt-2 font-medium transition-colors duration-300 hidden sm:inline ${
                  isActive ? "text-brand-900 font-bold" : isCompleted ? "text-brand-600" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
