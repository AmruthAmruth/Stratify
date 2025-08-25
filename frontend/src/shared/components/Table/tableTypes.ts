interface Column {
  key: string;
  label: string;
}

interface RowData {
  [key: string]: string | number | boolean | null;
}

 interface TableProps {
  columns: { key: string; label: string }[];
  data: Record<string, any>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  renderCell?: (row: Record<string, any>, key: string) => React.ReactNode; 
}

export type { TableProps, Column, RowData };
