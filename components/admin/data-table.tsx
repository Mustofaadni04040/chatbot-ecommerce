import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  cell: (item: T) => ReactNode;
  className?: string;
  header: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  getRowKey: (item: T) => string;
  items: T[];
}

export function DataTable<T>({
  columns,
  getRowKey,
  items,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b bg-muted/50 text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  className={`px-4 py-3 font-medium ${column.className ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={getRowKey(item)}
                className="border-b transition-colors hover:bg-muted/25 last:border-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className={`px-4 py-4 align-top ${column.className ?? ""}`}
                  >
                    {column.cell(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
