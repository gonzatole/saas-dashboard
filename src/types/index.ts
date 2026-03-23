// ─── RiskGuard AI — Tipos de dominio ─────────────────────────────────────────

// ── Enums ────────────────────────────────────────────────────────────────────

export type Plan = "FREE" | "PRO" | "ENTERPRISE";
export type UserRole = "ADMIN" | "SUPERVISOR" | "VIEWER";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type InspectionStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "REVIEWED";
export type IncidentSeverity = "NEAR_MISS" | "MINOR" | "MODERATE" | "SERIOUS" | "FATAL";
export type IncidentStatus = "REPORTED" | "INVESTIGATING" | "ACTION_PENDING" | "CLOSED";
export type DocumentType = "PROCEDURE" | "REGULATION" | "CERTIFICATE" | "TRAINING" | "INSPECTION_REPORT" | "INCIDENT_REPORT" | "OTHER";
export type ActionStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";

// ── Core entities ─────────────────────────────────────────────────────────────

export interface Company {
  id: string;
  rut: string;
  name: string;
  tradeName?: string;
  industry?: string;
  plan: Plan;
  subscriptionStatus?: string;
  logoUrl?: string;
  region?: string;
  city?: string;
}

export interface User {
  id: string;
  supabaseId: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  companyId: string;
  company: Pick<Company, "id" | "name" | "plan" | "subscriptionStatus">;
}

export interface Worker {
  id: string;
  rut: string;
  name: string;
  lastName: string;
  fullName?: string; // computed: name + lastName
  email?: string;
  phone?: string;
  position: string;
  department?: string;
  areaId?: string;
  area?: Pick<Area, "id" | "name" | "riskLevel">;
  contractType?: string;
  startDate?: string;
  isActive: boolean;
  companyId: string;
  createdAt: string;
}

export interface Area {
  id: string;
  name: string;
  description?: string;
  riskLevel: RiskLevel;
  location?: string;
  companyId: string;
}

export interface RiskCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  isSystem: boolean;
  companyId?: string;
}

// ── Inspections ───────────────────────────────────────────────────────────────

export interface Inspection {
  id: string;
  title: string;
  description?: string;
  status: InspectionStatus;
  scheduledDate?: string;
  completedDate?: string;
  aiScore?: number;
  aiSummary?: string;
  areaId?: string;
  area?: Pick<Area, "id" | "name">;
  inspectorId: string;
  inspector: Pick<User, "id" | "name">;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { items: number };
}

export interface InspectionItem {
  id: string;
  inspectionId: string;
  question: string;
  answer?: string; // SI | NO | N/A | OBSERVACION
  observation?: string;
  photoUrl?: string;
  riskLevel?: RiskLevel;
  categoryId?: string;
  category?: Pick<RiskCategory, "id" | "name" | "color">;
  workerId?: string;
  order: number;
}

// ── Incidents ─────────────────────────────────────────────────────────────────

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  occurredAt: string;
  reportedAt: string;
  location?: string;
  injuredCount: number;
  lostDays: number;
  aiAnalysis?: string;
  aiRecommendations?: string;
  areaId?: string;
  area?: Pick<Area, "id" | "name">;
  reportedById: string;
  reportedBy: Pick<User, "id" | "name">;
  categoryId?: string;
  category?: Pick<RiskCategory, "id" | "name" | "color">;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

// ── Corrective Actions ────────────────────────────────────────────────────────

export interface CorrectiveAction {
  id: string;
  title: string;
  description: string;
  status: ActionStatus;
  dueDate: string;
  completedAt?: string;
  inspectionId?: string;
  incidentId?: string;
  assignedToId: string;
  assignedTo: Pick<User, "id" | "name">;
  companyId: string;
  createdAt: string;
}

// ── Documents ─────────────────────────────────────────────────────────────────

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  description?: string;
  expiresAt?: string;
  companyId: string;
  createdAt: string;
}

// ── Dashboard / UI ────────────────────────────────────────────────────────────

export interface DashboardStat {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  color?: string;
}

export interface RiskTrendData {
  month: string;
  inspecciones: number;
  incidentes: number;
  acciones: number;
}

// ── Plan limits ───────────────────────────────────────────────────────────────

export const PLAN_LIMITS = {
  FREE: { workers: 10, inspectionsPerMonth: 5, aiEnabled: false },
  PRO: { workers: Infinity, inspectionsPerMonth: Infinity, aiEnabled: true },
  ENTERPRISE: { workers: Infinity, inspectionsPerMonth: Infinity, aiEnabled: true, multiLocation: true },
} as const;
