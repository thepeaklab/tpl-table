declare namespace tpl.table {
  interface TplTableRow {
    [key: string]: any;
  }

  interface TplTableColumn {
    ngIf?: () => boolean;
    name: string;
    editable?: boolean;
    unit?: any;
    content: string; // TODO: enum
    translateColumn?: boolean;
    translateValues?: boolean;
    translateValuePrefix?: string;
    maxWidth?: string;
    maxHeight?: string;
  }

  interface TplTableColors {
    primaryColor?: string;
    secondaryColor?: string;
    primaryFontColor?: string;
    secondaryFontColor?: string;
  }

  interface TplTablePage {
    actualPage: number;
    actualSearch: string;
    actualEntriesPerPageCount: number;
    pageBeforeSearch: number;
    entriesPerPageCountBeforeSearch: number;
  }

  interface TplTableOptions {
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

  interface TplTableStateBeforeDetail {
    actualSearch: string;
    actualPage: number;
    actualEntriesPerPageCount: number;
  }

  interface TplTableStateBeforeSearch {
    pageBeforeSearch: number;
    entriesPerPageCountBeforeSearch: number;
  }

  class TplTableService {
    addTable(newTableOpts: TplTableOptions);
    setColumns(tableId: string, columns: TplTableColumn[]);
    setPageCount(tableId: string, pageCount: number);
    getStateBeforeDetail(id: string): TplTableStateBeforeDetail;
    setStateBeforeDetail(id: string, state: TplTableStateBeforeDetail);
    getStateBeforeSearch(id: string): TplTableStateBeforeSearch;
    setStateBeforeSearch(id: string, stateBeforeSearch: TplTableStateBeforeSearch);
  }

  interface TplTablePageChangeModel {
    model: { new: number, old: number };
  }

  interface TplTablePageSizeChangeModel {
    model: { new: number, old: number };
  }

  interface TplTableSearchChangeModel {
    model: { new: string, old: string };
  }

  class TplTableCtrl {
    editableCell: number[];
    entriesPerPageCount: number;
    onPageChange: (TplTablePageChangeModel) => {};
    onPageSizeChange: (TplTablePageSizeChangeModel) => {};
    onSearchChange: (TplTableSearchChangeModel) => {};
    opts: TplTableOptions;
    paginationStart: number;
    paginationEnd: number;
    POSSIBLE_CONTENT_TYPES: string[];
    POSSIBLE_RANGE_VALUES: number[];
    searchInput: string;
    tempEditColumnCopy: any;
    tplTableOptions: TplTableOptions;

    toggleEditCell(event: Event, rowIndex: number, columnIndex: number);
    saveEditedColumn();
    getCellValue(row: TplTableRow, cell: string): any;
    skipPagesForward();
    skipPagesBackward();
    setEntriesPerPageCount(entriesPerPageCount: number, callback?: boolean, old?: number);
    setPage(page: number, callback?: boolean);
    setSearch(search: string, callback?: boolean);
  }
}

declare module "tpl-table" {
  export const LoadingPointsModule: angular.IModule;
  export const TplTableModule: angular.IModule;

  export type TplTableRow = tpl.table.TplTableRow;
  export type TplTableColumn = tpl.table.TplTableColumn;
  export type TplTableColors = tpl.table.TplTableColors;
  export type TplTablePage = tpl.table.TplTablePage;
  export type TplTableOptions = tpl.table.TplTableOptions;
  export type TplTableStateBeforeDetail = tpl.table.TplTableStateBeforeDetail;
  export type TplTableStateBeforeSearch = tpl.table.TplTableStateBeforeSearch;
  export type TplTableService = tpl.table.TplTableService;
  export type TplTablePageChangeModel = tpl.table.TplTablePageChangeModel;
  export type TplTablePageSizeChangeModel = tpl.table.TplTablePageSizeChangeModel;
  export type TplTableSearchChangeModel = tpl.table.TplTableSearchChangeModel;
  export type TplTableCtrl = tpl.table.TplTableCtrl;
}
