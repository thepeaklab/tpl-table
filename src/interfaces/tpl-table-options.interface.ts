import { TplTableColors } from './tpl-table-colors.interface';
import { TplTableColumn } from './tpl-table-column.interface';
import { TplTablePage } from './tpl-table-page.interface';
import { TplTableRow } from './tpl-table-row.interface';

export interface TplTableOptions {
  id: string;
  initialColumns: TplTableColumn[];
  initialEntries: TplTableRow[];
  initialEntrieValuesOrder: string[];

  loading?: boolean;
  enableSearch?: boolean;
  searchPlaceholderText?: string;
  noDataAvailableText?: string;
  enableActionsColumn?: boolean;
  enablePagination?: boolean;
  entriesPerPageValues?: number[];
  defaultEntriesPerPageCount?: number;
  initialPageCount?: number;
  colors?: TplTableColors;

  pageObj?: TplTablePage;

  setColumns?: (columns: TplTableColumn[]) => void;
  setEntries?: (entries: TplTableRow[]) => void;
  setEntrieValuesOrder?: (entrieValuesOrder: string[]) => void;
  setPageCount?: (pageCount: number) => void;
}
