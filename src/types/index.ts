// ─── Tipos compartidos para el SaaS Dashboard ────────────────────────────────

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  revenue: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'churned' | 'trial';
  joinDate: string;
  revenue: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface VisitorData {
  date: string;
  visitors: number;
  pageViews: number;
}

export interface Stat {
  label: string;
  value: string;
  change: number; // porcentaje positivo o negativo
  icon: string;
}
