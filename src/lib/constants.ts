// ─── RiskGuard AI — Constantes del dominio chileno ───────────────────────────

export const REGIONES_CHILE = [
  "Región de Arica y Parinacota",
  "Región de Tarapacá",
  "Región de Antofagasta",
  "Región de Atacama",
  "Región de Coquimbo",
  "Región de Valparaíso",
  "Región Metropolitana de Santiago",
  "Región del Libertador General Bernardo O'Higgins",
  "Región del Maule",
  "Región de Ñuble",
  "Región del Biobío",
  "Región de La Araucanía",
  "Región de Los Ríos",
  "Región de Los Lagos",
  "Región de Aysén del General Carlos Ibáñez del Campo",
  "Región de Magallanes y de la Antártica Chilena",
] as const;

export const TIPOS_CONTRATO = [
  { value: "INDEFINIDO", label: "Contrato indefinido" },
  { value: "PLAZO_FIJO", label: "Contrato a plazo fijo" },
  { value: "OBRA_FAENA", label: "Por obra o faena" },
  { value: "HONORARIOS", label: "Honorarios" },
  { value: "APRENDIZAJE", label: "Contrato de aprendizaje" },
  { value: "TEMPORAL", label: "Temporal" },
] as const;

export const RISK_LEVEL_LABELS: Record<string, string> = {
  LOW: "Bajo",
  MEDIUM: "Medio",
  HIGH: "Alto",
  CRITICAL: "Crítico",
};

export const RISK_LEVEL_COLORS: Record<string, string> = {
  LOW: "bg-emerald-100 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
};

export const RISK_LEVEL_DOT: Record<string, string> = {
  LOW: "bg-emerald-500",
  MEDIUM: "bg-yellow-500",
  HIGH: "bg-orange-500",
  CRITICAL: "bg-red-500",
};

export const INSPECTION_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completada",
  REVIEWED: "Revisada",
};

export const INCIDENT_SEVERITY_LABELS: Record<string, string> = {
  NEAR_MISS: "Casi accidente",
  MINOR: "Leve",
  MODERATE: "Moderado",
  SERIOUS: "Grave",
  FATAL: "Fatal",
};

export const ACTION_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completada",
  OVERDUE: "Vencida",
};

export const PLAN_LABELS: Record<string, string> = {
  FREE: "Gratuito",
  PRO: "Pro",
  ENTERPRISE: "Enterprise",
};

// Sectores industriales chilenos comunes
export const SECTORES_INDUSTRIALES = [
  "Construcción",
  "Minería",
  "Manufactura",
  "Agricultura",
  "Pesca y acuicultura",
  "Logística y transporte",
  "Comercio",
  "Educación",
  "Salud",
  "Energía y utilities",
  "Forestal",
  "Servicios",
  "Tecnología",
  "Otro",
] as const;
