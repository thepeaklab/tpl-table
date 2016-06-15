export interface TplTableColumn {
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
