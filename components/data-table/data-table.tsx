"use client";

import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "./data-table-pagination";
import { Columns4, Download, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define an interface for export configuration with custom functions
interface ExportConfig<TData> {
  csv?: {
    enabled?: boolean;
    fileName?: string;
    exportFunction?: (data: TData[]) => void;
  };
  excel?: {
    enabled?: boolean;
    fileName?: string;
    exportFunction?: (data: TData[]) => void;
  };
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Optional export configuration
  exportConfig?: ExportConfig<TData>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  exportConfig,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  });

  // Default export to Excel function (uses XLSX) but can be overridden
  const exportToExcel = () => {
    if (exportConfig?.excel?.exportFunction) {
      // Use the custom function provided from props
      exportConfig.excel.exportFunction(data);
    } else {
      // Default XLSX export
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      XLSX.writeFile(wb, exportConfig?.excel?.fileName || "employee_data.xlsx");
    }
  };

  // Default export to CSV function, which can be overridden via exportConfig
  // Default export to CSV function (uses XLSX) but can be overridden
  const exportToCSV = () => {
    if (exportConfig?.csv?.exportFunction) {
      // Use the custom function provided from props
      exportConfig.csv.exportFunction(data);
    } else {
      // Default XLSX export to CSV
      const ws = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportConfig?.csv?.fileName || "employee_data.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  // Determine if the export buttons should be shown (default: true)
  const showExcelExport =
    exportConfig?.excel?.enabled !== undefined ? exportConfig.excel.enabled : false;
  const showCSVExport =
    exportConfig?.csv?.enabled !== undefined ? exportConfig.csv.enabled : false;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center py-6">
        <Input
          placeholder="Search..."
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm mb-4 sm:mb-0"
        />
        <div className="flex-1 flex justify-end space-x-2 mt-4 sm:mt-0">
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size={"btnIcon"}
                    className="focus-visible:ring-0"
                  >
                    <Columns4 className="!size-6" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Column Visibility</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      checked={column.getIsVisible()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {showExcelExport && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"secondary"}
                  size={"btnIcon"}
                  className="focus-visible:ring-0"
                  onClick={exportToExcel}
                >
                  <FileDown className="!size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export to Excel</p>
              </TooltipContent>
            </Tooltip>
          )}

{showCSVExport && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"secondary"}
                  size={"btnIcon"}
                  className="focus-visible:ring-0"
                  onClick={exportToCSV}
                >
                  <Download className="!size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export to CSV</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <ScrollArea className="h-[420px] rounded-md border mb-6 w-full">
        <ScrollBar orientation="vertical" />
        <Table className="relative">
          <TableHeader className="bg-[#f6f6f6] sticky z-20 top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`w-full `}
                      style={{ width: header.getSize() }}
                    >
                      <>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {/* <ColumnFilter column={header.column} /> */}
                      </>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-16 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <DataTablePagination table={table} />
    </>
  );
}
