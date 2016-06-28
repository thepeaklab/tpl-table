import { TplTableColumnContentType } from './tpl-table-column-content-type.interface';

export interface TplTableColumn {
  ngIf?: () => boolean;
  name: string;
  editable?: boolean;
  unit?: any;
  content: TplTableColumnContentType;
  translateColumn?: boolean;
  translateValues?: boolean;
  translateValuePrefix?: string;
  maxWidth?: string;
  maxHeight?: string;
}
