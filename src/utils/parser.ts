import { ColumnInfo, RoleOption } from "../types";

export function parseRawColumns(rawText: string): ColumnInfo[] {
  if (!rawText || !rawText.trim()) return [];

  // Split lines
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let rawNames: string[] = [];

  if (lines.length === 1) {
    // Possibly a single line delimited by comma, semicolon, or tab
    const singleLine = lines[0];
    if (singleLine.includes("\t")) {
      rawNames = singleLine.split("\t");
    } else if (singleLine.includes(";")) {
      rawNames = singleLine.split(";");
    } else if (singleLine.includes(",")) {
      rawNames = singleLine.split(",");
    } else {
      rawNames = [singleLine];
    }
  } else {
    // Multiple lines - could be individual column names or a table pasted
    // Check if the first line is tab-delimited, if so, we can parse headers
    if (lines[0].includes("\t")) {
      rawNames = lines[0].split("\t");
    } else if (lines[0].includes(";")) {
      rawNames = lines[0].split(";");
    } else if (lines[0].includes(",") && !lines[0].startsWith("{")) {
      // Basic check to make sure it's not a JSON string
      rawNames = lines[0].split(",");
    } else {
      // Otherwise treat each line as a single column name
      rawNames = lines;
    }
  }

  // Deduplicate and trim names
  const uniqueNames = Array.from(new Set(rawNames.map(name => name.trim().replace(/['"\[\]]/g, "")).filter(Boolean)));

  return uniqueNames.map((colName, index) => {
    const lowerName = colName.toLowerCase();
    
    let inferredType = "String";
    let suggestedRol: RoleOption = "Dimensión";
    let meaning = `Atributo categórico para segmentación y agrupación por ${colName}.`;

    // 1. Check Temporal
    if (
      lowerName.includes("fecha") || 
      lowerName.includes("date") || 
      lowerName.includes("time") || 
      lowerName.includes("mes") || 
      lowerName.includes("año") || 
      lowerName.includes("dia") || 
      lowerName.includes("hour") || 
      lowerName.includes("periodo") || 
      lowerName.includes("period") || 
      lowerName.includes("creado")
    ) {
      inferredType = "Date";
      suggestedRol = "Dimensión temporal";
      meaning = "Eje temporal para analizar la evolución histórica y estacionalidad de los KPIs.";
    }
    // 2. Check Metrics
    else if (
      lowerName.includes("venta") || 
      lowerName.includes("revenue") || 
      lowerName.includes("ingreso") || 
      lowerName.includes("monto") || 
      lowerName.includes("amount") || 
      lowerName.includes("total") || 
      lowerName.includes("precio") || 
      lowerName.includes("costo") || 
      lowerName.includes("cost") || 
      lowerName.includes("facturado") || 
      lowerName.includes("unidades") || 
      lowerName.includes("cantidad") || 
      lowerName.includes("cant") || 
      lowerName.includes("sales") || 
      lowerName.includes("qty") || 
      lowerName.includes("porcentaje") || 
      lowerName.includes("ratio") || 
      lowerName.includes("tasa") || 
      lowerName.includes("kpi") ||
      lowerName === "ventas" ||
      lowerName === "neto"
    ) {
      inferredType = "Number";
      suggestedRol = "Métrica";
      meaning = `Indicador numérico clave para medir la magnitud y éxito de la operación (${colName}).`;
    }
    // 3. Check Geography
    else if (
      lowerName.includes("provincia") || 
      lowerName.includes("ciudad") || 
      lowerName.includes("pais") || 
      lowerName.includes("region") || 
      lowerName.includes("prov") || 
      lowerName.includes("geografia") || 
      lowerName.includes("estado") || 
      lowerName.includes("comuna") || 
      lowerName.includes("municipio") ||
      lowerName.includes("localidad")
    ) {
      inferredType = "String";
      suggestedRol = "Geografía";
      meaning = "Dimensión geográfica de localización para visualizar mapas y distribución territorial.";
    }
    // 4. Check IDs
    else if (
      lowerName.includes("id") || 
      lowerName.includes("cod") || 
      lowerName.includes("codigo") || 
      lowerName.includes("uuid") || 
      lowerName.includes("key") || 
      lowerName.includes("identificador") ||
      lowerName.startsWith("cod_") ||
      lowerName.endsWith("_id")
    ) {
      inferredType = "String/ID";
      suggestedRol = "ID o entidad";
      meaning = `Código de identificación unívoco para auditar transacciones o registros de ${colName}.`;
    }
    // 5. Segmentations
    else if (
      lowerName.includes("rango") || 
      lowerName.includes("genero") || 
      lowerName.includes("tipo") || 
      lowerName.includes("grupo") || 
      lowerName.includes("segmento") ||
      lowerName.includes("edad") ||
      lowerName.includes("estado_civil")
    ) {
      inferredType = "String";
      suggestedRol = "Segmentación";
      meaning = `Atributo demográfico o de clasificación para filtrar y dividir el análisis de ${colName}.`;
    }

    return {
      id: `col-${index}-${lowerName}`,
      originalName: colName,
      inferredType,
      suggestedRol,
      meaning
    };
  });
}
