interface Column {
  key: string;
  label: string;
}

interface RowData {
  [key: string]: string | number | boolean | null;
}

interface TableProps {
  columns: Column[];
  data: RowData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export type { TableProps, Column, RowData };
