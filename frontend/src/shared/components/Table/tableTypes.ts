import React from "react";

interface Column {
  key: string;
  label: string;
}

// Base row data interface - allows for any additional properties
interface RowData {
  id: string;
  [key: string]: unknown;
}

interface TableAction {
  label: string;
  type?: "edit" | "delete" | "approve" | "custom";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (row: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disabled?: boolean | ((row: any) => boolean);
}

interface TableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderCell?: (row: any, key: string) => React.ReactNode;
  actions?: TableAction[];
  emptyStateMessage?: string;
}

export type { TableProps, Column, RowData, TableAction };
