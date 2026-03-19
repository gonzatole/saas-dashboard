import { Sidebar } from '@/components/layout/sidebar';

// Layout compartido por todas las páginas del dashboard
// Patrón: sidebar fijo a la izquierda + área de contenido scrollable a la derecha
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar: sólo visible en desktop, se oculta en móvil */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Área principal: scrollable */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
