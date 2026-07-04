import React, { useState } from "react";
import { ArrowLeft, ArrowRight, ShieldAlert, Sparkles, HelpCircle, PencilLine, Check } from "lucide-react";
import { ColumnInfo, RoleOption } from "../types";

interface ValidationStepProps {
  columns: ColumnInfo[];
  onUpdateColumn: (id: string, updatedFields: Partial<ColumnInfo>) => void;
  onGenerate: () => void;
  onBack: () => void;
}

export default function ValidationStep({
  columns,
  onUpdateColumn,
  onGenerate,
  onBack
}: ValidationStepProps) {
  const [hoveredColId, setHoveredColId] = useState<string | null>(null);

  const roles: { value: RoleOption; label: string; desc: string }[] = [
    { value: "Métrica", label: "Métrica", desc: "Números para calcular (Ventas, Unidades, Promedios)." },
    { value: "Dimensión", label: "Dimensión", desc: "Atributos de agrupación (Producto, Laboratorio, Cliente)." },
    { value: "Dimensión temporal", label: "Dimensión temporal", desc: "Fechas u horas para análisis evolutivo." },
    { value: "Geografía", label: "Geografía", desc: "Localizaciones territoriales (Provincia, País)." },
    { value: "ID o entidad", label: "ID o entidad", desc: "Códigos únicos identificadores." },
    { value: "Segmentación", label: "Segmentación", desc: "Campos de filtro rígido (Rangos, Estado, Tipo)." },
    { value: "Campo ambiguo", label: "Campo ambiguo", desc: "Valores no reconocidos o dudosos." }
  ];

  const dataTypes = [
    { value: "Texto", label: "Texto (Text)" },
    { value: "Número", label: "Número (Number)" },
    { value: "Fecha", label: "Fecha (Date)" },
    { value: "Booleano", label: "Booleano (Boolean)" },
    { value: "Moneda", label: "Moneda (Currency)" },
    { value: "Porcentaje", label: "Porcentaje (Percentage)" }
  ];

  const normalizeDataType = (val: string): string => {
    const lower = (val || "").toLowerCase();
    if (lower.includes("string") || lower.includes("text") || lower.includes("texto") || lower.includes("id")) return "Texto";
    if (lower.includes("number") || lower.includes("número") || lower.includes("numero")) return "Número";
    if (lower.includes("date") || lower.includes("fecha") || lower.includes("time")) return "Fecha";
    if (lower.includes("bool") || lower.includes("booleano")) return "Booleano";
    if (lower.includes("currency") || lower.includes("moneda")) return "Moneda";
    if (lower.includes("percent") || lower.includes("porcentaje")) return "Porcentaje";
    return "Texto"; // fallback
  };

  return (
    <div id="step-validation-container" className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Paso 5 de 5 • Validación Metodológica
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Validá la interpretación de StoryLens
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Nuestra inteligencia interpretó la estructura de datos. Para asegurar que el Blueprint sea de máxima precisión técnica, confirmá o corregí los roles de tus columnas.
        </p>
      </div>

      {/* Advisory Message */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3 text-amber-950">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Humano en el bucle (Human-in-the-Loop)</h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            Un buen dashboard es fruto de la colaboración entre la inteligencia analítica y el experto del negocio. Confirmá los roles sugeridos para calibrar el wireframe.
          </p>
        </div>
      </div>

      {/* Columns Validation Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs uppercase tracking-wider">
                <th className="py-4 px-4 font-bold w-1/4">Columna de Datos</th>
                <th className="py-4 px-4 font-bold w-1/5">Tipo Inferido</th>
                <th className="py-4 px-4 font-bold w-1/4">Rol Metodológico</th>
                <th className="py-4 px-4 font-bold">Significado Interpretado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 text-sm">
              {columns.map((col) => {
                const isHovered = hoveredColId === col.id;
                return (
                  <tr 
                    key={col.id}
                    id={`validation-row-${col.id}`}
                    onMouseEnter={() => setHoveredColId(col.id)}
                    onMouseLeave={() => setHoveredColId(null)}
                    className={`transition-colors duration-150 ${isHovered ? "bg-slate-50/70" : "bg-white"}`}
                  >
                    {/* Name */}
                    <td className="py-4 px-4 font-semibold text-slate-900 font-mono text-xs">
                      {col.originalName}
                    </td>

                    {/* Inferred Type */}
                    <td className="py-4 px-4">
                      <select
                        id={`select-type-${col.id}`}
                        value={normalizeDataType(col.inferredType)}
                        onChange={(e) => onUpdateColumn(col.id, { inferredType: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none cursor-pointer font-mono"
                      >
                        {dataTypes.map((dt) => (
                          <option key={dt.value} value={dt.value}>
                            {dt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Role Sugerido Dropdown */}
                    <td className="py-4 px-4">
                      <select
                        id={`select-role-${col.id}`}
                        value={col.suggestedRol}
                        onChange={(e) => onUpdateColumn(col.id, { suggestedRol: e.target.value as RoleOption })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none cursor-pointer"
                      >
                        {roles.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Significado Interpretado Input */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          id={`input-meaning-${col.id}`}
                          type="text"
                          value={col.meaning}
                          onChange={(e) => onUpdateColumn(col.id, { meaning: e.target.value })}
                          placeholder="Explicá qué mide o clasifica este campo..."
                          className="w-full bg-white border border-transparent hover:border-slate-200 focus:border-brand-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 focus:text-slate-900 transition-colors focus:ring-2 focus:ring-brand-500/20 outline-none"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Helpful Hint */}
      <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <HelpCircle className="w-4 h-4 text-slate-300" />
        <span>Hacé clic sobre los significados de la tabla para reescribirlos si considerás que un término técnico amerita aclaración.</span>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-slate-100">
        <button
          id="btn-back-step-5"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <button
          id="btn-generate-blueprint"
          onClick={onGenerate}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
        >
          Generar StoryLens Blueprint <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
