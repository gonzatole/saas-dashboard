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
  MoreHorizontal, Search, Eye, Trash2, CheckCircle2, Clock,
  ClipboardList, ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RISK_LEVEL_COLORS, INSPECTION_STATUS_LABELS } from "@/lib/constants";
import { updateInspection, deleteInspection } from "@/actions/inspections";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "border-zinc-200 bg-zinc-50 text-zinc-600",
  IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REVIEWED: "border-violet-200 bg-violet-50 text-violet-700",
};

interface InspectionRow {
  id: string;
  title: string;
  status: string;
  scheduledDate: Date | null;
  completedDate: Date | null;
  createdAt: Date;
  area: { id: string; name: string; riskLevel: string } | null;
  inspector: { id: string; name: string };
  _count: { items: number; correctiveActions: number };
}

function ActionsCell({ row }: { row: InspectionRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleComplete = () => {
    startTransition(async () => {
      await updateInspection(row.id, { status: "COMPLETED" });
    });
  };

  const handleDelete = () => {
    if (!confirm(`¿Eliminar la inspección "${row.title}"?`)) return;
    startTransition(async () => {
      const result = await deleteInspection(row.id);
      if (!result.success) alert(result.error);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-medium hover:bg-accent disabled:opacity-50"
        disabled={isPending}
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => router.push(`/dashboard/inspecciones/${row.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalle
        </DropdownMenuItem>
        {row.status === "IN_PROGRESS" && (
          <DropdownMenuItem onClick={handleComplete}>
            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />
            Marcar completada
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns: ColumnDef<InspectionRow>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Inspección
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.title}</p>
        <p className="text-xs text-muted-foreground">
          {row.original._count.items} ítem(s) · {row.original._count.correctiveActions} acción(es)
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={STATUS_STYLES[row.original.status] ?? ""}
      >
        {INSPECTION_STATUS_LABELS[row.original.status] ?? row.original.status}
      </Badge>
    ),
  },
  {
    id: "area",
    header: "Área",
    cell: ({ row }) => {
      const area = row.original.area;
      if (!area) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
            RISK_LEVEL_COLORS[area.riskLevel]
          )}
        >
          {area.name}
        </span>
      );
    },
  },
  {
    id: "date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.original.scheduledDate ?? row.original.createdAt;
      return (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {new Date(date).toLocaleDateString("es-CL")}
        </div>
      );
    },
  },
  {
    id: "inspector",
    header: "Inspector",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.inspector.name}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row.original} />,
  },
];

export function InspectionTable({ data }: { data: InspectionRow[] }) {
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
          placeholder="Buscar inspección..."
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
                  <th
                    key={h.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
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
                  <ClipboardList className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">No hay inspecciones</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/inspecciones/${row.original.id}`)}
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
        {table.getFilteredRowModel().rows.length} de {data.length} inspecciones
      </p>
    </div>
  );
}
