import { TplTableColumn, TplTableOptions, TplTableStateBeforeDetail, TplTableStateBeforeSearch } from './interfaces';
export declare class TplTableService {
    private tables;
    constructor();
    addTable(newTableOpts: TplTableOptions): void;
    setColumns(tableId: string, columns: TplTableColumn[]): void;
    setPageCount(tableId: string, pageCount: number): void;
    setStateBeforeDetail(id: string, state: TplTableStateBeforeDetail): void;
    getStateBeforeDetail(id: string): TplTableStateBeforeDetail;
    setStateBeforeSearch(id: string, stateBeforeSearch: TplTableStateBeforeSearch): void;
    getStateBeforeSearch(id: string): TplTableStateBeforeSearch;
}
