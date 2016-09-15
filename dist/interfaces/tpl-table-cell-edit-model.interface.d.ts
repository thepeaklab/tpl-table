import { TplTableRow } from './tpl-table-row.interface';
export interface TplTableCellEditModel {
    rowIndex: number;
    columnIndex: number;
    newValue: TplTableRow;
    oldValue: TplTableRow;
}
