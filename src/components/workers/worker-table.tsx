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
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal, ArrowUpDown, Search, UserCheck, UserX, Trash2, Edit3,
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
import { RISK_LEVEL_COLORS, RISK_LEVEL_LABELS } from "@/lib/constants";
import { toggleWorkerStatus, deleteWorker } from "@/actions/workers";

interface WorkerRow {
  id: string;
  rut: string;
  name: string;
  lastName: string;
  position: string;
  department: string | null;
  isActive: boolean;
  area: { id: string; name: string; riskLevel: string } | null;
}

interface WorkerTableProps {
  data: WorkerRow[];
}

function ActionsCell({ worker }: { worker: WorkerRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleWorkerStatus(worker.id);
    });
  };

  const handleDelete = () => {
    if (!confirm(`¿Eliminar a ${worker.name} ${worker.lastName}? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      const result = await deleteWorker(worker.id);
      if (!result.success) alert(result.error);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        disabled={isPending}
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => router.push(`/dashboard/trabajadores/${worker.id}`)}>
          <Edit3 className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleToggle}>
          {worker.isActive ? (
            <><UserX className="mr-2 h-4 w-4" /> Desactivar</>
          ) : (
            <><UserCheck className="mr-2 h-4 w-4" /> Activar</>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns: ColumnDef<WorkerRow>[] = [
  {
    accessorKey: "rut",
    header: "RUT",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.rut}</span>
    ),
  },
  {
    id: "fullName",
    accessorFn: (row) => `${row.name} ${row.lastName}`,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nombre
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name} {row.original.lastName}</p>
        {row.original.department && (
          <p className="text-xs text-muted-foreground">{row.original.department}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "position",
    header: "Cargo",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.position}</span>
    ),
  },
  {
    id: "area",
    header: "Área",
    cell: ({ row }) => {
      const area = row.original.area;
      if (!area) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <div className="flex items-center gap-1.5">
          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border", RISK_LEVEL_COLORS[area.riskLevel])}>
            {area.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={row.original.isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-zinc-50 text-zinc-500"
        }
      >
        {row.original.isActive ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell worker={row.original} />,
  },
];

export function WorkerTable({ data }: WorkerTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, RUT, cargo..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-9 max-w-xs"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                  No se encontraron trabajadores
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
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
        {table.getFilteredRowModel().rows.length} de {data.length} trabajadores
      </p>
    </div>
  );
}
