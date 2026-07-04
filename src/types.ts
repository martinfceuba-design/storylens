export type RoleOption = 
  | 'Métrica' 
  | 'Dimensión' 
  | 'Dimensión temporal' 
  | 'Geografía' 
  | 'ID o entidad' 
  | 'Segmentación' 
  | 'Campo ambiguo';

export interface ColumnInfo {
  id: string;
  originalName: string;
  inferredType: string;
  suggestedRol: RoleOption;
  meaning: string;
}

export interface BlueprintBlock {
  id: string;
  title: string;
  type: 'kpi' | 'chart_bar' | 'chart_line' | 'chart_pie' | 'chart_area' | 'filter' | 'table' | 'map' | 'scatter';
  x: number; // 1 to 12 grid position
  y: number;
  w: number; // 1 to 12 grid width
  h: number; // grid height units
  questionAnswered: string;
  columnsUsed: string[];
  whyRecommended: string;
  alternativeDiscarded: string;
  storytellingPrinciple: string;
}

export interface KpiRecommendation {
  id: string;
  kpi: string;
  descripcion: string;
  columns: string[];
  justificacion: string;
}

export interface VisualRecommendation {
  visualizacion: string;
  columns: string[];
  porQue: string;
  alternativaDescartada: string;
}

export interface StoryLensBlueprint {
  estrategiaComunicacion: {
    problemaNegocio: string;
    decisionFacilitar: string;
    audiencia: string;
    nivelDetalle: string;
    narrativaRecomendada: string;
    mensajesPrincipales: string[];
  };
  estrategiaDiseno: {
    kpisRecomendados: KpiRecommendation[];
    wireframe: {
      layoutType: string;
      blocks: BlueprintBlock[];
    };
    visualizacionesSugeridas: VisualRecommendation[];
    recomendacionesPlataforma: string[];
  };
}

export interface StoryLensSession {
  tipoDashboard: string;
  tipoDashboardOtro: string;
  decisionPrincipal: string;
  audiencia: string;
  audienciaOtro: string;
  nivelDetalle: string;
  plataforma: 'Power BI' | 'Qlik Sense' | 'Tableau' | 'Looker Studio' | 'Aún no lo sé';
  rawDataColumns: string;
  columns: ColumnInfo[];
}
