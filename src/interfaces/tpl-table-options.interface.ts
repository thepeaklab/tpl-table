import { TplTableColors } from './tpl-table-colors.interface';
import { TplTableColumn } from './tpl-table-column.interface';
import { TplTableState } from './tpl-table-state.interface';
import { TplTableRow } from './tpl-table-row.interface';

export interface TplTableOptions {
  id: string;
  initialColumns: TplTableColumn[];
  initialEntries: TplTableRow[];
  initialEntrieValuesOrder: string[];

  noDataAvailableText?: string;

  loading?: boolean;

  enableSearch?: boolean;
  searchDebounceTime?: number;
  searchPlaceholderText?: string;

  enableActionsColumn?: boolean;

  enablePagination?: boolean;
  entriesPerPageValues?: number[];
  defaultEntriesPerPageCount?: number;
  initialPageCount?: number;

  colors?: TplTableColors;

  stateObject?: TplTableState;

  setColumns?: (columns: TplTableColumn[]) => void;
  setEntries?: (entries: TplTableRow[]) => void;
  setEntrieValuesOrder?: (entrieValuesOrder: string[]) => void;
  setPageCount?: (pageCount: number) => void;
}
