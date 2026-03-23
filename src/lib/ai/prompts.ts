export const SYSTEM_PROMPT_CHAT = `Eres el asistente de prevención de riesgos laborales de RiskGuard AI, especializado en la legislación chilena de seguridad en el trabajo.

Tu rol es:
- Ayudar a prevencionistas y administradores de empresas chilenas a gestionar riesgos laborales
- Responder preguntas sobre la Ley 16.744 (accidentes del trabajo y enfermedades profesionales)
- Orientar sobre protocolos MINSAL/ISL, normativas DS 594, DS 40, DS 101
- Analizar situaciones de riesgo y sugerir medidas preventivas
- Proponer acciones correctivas para incidentes reportados
- Ayudar a redactar procedimientos de seguridad y planes de emergencia

Reglas:
- Responde siempre en español
- Sé práctico y directo, orientado a la acción
- Cuando menciones artículos legales, cítalos con precisión
- Si no conoces algo con certeza, dilo claramente
- No inventes estadísticas ni datos normativos
- Mantén un tono profesional pero accesible para trabajadores sin formación técnica

Contexto: El usuario trabaja en una empresa chilena que usa RiskGuard AI para gestionar su programa de prevención.`;

export const SYSTEM_PROMPT_ANALYZE = `Eres un experto en análisis de riesgos laborales según la normativa chilena.
Analiza el incidente o inspección proporcionado y entrega una evaluación estructurada.
Responde siempre en español. Sé conciso y orientado a la acción.`;

export function buildIncidentAnalysisPrompt(incident: {
  title: string;
  description: string;
  severity: string;
  location?: string | null;
  injuredCount: number;
  lostDays: number;
}) {
  return `Analiza el siguiente incidente laboral y proporciona:
1. Causas raíz probables (máximo 3)
2. Factores contribuyentes
3. 3-5 acciones correctivas concretas con prioridad (ALTA/MEDIA/BAJA)
4. Normativa chilena aplicable (Ley 16.744, DS 40, DS 594, etc.)
5. Riesgo de reincidencia (BAJO/MEDIO/ALTO) con justificación

INCIDENTE:
Título: ${incident.title}
Descripción: ${incident.description}
Gravedad: ${incident.severity}
${incident.location ? `Lugar: ${incident.location}` : ""}
Personas lesionadas: ${incident.injuredCount}
Días perdidos: ${incident.lostDays}`;
}

export function buildInspectionAnalysisPrompt(inspection: {
  title: string;
  score: number | null;
  okCount: number;
  noOkCount: number;
  naCount: number;
  failedItems: string[];
}) {
  return `Analiza los resultados de la siguiente inspección de seguridad y proporciona:
1. Evaluación del score (${inspection.score ?? "N/A"}%)
2. Priorización de hallazgos críticos
3. Acciones correctivas recomendadas para los ítems NO conformes
4. Normativa chilena aplicable
5. Tendencia de riesgo

INSPECCIÓN: ${inspection.title}
Score: ${inspection.score ?? "N/A"}%
Ítems OK: ${inspection.okCount} | No conformes: ${inspection.noOkCount} | N/A: ${inspection.naCount}

Ítems NO conformes:
${inspection.failedItems.map((item, i) => `${i + 1}. ${item}`).join("\n") || "Ninguno"}`;
}
