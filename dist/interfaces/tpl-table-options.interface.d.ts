import { TplTableColors } from './tpl-table-colors.interface';
import { TplTableColumn } from './tpl-table-column.interface';
import { TplTablePage } from './tpl-table-page.interface';
import { TplTableRow } from './tpl-table-row.interface';
export interface TplTableOptions {
    id: string;
    loading?: boolean;
    searchPlaceholderText?: string;
    noDataAvailableText?: string;
    showActionsColumn?: boolean;
    searchModel?: string;
    showPagination?: boolean;
    paginationModel?: number;
    pageCount?: number;
    entriesPerPageCount?: number;
    entries: TplTableRow[];
    entrieValuesOrder: string[];
    columns: TplTableColumn[];
    colors?: TplTableColors;
    pageObj?: TplTablePage;
    setPageCount?: (pageCount: number) => void;
    setColumns?: (columns: TplTableColumn[]) => void;
}
