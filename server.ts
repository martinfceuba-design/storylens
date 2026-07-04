import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { StoryLensSession, StoryLensBlueprint, ColumnInfo, BlueprintBlock, RoleOption } from "./src/types.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (error) {
    console.error("Error initializing Gemini API Client:", error);
  }
} else {
  console.log("No GEMINI_API_KEY detected. StoryLens will run with its advanced Offline Storytelling Engine.");
}

// Offline fallback logic for generating a highly custom and professional Blueprint
function generateFallbackBlueprint(session: StoryLensSession): StoryLensBlueprint {
  const { tipoDashboard, tipoDashboardOtro, decisionPrincipal, audiencia, audienciaOtro, nivelDetalle, plataforma, columns } = session;
  
  const dashboardName = tipoDashboard === "Otro" ? tipoDashboardOtro : tipoDashboard;
  const targetAudiencia = audiencia === "Otro" ? audienciaOtro : audiencia;
  
  // Identify key columns
  const metricCols = columns.filter(c => c.suggestedRol === "Métrica");
  const dimCols = columns.filter(c => c.suggestedRol === "Dimensión" || c.suggestedRol === "Segmentación");
  const timeCols = columns.filter(c => c.suggestedRol === "Dimensión temporal");
  const geoCols = columns.filter(c => c.suggestedRol === "Geografía");
  
  // Default names if empty
  const timeColName = timeCols.length > 0 ? timeCols[0].originalName : "fecha";
  const geoColName = geoCols.length > 0 ? geoCols[0].originalName : "provincia";
  const mainMetric = metricCols.length > 0 ? metricCols[0].originalName : "ventas";
  const secondMetric = metricCols.length > 1 ? metricCols[1].originalName : (metricCols.length > 0 ? "unidades" : "cantidad");
  const mainDim = dimCols.length > 0 ? dimCols[0].originalName : "producto";
  const secondDim = dimCols.length > 1 ? dimCols[1].originalName : "categoria";

  // Create customized block wireframe elements
  const blocks: BlueprintBlock[] = [];
  
  // 1. Filters block
  blocks.push({
    id: "block-filters",
    title: "Panel de Filtros Rápidos",
    type: "filter",
    x: 1,
    y: 1,
    w: 12,
    h: 1,
    questionAnswered: "¿Cómo puedo recortar los datos para enfocar mi análisis?",
    columnsUsed: [timeColName, secondDim].filter(Boolean),
    whyRecommended: `Se ubica horizontalmente en la parte superior para que el usuario pueda segmentar de inmediato por ${timeColName} y ${secondDim} antes de leer los indicadores principales.`,
    alternativeDiscarded: "Filtros en panel lateral izquierdo colapsable. Se descartó porque la audiencia ejecutiva necesita ver explícitamente qué filtros están aplicados sin hacer clics extra.",
    storytellingPrinciple: "Principio de Carga Cognitiva: Al dejar los filtros visibles y arriba, se reduce el esfuerzo del usuario para entender el contexto de los números mostrados."
  });

  // 2. Main KPI cards
  blocks.push({
    id: "block-kpi-1",
    title: `KPI: ${mainMetric.toUpperCase()} Totales`,
    type: "kpi",
    x: 1,
    y: 2,
    w: 4,
    h: 2,
    questionAnswered: `¿Cuál es el volumen total de ${mainMetric} acumulado en el período seleccionado?`,
    columnsUsed: [mainMetric],
    whyRecommended: "Tarjeta numérica gigante de alto contraste con indicador de tendencia porcentual respecto al período anterior.",
    alternativeDiscarded: "Gráfico de termómetro. Se descartó porque quita espacio y distrae del número absoluto que la dirección busca capturar en 2 segundos.",
    storytellingPrinciple: "Enfoque en los 'First-Level Metrics': La esquina superior izquierda es el punto de partida visual natural (patrón de lectura en F)."
  });

  blocks.push({
    id: "block-kpi-2",
    title: `KPI: ${secondMetric.toUpperCase()} acumuladas`,
    type: "kpi",
    x: 5,
    y: 2,
    w: 4,
    h: 2,
    questionAnswered: `¿Qué volumen físico de ${secondMetric} se ha movilizado?`,
    columnsUsed: [secondMetric],
    whyRecommended: "Tarjeta numérica simple secundaria que complementa el valor monetario o KPI principal con la escala física de operación.",
    alternativeDiscarded: "Gráfico de dona. Se descartó por ser un KPI de nivel 1 que requiere asimilación instantánea, no proporcionalidad.",
    storytellingPrinciple: "Claridad y Minimalismo: Un indicador clave debe estar desprovisto de decoración innecesaria para maximizar su impacto."
  });

  blocks.push({
    id: "block-kpi-3",
    title: "Eficiencia de Operación (Ratio)",
    type: "kpi",
    x: 9,
    y: 2,
    w: 4,
    h: 2,
    questionAnswered: `¿Cuál es la relación de promedio o tasa de conversión calculada sobre ${mainMetric}?`,
    columnsUsed: [mainMetric, secondMetric].filter(Boolean),
    whyRecommended: "KPI calculado que mide la calidad o tasa de rendimiento. Aporta el contexto de rentabilidad o productividad necesario.",
    alternativeDiscarded: "Indicador tipo velocímetro (gauge). Se descartó por su baja densidad de información y aspecto sobrecargado.",
    storytellingPrinciple: "Racionalidad Operativa: Los ejecutivos no solo necesitan saber el 'cuánto', sino también la eficiencia de esa gestión."
  });

  // 3. Main Trend Chart
  blocks.push({
    id: "block-chart-trend",
    title: `Evolución Temporal de ${mainMetric}`,
    type: "chart_area",
    x: 1,
    y: 4,
    w: 8,
    h: 4,
    questionAnswered: `¿Cómo ha evolucionado la métrica de ${mainMetric} a lo largo del tiempo (${timeColName})?`,
    columnsUsed: [timeColName, mainMetric],
    whyRecommended: `Gráfico de área suavizada con gradiente sutil. Permite observar la tendencia histórica, estacionalidades y picos críticos de rendimiento.`,
    alternativeDiscarded: "Gráfico de barras individuales para cada día. Se descartó porque genera un efecto de sierra visual que dificulta la identificación de la tendencia general.",
    storytellingPrinciple: "Continuidad Visual: Las líneas y áreas guían el ojo de izquierda a derecha de manera natural para interpretar el tiempo."
  });

  // 4. Secondary Breakdown (by Dim o Geo)
  if (geoCols.length > 0) {
    blocks.push({
      id: "block-chart-breakdown",
      title: `Distribución de ${mainMetric} por ${geoColName}`,
      type: "map",
      x: 9,
      y: 4,
      w: 4,
      h: 4,
      questionAnswered: `¿Cuáles son las provincias o zonas geográficas con mayor volumen de ${mainMetric}?`,
      columnsUsed: [geoColName, mainMetric],
      whyRecommended: `Mapa de calor o coroplético prolijo. Ofrece una asimilación geográfica inmediata y añade dinamismo espacial al reporte.`,
      alternativeDiscarded: "Gráfico de torta de 15 porciones. Se descartó porque las porciones pequeñas son indescifrables y confunden a la audiencia.",
      storytellingPrinciple: "Anclaje Espacial: Asociar datos a coordenadas reales facilita que la gerencia regional identifique áreas de mejora."
    });
  } else {
    blocks.push({
      id: "block-chart-breakdown",
      title: `Análisis de Participación por ${secondDim}`,
      type: "chart_pie",
      x: 9,
      y: 4,
      w: 4,
      h: 4,
      questionAnswered: `¿Cómo se distribuye porcentualmente el total de ${mainMetric} entre las categorías de ${secondDim}?`,
      columnsUsed: [secondDim, mainMetric],
      whyRecommended: `Gráfico de anillo (donut chart) limitado a máximo 5 categorías principales más un acumulador de 'Otros'.`,
      alternativeDiscarded: "Gráfico de barras apiladas al 100%. Se descartó porque es más difícil de interpretar rápidamente para relaciones de parte-todo sencillas.",
      storytellingPrinciple: "Ley de Cierre Gestalt: El cerebro interpreta fácilmente un círculo cerrado dividido en porciones claras para identificar proporciones dominantes."
    });
  }

  // 5. Ranking / Details Table
  blocks.push({
    id: "block-table-details",
    title: `Ranking de Rendimiento por ${mainDim}`,
    type: "chart_bar",
    x: 1,
    y: 8,
    w: 7,
    h: 4,
    questionAnswered: `¿Cuáles son los Top 10 ${mainDim} que más aportan al total de ${mainMetric}?`,
    columnsUsed: [mainDim, mainMetric],
    whyRecommended: `Gráfico de barras horizontales ordenadas de mayor a menor. Es la visualización óptima para rankings porque permite leer los nombres largos del eje vertical con total comodidad.`,
    alternativeDiscarded: "Gráfico de columnas verticales. Se descartó porque los textos de las etiquetas del eje X quedarían en diagonal o cortados, destruyendo la legibilidad.",
    storytellingPrinciple: "Facilidad de Comparación: El ojo humano detecta con precisión milimétrica la diferencia de longitud entre barras alineadas en un mismo eje."
  });

  blocks.push({
    id: "block-table-grid",
    title: "Detalle Analítico de Registros",
    type: "table",
    x: 8,
    y: 8,
    w: 5,
    h: 4,
    questionAnswered: "¿Cuáles son los registros específicos para auditar o validar desviaciones?",
    columnsUsed: columns.slice(0, 5).map(c => c.originalName),
    whyRecommended: "Grilla tabular limpia con formato condicional discreto (barras de datos sutiles en la columna de métrica principal) y ordenación interactiva.",
    alternativeDiscarded: "Vistas tipo tarjetas repetitivas. Se descartó porque consume demasiada altura vertical y dificulta el escaneo rápido de múltiples columnas.",
    storytellingPrinciple: "Principio de Exploración: El analista senior necesita pasar del resumen a la inspección atómica en una única pantalla de control."
  });

  // Create KPI suggestions list
  const kpisRecomendados = [
    {
      id: "kpi-rec-1",
      kpi: `${mainMetric.toUpperCase()} Generales`,
      descripcion: `Mapea el rendimiento consolidado de la métrica ${mainMetric}. Sirve como el termómetro definitivo de la salud del negocio.`,
      columns: [mainMetric],
      justificacion: "Es la métrica de negocio más sensible y directa respecto al objetivo del dashboard."
    },
    {
      id: "kpi-rec-2",
      kpi: `Volumen de ${secondMetric.toUpperCase()}`,
      descripcion: `Monitorea las cantidades físicas y la magnitud operativa de ${secondMetric}.`,
      columns: [secondMetric],
      justificacion: "Permite aislar variaciones de precio o tarifas de los flujos de volumen reales."
    },
    {
      id: "kpi-rec-3",
      kpi: `Rendimiento de ${mainDim}`,
      descripcion: `Calcula la proporción promedio obtenida por unidad analizada de ${mainDim}.`,
      columns: [mainDim, mainMetric],
      justificacion: "Añade dimensión de granularidad analítica para no perder de vista la concentración de valor."
    }
  ];

  // Visual recommendations
  const visualizacionesSugeridas = [
    {
      visualizacion: "Gráfico de Área Suavizada (Evolución)",
      columns: [timeColName, mainMetric],
      porQue: "Suaviza el ruido visual de fluctuaciones menores y permite concentrar la atención en la tendencia estacional de largo plazo.",
      alternativaDescartada: "Gráfico de columnas verticales (genera fatiga visual si hay más de 15 períodos de tiempo)."
    },
    {
      visualizacion: "Gráfico de Barras Horizontales (Rankings)",
      columns: [mainDim, mainMetric],
      porQue: "Es el estándar de oro para comparar elementos con etiquetas textuales extensas, evitando el solapamiento de palabras.",
      alternativaDescartada: "Gráfico de burbujas o diagrama de araña (complejo de leer y poco preciso para comparar magnitudes)."
    }
  ];

  if (geoCols.length > 0) {
    visualizacionesSugeridas.push({
      visualizacion: "Mapa Coroplético (Distribución Territorial)",
      columns: [geoColName, mainMetric],
      porQue: "Permite una correspondencia cognitiva inmediata entre la distribución de ventas y el territorio de gestión comercial.",
      alternativaDescartada: "Gráfico de torta (completamente ineficiente para mostrar más de 5 regiones geográficas)."
    });
  }

  // Platform specific recommendations
  const recomendacionesPlataforma = plataforma === "Power BI" ? [
    "Utilizá marcadores y paneles de selección (Bookmarking) para permitir alternar entre vistas analíticas sin recargar el informe.",
    "Aprovechá la característica de 'Tooltips de Página de Informe' para mostrar detalles históricos al pasar el cursor sobre las barras de producto.",
    "Implementá segmentadores de sincronización entre páginas para mantener la coherencia si expandís el reporte a más pestañas.",
    "Configurá el formato condicional de la tabla de detalles usando la paleta corporativa y limitando el uso de colores chillones."
  ] : plataforma === "Tableau" ? [
    "Organizá los contenedores horizontales y verticales de manera estricta para evitar flotantes que se desajusten al cambiar de resolución.",
    "Utilizá 'Acciones de Parámetro' para permitir que al hacer clic en un producto se actualice de inmediato la curva de tendencia temporal.",
    "Aplica 'Calculated Fields' optimizados para no penalizar el rendimiento del servidor en tiempo real.",
    "Mantené una tipografía unificada usando la familia nativa Tableau Book en distintos tamaños y pesos."
  ] : plataforma === "Looker Studio" ? [
    "Utilizá la opción de 'Controles de Filtro' unificados en el encabezado con estilo compacto para ahorrar espacio.",
    "Configurá la paleta de colores del tema vinculándola directamente a los valores de marca usando códigos HEX específicos.",
    "Habilitá el comportamiento interactivo 'Filtrado Cruzado' en todos los gráficos principales para que actúen como filtros rápidos al hacer clic.",
    "Asegurá que la tabla analítica tenga habilitada la paginación con tamaño de página de 10 registros para evitar scroll infinito en el lienzo."
  ] : plataforma === "Qlik Sense" ? [
    "Aprovechá el motor asociativo creando dimensiones maestras y medidas maestras para facilitar que el usuario explore el modelo libremente.",
    "Utilizá los 'Estados Alternos' para permitir la comparación cara a cara entre dos provincias o dos líneas de producto en paralelo.",
    "Asegurá que el wireframe modular use la grilla estándar de Qlik, manteniendo el margen de 8 píxeles entre los objetos del lienzo.",
    "Implementá KPIs nativos con minigráficos de línea de tendencia (Sparklines) integrados en la misma caja."
  ] : [
    "Definí una rejilla base (grid system) estricta de 12 columnas. Esto asegura simetría y orden estético en cualquier plataforma de BI.",
    "Establecé una regla de color: 60% color dominante de fondo (neutro), 30% color de estructura, 10% color de acento destacado (para alertas y KPIs clave).",
    "Evitá agrupar más de 5 gráficos en una sola solapa o pestaña. Si la historia requiere más visualizaciones, dividila en sub-secciones lógicas.",
    "Utilizá títulos de gráficos conversacionales (ej: '¿Cómo evolucionaron las ventas?' en lugar de 'Ventas por Año/Mes')."
  ];

  return {
    estrategiaComunicacion: {
      problemaNegocio: `El usuario busca mejorar la toma de decisiones estratégicas de ${dashboardName} monitoreando con exactitud los desvíos y la concentración operativa de su gestión.`,
      decisionFacilitar: decisionPrincipal || "Optimizar la asignación de recursos comerciales e identificar de forma temprana desvíos de rendimiento operativo.",
      audiencia: targetAudiencia,
      nivelDetalle: nivelDetalle,
      narrativaRecomendada: `La narrativa recomendada es de tipo 'Problema-Resolución' ordenada en pirámide invertida: comenzando con los resultados macro consolidados de KPIs para enganchar a ${targetAudiencia}, siguiendo con las tendencias y desgloses que explican el comportamiento intermedio de ${mainDim}, y culminando con una grilla analítica accionable para resolver anomalías detectadas.`,
      mensajesPrincipales: [
        `Identificar con precisión qué ${mainDim} representan el 80% de la métrica ${mainMetric} (Regla de Pareto).`,
        `Monitorear si existe una estacionalidad de corto plazo que requiera ajustes presupuestarios inmediatos.`,
        `Comparar de forma directa la eficiencia entre distintos grupos de segmentación de ${secondDim}.`
      ]
    },
    estrategiaDiseno: {
      kpisRecomendados,
      wireframe: {
        layoutType: nivelDetalle.toLowerCase().includes("ejecutiva") ? "executive" : "analytical",
        blocks
      },
      visualizacionesSugeridas,
      recomendacionesPlataforma
    }
  };
}

// REST API for Generating StoryLens Blueprint
app.post("/api/blueprint", async (req, res) => {
  const session: StoryLensSession = req.body;
  
  if (!session || !session.columns || session.columns.length === 0) {
    return res.status(400).json({ error: "Estructura de datos o respuestas del flujo inválidas." });
  }

  // If Gemini is available, query Gemini to create an ultra-creative, rich and deeply customized blueprint!
  if (ai) {
    try {
      console.log(`Querying Gemini (gemini-3.5-flash) to generate a customized Blueprint for ${session.tipoDashboard}...`);
      
      const columnsListStr = session.columns.map(c => `- Column: ${c.originalName}, Type: ${c.inferredType}, Suggesed Rol: ${c.suggestedRol}, Interpreted Meaning: ${c.meaning}`).join("\n");
      
      const prompt = `
        Eres un Consultor Senior de Business Intelligence y Data Storytelling experto en metodologías de diseño de dashboards (como Stephen Few, Alberto Cairo, y Cole Nussbaumer Knaflic).
        Tu objetivo es generar un StoryLens Blueprint metodológico sumamente detallado, coherente y profesional en base a la información de diseño provista.

        DATOS DE ENTRADA:
        - Tipo de Dashboard: ${session.tipoDashboard} ${session.tipoDashboard === 'Otro' ? `(${session.tipoDashboardOtro})` : ''}
        - Decisión Principal a Facilitar: ${session.decisionPrincipal}
        - Audiencia Clave: ${session.audiencia} ${session.audiencia === 'Otro' ? `(${session.audienciaOtro})` : ''}
        - Nivel de Detalle: ${session.nivelDetalle}
        - Herramienta de Implementación seleccionada: ${session.plataforma}
        - Columnas validadas de la estructura de datos:
        ${columnsListStr}

        REGLAS DE DISEÑO DEL WIREFRAME Y RECOMENDACIONES:
        1. El wireframe representa la arquitectura física del dashboard. Debe contener una lista de bloques lógicos (entre 5 y 8 bloques) que encajen en una grilla de 12 columnas.
        2. Cada bloque tiene coordenadas x (1 a 12), y, w (ancho de 1 a 12), h (alto). Asegúrate de que formen una composición visualmente estética, armónica y lógica para la plataforma seleccionada.
           - Fila de Filtros (ej: x:1, y:1, w:12, h:1)
           - Fila de KPIs numéricos (ej: 3 tarjetas de w:4 y h:2 a la par)
           - Cuerpo central: gráfico de tendencia grande (ej: w:8, h:4) y gráfico de distribución secundario al lado (ej: w:4, h:4)
           - Sección inferior: tabla detallada o gráfico de ranking (ej: w:12, h:4 o divididos en w:6 y w:6)
        3. Cada bloque debe incluir:
           - title: Nombre del elemento (ej: "KPI Ventas Consolidadas", "Evolución de Ingresos")
           - type: Uno de estos valores exactos: 'kpi' | 'chart_bar' | 'chart_line' | 'chart_pie' | 'chart_area' | 'filter' | 'table' | 'map' | 'scatter'
           - questionAnswered: La pregunta de negocio exacta que responde este bloque (Ej: "¿Cuáles son las regiones con mayores costos de distribución?")
           - columnsUsed: Arreglo de strings que correspondan exactamente a los nombres originales de las columnas provistas
           - whyRecommended: Explicación de por qué esta visualización es la mejor opción para esta métrica y audiencia.
           - alternativeDiscarded: Explicación de qué alternativa visual alternativa se analizó, por qué se descartó, y las debilidades metodológicas de la opción descartada.
           - storytellingPrinciple: El principio de Data Storytelling o Psicología de la Gestalt que fundamenta esta decisión.
        4. Toda la respuesta debe estar redactada en un español profesional, didáctico y sumamente estructurado. Evita rodeos, habla como un consultor estratégico experto.

        Retorna la respuesta siguiendo estrictamente el siguiente esquema JSON:
        {
          "estrategiaComunicacion": {
            "problemaNegocio": "descripción amplia del problema de negocio",
            "decisionFacilitar": "la decisión crítica que facilitará",
            "audiencia": "la audiencia principal",
            "nivelDetalle": "nivel de detalle recomendado",
            "narrativaRecomendada": "flujo narrativo sugerido y por qué",
            "mensajesPrincipales": ["mensaje estratégico 1", "mensaje estratégico 2", "mensaje estratégico 3"]
          },
          "estrategiaDiseno": {
            "kpisRecomendados": [
              { "id": "kpi-1", "kpi": "nombre del KPI", "descripcion": "explicación funcional", "columns": ["columna1"], "justificacion": "por qué es crítico" }
            ],
            "wireframe": {
              "layoutType": "executive o analytical o operational",
              "blocks": [
                {
                  "id": "block-id",
                  "title": "título del bloque",
                  "type": "un valor entre: kpi, chart_bar, chart_line, chart_pie, chart_area, filter, table, map, scatter",
                  "x": 1,
                  "y": 1,
                  "w": 4,
                  "h": 2,
                  "questionAnswered": "pregunta que responde",
                  "columnsUsed": ["columna1"],
                  "whyRecommended": "justificación visual",
                  "alternativeDiscarded": "alternativa descartada",
                  "storytellingPrinciple": "principio de storytelling"
                }
              ]
            },
            "visualizacionesSugeridas": [
              { "visualizacion": "tipo de gráfico", "columns": ["columna1"], "porQue": "justificación", "alternativaDescartada": "alternativa descartada" }
            ],
            "recomendacionesPlataforma": ["recomendación técnica 1", "recomendación técnica 2", "recomendación técnica 3"]
          }
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              estrategiaComunicacion: {
                type: Type.OBJECT,
                properties: {
                  problemaNegocio: { type: Type.STRING },
                  decisionFacilitar: { type: Type.STRING },
                  audiencia: { type: Type.STRING },
                  nivelDetalle: { type: Type.STRING },
                  narrativaRecomendada: { type: Type.STRING },
                  mensajesPrincipales: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["problemaNegocio", "decisionFacilitar", "audiencia", "nivelDetalle", "narrativaRecomendada", "mensajesPrincipales"]
              },
              estrategiaDiseno: {
                type: Type.OBJECT,
                properties: {
                  kpisRecomendados: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        kpi: { type: Type.STRING },
                        descripcion: { type: Type.STRING },
                        columns: { type: Type.ARRAY, items: { type: Type.STRING } },
                        justificacion: { type: Type.STRING }
                      },
                      required: ["id", "kpi", "descripcion", "columns", "justificacion"]
                    }
                  },
                  wireframe: {
                    type: Type.OBJECT,
                    properties: {
                      layoutType: { type: Type.STRING },
                      blocks: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING },
                            type: { type: Type.STRING },
                            x: { type: Type.INTEGER },
                            y: { type: Type.INTEGER },
                            w: { type: Type.INTEGER },
                            h: { type: Type.INTEGER },
                            questionAnswered: { type: Type.STRING },
                            columnsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                            whyRecommended: { type: Type.STRING },
                            alternativeDiscarded: { type: Type.STRING },
                            storytellingPrinciple: { type: Type.STRING }
                          },
                          required: ["id", "title", "type", "x", "y", "w", "h", "questionAnswered", "columnsUsed", "whyRecommended", "alternativeDiscarded", "storytellingPrinciple"]
                        }
                      }
                    },
                    required: ["layoutType", "blocks"]
                  },
                  visualizacionesSugeridas: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        visualizacion: { type: Type.STRING },
                        columns: { type: Type.ARRAY, items: { type: Type.STRING } },
                        porQue: { type: Type.STRING },
                        alternativaDescartada: { type: Type.STRING }
                      },
                      required: ["visualizacion", "columns", "porQue", "alternativaDescartada"]
                    }
                  },
                  recomendacionesPlataforma: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["kpisRecomendados", "wireframe", "visualizacionesSugeridas", "recomendacionesPlataforma"]
              }
            },
            required: ["estrategiaComunicacion", "estrategiaDiseno"]
          }
        }
      });

      const text = response.text;
      if (text) {
        const blueprintParsed: StoryLensBlueprint = JSON.parse(text.trim());
        return res.json(blueprintParsed);
      } else {
        throw new Error("Empty response from Gemini API");
      }
    } catch (error) {
      console.error("Gemini API Error, falling back to offline Storytelling Engine:", error);
      const fallbackBlueprint = generateFallbackBlueprint(session);
      return res.json(fallbackBlueprint);
    }
  } else {
    // Generate fallback blueprint with custom offline intelligence
    const fallbackBlueprint = generateFallbackBlueprint(session);
    return res.json(fallbackBlueprint);
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
