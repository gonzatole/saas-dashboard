"use client";

import { useState, useTransition } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal, Search, Eye, Trash2, AlertTriangle, ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { INCIDENT_SEVERITY_LABELS } from "@/lib/constants";
import { deleteIncident, updateIncident } from "@/actions/incidents";

const SEVERITY_STYLES: Record<string, string> = {
  NEAR_MISS: "border-zinc-200 bg-zinc-50 text-zinc-600",
  MINOR: "border-yellow-200 bg-yellow-50 text-yellow-700",
  MODERATE: "border-orange-200 bg-orange-50 text-orange-700",
  SERIOUS: "border-red-200 bg-red-50 text-red-700",
  FATAL: "border-red-400 bg-red-100 text-red-900 font-semibold",
};

const STATUS_STYLES: Record<string, string> = {
  REPORTED: "border-blue-200 bg-blue-50 text-blue-700",
  INVESTIGATING: "border-amber-200 bg-amber-50 text-amber-700",
  ACTION_PENDING: "border-orange-200 bg-orange-50 text-orange-700",
  CLOSED: "border-zinc-200 bg-zinc-50 text-zinc-500",
};

const STATUS_LABELS: Record<string, string> = {
  REPORTED: "Reportado",
  INVESTIGATING: "Investigando",
  ACTION_PENDING: "Acción pendiente",
  CLOSED: "Cerrado",
};

interface IncidentRow {
  id: string;
  title: string;
  severity: string;
  status: string;
  occurredAt: Date;
  injuredCount: number;
  lostDays: number;
  area: { id: string; name: string } | null;
  reportedBy: { id: string; name: string };
  _count: { correctiveActions: number; workers: number };
}

function ActionsCell({ row }: { row: IncidentRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClose = () => {
    startTransition(async () => {
      await updateIncident(row.id, { status: "CLOSED" });
    });
  };

  const handleDelete = () => {
    if (!confirm(`¿Eliminar el incidente "${row.title}"?`)) return;
    startTransition(async () => {
      const result = await deleteIncident(row.id);
      if (!result.success) alert(result.error);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm hover:bg-accent disabled:opacity-50"
        disabled={isPending}
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => router.push(`/dashboard/incidentes/${row.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalle
        </DropdownMenuItem>
        {row.status !== "CLOSED" && (
          <DropdownMenuItem onClick={handleClose}>
            <AlertTriangle className="mr-2 h-4 w-4 text-zinc-500" />
            Cerrar incidente
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns: ColumnDef<IncidentRow>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Incidente
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.title}</p>
        <p className="text-xs text-muted-foreground">
          {row.original._count.workers > 0 && `${row.original._count.workers} trabajador(es) · `}
          {row.original._count.correctiveActions} acción(es)
        </p>
      </div>
    ),
  },
  {
    accessorKey: "severity",
    header: "Gravedad",
    cell: ({ row }) => (
      <Badge variant="outline" className={SEVERITY_STYLES[row.original.severity] ?? ""}>
        {INCIDENT_SEVERITY_LABELS[row.original.severity] ?? row.original.severity}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <Badge variant="outline" className={STATUS_STYLES[row.original.status] ?? ""}>
        {STATUS_LABELS[row.original.status] ?? row.original.status}
      </Badge>
    ),
  },
  {
    id: "area",
    header: "Área",
    cell: ({ row }) =>
      row.original.area ? (
        <span className="text-sm">{row.original.area.name}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "occurredAt",
    header: "Fecha",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.occurredAt).toLocaleDateString("es-CL")}
      </span>
    ),
  },
  {
    id: "impact",
    header: "Impacto",
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {row.original.injuredCount > 0 && (
          <span className="text-red-600">{row.original.injuredCount} herido(s)</span>
        )}
        {row.original.injuredCount > 0 && row.original.lostDays > 0 && " · "}
        {row.original.lostDays > 0 && <span>{row.original.lostDays} día(s) perdido(s)</span>}
        {row.original.injuredCount === 0 && row.original.lostDays === 0 && "Sin lesiones"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row.original} />,
  },
];

export function IncidentTable({ data }: { data: IncidentRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar incidente..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-9 max-w-xs"
        />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Sin incidentes registrados</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/incidentes/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3"
                      onClick={cell.column.id === "actions" ? (e) => e.stopPropagation() : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        {table.getFilteredRowModel().rows.length} de {data.length} incidentes
      </p>
    </div>
  );
}
