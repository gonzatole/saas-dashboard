import type { Product, Customer, RevenueData, VisitorData } from '@/types';

// ─── Datos de Revenue (12 meses) ──────────────────────────────────────────────
export const revenueData: RevenueData[] = [
  { month: 'Ene', revenue: 18500, expenses: 9200, profit: 9300 },
  { month: 'Feb', revenue: 22300, expenses: 10100, profit: 12200 },
  { month: 'Mar', revenue: 19800, expenses: 9800, profit: 10000 },
  { month: 'Abr', revenue: 26400, expenses: 11200, profit: 15200 },
  { month: 'May', revenue: 31200, expenses: 12500, profit: 18700 },
  { month: 'Jun', revenue: 28900, expenses: 11800, profit: 17100 },
  { month: 'Jul', revenue: 34500, expenses: 13200, profit: 21300 },
  { month: 'Ago', revenue: 38200, expenses: 14100, profit: 24100 },
  { month: 'Sep', revenue: 41700, expenses: 15600, profit: 26100 },
  { month: 'Oct', revenue: 44300, expenses: 16200, profit: 28100 },
  { month: 'Nov', revenue: 48295, expenses: 17800, profit: 30495 },
  { month: 'Dic', revenue: 52100, expenses: 18500, profit: 33600 },
];

// ─── Datos de Visitantes (30 días) ────────────────────────────────────────────
export const visitorData: VisitorData[] = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1} Mar`,
  visitors: Math.floor(Math.random() * 800) + 400,
  pageViews: Math.floor(Math.random() * 2400) + 1200,
}));

// ─── Productos mock ───────────────────────────────────────────────────────────
export const products: Product[] = [
  { id: 'p1', name: 'SaaS Dashboard Pro', category: 'Templates', price: 149, stock: 999, sales: 324, revenue: 48276, status: 'active', createdAt: '2025-01-15' },
  { id: 'p2', name: 'E-Commerce Starter', category: 'Templates', price: 99, stock: 999, sales: 215, revenue: 21285, status: 'active', createdAt: '2025-02-01' },
  { id: 'p3', name: 'ML Dashboard Kit', category: 'Components', price: 79, stock: 999, sales: 187, revenue: 14773, status: 'active', createdAt: '2025-02-20' },
  { id: 'p4', name: 'Admin Panel Ultra', category: 'Templates', price: 199, stock: 999, sales: 98, revenue: 19502, status: 'active', createdAt: '2025-03-01' },
  { id: 'p5', name: 'Landing Page Pack', category: 'Components', price: 49, stock: 999, sales: 312, revenue: 15288, status: 'active', createdAt: '2025-03-10' },
  { id: 'p6', name: 'React Component Library', category: 'Libraries', price: 89, stock: 999, sales: 145, revenue: 12905, status: 'draft', createdAt: '2025-03-15' },
  { id: 'p7', name: 'Auth Boilerplate Pro', category: 'Boilerplates', price: 129, stock: 999, sales: 76, revenue: 9804, status: 'active', createdAt: '2025-03-18' },
  { id: 'p8', name: 'API Starter Kit', category: 'Boilerplates', price: 69, stock: 999, sales: 223, revenue: 15387, status: 'active', createdAt: '2025-03-19' },
  { id: 'p9', name: 'Mobile UI Kit', category: 'Components', price: 59, stock: 999, sales: 156, revenue: 9204, status: 'archived', createdAt: '2024-12-01' },
  { id: 'p10', name: 'Next.js Mega Starter', category: 'Boilerplates', price: 179, stock: 999, sales: 89, revenue: 15931, status: 'active', createdAt: '2025-03-05' },
];

// ─── Clientes mock ────────────────────────────────────────────────────────────
export const customers: Customer[] = [
  { id: 'c1', name: 'María González', email: 'maria@techco.cl', avatar: 'MG', plan: 'enterprise', status: 'active', joinDate: '2024-11-01', revenue: 8940 },
  { id: 'c2', name: 'Carlos Rodríguez', email: 'carlos@startup.io', avatar: 'CR', plan: 'pro', status: 'active', joinDate: '2025-01-15', revenue: 2352 },
  { id: 'c3', name: 'Ana Martínez', email: 'ana@devagency.com', avatar: 'AM', plan: 'pro', status: 'active', joinDate: '2025-02-03', revenue: 1764 },
  { id: 'c4', name: 'Luis Pérez', email: 'luis@ecomm.pe', avatar: 'LP', plan: 'enterprise', status: 'active', joinDate: '2024-12-10', revenue: 11760 },
  { id: 'c5', name: 'Sara Vega', email: 'sara@design.co', avatar: 'SV', plan: 'free', status: 'trial', joinDate: '2025-03-10', revenue: 0 },
  { id: 'c6', name: 'Pedro Silva', email: 'pedro@agency.br', avatar: 'PS', plan: 'pro', status: 'active', joinDate: '2025-01-28', revenue: 2940 },
  { id: 'c7', name: 'Laura Castro', email: 'laura@saasco.mx', avatar: 'LC', plan: 'enterprise', status: 'active', joinDate: '2024-10-05', revenue: 17640 },
  { id: 'c8', name: 'Diego Torres', email: 'diego@dev.ar', avatar: 'DT', plan: 'pro', status: 'churned', joinDate: '2025-01-01', revenue: 588 },
  { id: 'c9', name: 'Valeria Núñez', email: 'valeria@startup.cl', avatar: 'VN', plan: 'free', status: 'trial', joinDate: '2025-03-15', revenue: 0 },
  { id: 'c10', name: 'Roberto Morales', email: 'roberto@tech.uy', avatar: 'RM', plan: 'pro', status: 'active', joinDate: '2025-02-20', revenue: 1176 },
];

// ─── KPI Stats ────────────────────────────────────────────────────────────────
export const kpiStats = {
  totalRevenue: { value: '$48,295', change: +23.5 },
  activeUsers: { value: '2,847', change: +12.3 },
  newCustomers: { value: '+124', change: +8.7 },
  conversionRate: { value: '3.24%', change: -0.4 },
};

// ─── Traffic Sources (Pie Chart) ──────────────────────────────────────────────
export const trafficSources = [
  { name: 'Orgánico', value: 4821 },
  { name: 'Directo', value: 2843 },
  { name: 'Social', value: 1932 },
  { name: 'Email', value: 1247 },
  { name: 'Referidos', value: 892 },
];
