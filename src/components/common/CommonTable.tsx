import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "./Skeletons";
import { EmptyState } from "./EmptyState";

export interface ColumnDef<T = any> {
  accessorKey: string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  maxSize?: string;
}

export interface CommonTableProps<T = any> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  getRowKey?: (row: T, index: number) => string;
}

export function CommonTable<T = any>({
  columns,
  data,
  isLoading = false,
  emptyIcon,
  emptyTitle = "No data",
  emptyDescription = "No records found",
  emptyAction,
  getRowKey = (_row, index) => index.toString(),
}: CommonTableProps<T>) {
  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.accessorKey}
              className={column.maxSize ? `w-[${column.maxSize}]` : ""}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={getRowKey(row, index)}>
            {columns.map((column) => (
              <TableCell key={`${getRowKey(row, index)}-${column.accessorKey}`}>
                {column.cell
                  ? column.cell(row)
                  : (row as any)[column.accessorKey]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
