import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
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
import { Loader2 } from "lucide-react";
import type { ColumnDef } from "./CommonTable";

export interface InfiniteScrollTableProps<T = any> {
  columns: ColumnDef<T>[];
  queryKey: string[];
  queryFn: (params: { page: number; limit: number; [key: string]: any }) => Promise<{
    data: T[];
    total?: number;
    hasMore?: boolean;
    nextPage?: number;
  }>;
  apiParams?: Record<string, any>;
  pageSize?: number;
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  getRowKey?: (row: T, index: number) => string;
}

export function InfiniteScrollTable<T = any>({
  columns,
  queryKey,
  queryFn,
  apiParams = {},
  pageSize = 20,
  emptyIcon,
  emptyTitle = "No data",
  emptyDescription = "No records found",
  emptyAction,
  getRowKey = (_row, index) => index.toString(),
}: InfiniteScrollTableProps<T>) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [allData, setAllData] = useState<T[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [...queryKey, apiParams],
    queryFn: async ({ pageParam = 1 }) => {
      return await queryFn({
        page: pageParam,
        limit: pageSize,
        ...apiParams,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore === false) return undefined;
      if (lastPage.nextPage) return lastPage.nextPage;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  // Combine all pages into single array
  useEffect(() => {
    if (data?.pages) {
      const combined = data.pages.flatMap((page) => page.data || []);
      setAllData(combined);
    }
  }, [data]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Error loading data"
        description="Failed to load data. Please try again."
      />
    );
  }

  if (!allData || allData.length === 0) {
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
    <div>
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
          {allData.map((row, index) => (
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

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={observerTarget} className="h-4" />
    </div>
  );
}
