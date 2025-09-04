interface Column {
  key: string;
  label: string;
}

interface RowData {
  [key: string]: string | number | boolean | null;
}

interface TableAction {
  label: string;
  type?: "edit" | "delete" | "approve" | "custom";
  onClick: (row: RowData) => void;
}

interface TableProps {
  columns: Column[];
  data: RowData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  renderCell?: (row: RowData, key: string) => React.ReactNode;
  actions?: TableAction[]; 
}

export type { TableProps, Column, RowData, TableAction };
