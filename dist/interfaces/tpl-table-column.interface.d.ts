import { TplTableColumnContentType } from './tpl-table-column-content-type.interface';
export interface TplTableColumn {
    name: string;
    ngIf?: () => boolean;
    editable?: boolean;
    unit?: any;
    content?: TplTableColumnContentType;
    translateColumn?: boolean;
    translateValues?: boolean;
    translateValuePrefix?: string;
    maxWidth?: string;
    maxHeight?: string;
}
