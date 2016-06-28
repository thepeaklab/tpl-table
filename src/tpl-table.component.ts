import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';

import { FocusMeDirective } from './helper';
import { TplTableCallback, TplTableColumn, TplTableColumnContentType, TplTableOptions, TplTablePageChangeModel, TplTablePageSizeChangeModel, TplTableRow, TplTableSearchChangeModel, TplTableStateBeforeDetail, TplTableStateBeforeSearch } from './interfaces';
import { LoadingPointsComponent } from './loading-points';
import { CheckmarkPipe, ToRangePipe, TranslatePipe } from './pipes';
import { TplTableService } from './tpl-table.service';

const CONTENT_TYPE_TEXT: number = 0;
const MAX_PAGINATION_BUTTONS: number = 5;

let vm: TplTableComponent;

@Component({
  selector: 'tpl-table',
  template: `
    <div *ngIf="opts">
      <div class="top-row">
        <div *ngIf="opts.entriesPerPageCount && opts.showPagination" class="elementsperside__select prettyselect">
          <select [ngModel]="opts.entriesPerPageCount" [ngStyle]="{'color': opts.colors.secondaryColor}" (ngModelChange)="entriesPerPageCount = opts.entriesPerPageCount; setEntriesPerPageCount(opts.entriesPerPageCount, true, entriesPerPageCount)" class="top-row__entry-count input-sm">
            <template ngFor let-range [ngForOf]="POSSIBLE_RANGE_VALUES">
              <option *ngIf="range" [value]="range">range</option>
            </template>
          </select>
        </div><span *ngIf="opts.entriesPerPageCount && opts.showPagination" class="elementsperside__label">{{ 'TABLE_ENTRIES_PER_SITE' | translate }} {{dataOrder}}</span>
        <form *ngIf="opts.searchModel!==null" (ngSubmit)="setSearch(searchInput, true)">
          <input type="text" [ngModel]="searchInput" [placeholder]="opts.searchPlaceholderText|translate" class="top-row__search"/>
        </form>
      </div>
      <table class="tpltable">
        <thead class="tpltable__head">
          <tr>
            <template ngFor let-column [ngForOf]="opts.columns">
              <th *ngIf="column && (!column.ngIf || column.ngIf())">
                <span *ngIf="!column.translateColumn">{{column.name}}</span>
                <span *ngIf="column.translateColumn">{{column.name | translate}}</span>
              </th>
            </template>
            <th *ngIf="opts.showActionsColumn" class="edit">Aktionen</th>
          </tr>
        </thead>
        <tbody class="tpltable__body">
          <tr *ngIf="!opts.entries || !opts.entries.length || opts.loading" class="tpltable__row--placeholder">
            <td [colSpan]="opts.entrieValuesOrder.length + (opts.showActionsColumn ? 1 : 0)"><span *ngIf="!opts.loading">{{opts.noDataAvailableText | translate}}</span>
              <loadingpoints *ngIf="opts.loading"></loadingpoints>
            </td>
          </tr>
          <template ngFor let-row [ngForOf]="opts.entries" let-rowindex="index">
            <tr *ngIf="opts.entries && opts.entries.length && row">
              <template ngFor let-cell [ngForOf]="opts.entrieValuesOrder" let-cellindex="index">
                <td (mouseleave)="hover=false" (mouseenter)="hover=true" [ngStyle]="{'background-color': editableCell[0]===rowindex && opts.colors.primaryColor, 'color': editableCell[0]===rowindex && opts.colors.primaryFontColor}" [class.clickable]="onRowClick" [class.notclickable]="!onRowClick || editableCell[0]!==null" (click)="!onRowClick || editableCell[0]!==null || onRowClick({$index: rowindex})">
                  <div *ngIf="cell && opts.columns && (!opts.columns[cellindex].ngIf || opts.columns[cellindex].ngIf())">
                    <div *ngIf="(editableCell[0]!==rowindex || editableCell[1]!==cellindex || !opts.columns[cellindex].editable)">
                      <div *ngIf="opts.columns[cellindex].content === POSSIBLE_CONTENT_TYPES[0]" class="cell__text"><span *ngIf="!opts.columns[cellindex].translateValues">{{(cell.indexOf('.') !== -1 ? getCellValue(row, cell) : row[cell]) | checkmark}}</span><span *ngIf="opts.columns[cellindex].translateValues">{{((opts.columns[cellindex].translateValuePrefix ? opts.columns[cellindex].translateValuePrefix : '') + (cell.indexOf('.') !== -1 ? getCellValue(row, cell) : row[cell])) | translate}}</span></div>
                      <div *ngIf="opts.columns[cellindex].content === POSSIBLE_CONTENT_TYPES[1]" class="cell__image"><img [src]="row[cell]" [ngStyle]="{'max-width': opts.columns[cellindex].maxWidth ? opts.columns[cellindex].maxWidth : '250px', 'max-height': opts.columns[cellindex].maxHeight ? opts.columns[cellindex].maxHeight : '250px'}"/></div>
                    </div>
                    <!---<span *ngIf="editableCell[1]===cellindex && editableCell[0]===rowindex && opts.columns[cellindex].editable">
                      <input type="text" [ngModel]="tempEditColumnCopy[cell]" [focus-me=]"editableCell[1]===cellindex && editableCell[0]===rowindex" (click)="$event.stopPropagation()" (keyup)="$event.keyCode == 13 && saveEditedColumn()" class="edit-input"/>
                    </span>
                    <div *ngIf="opts.columns[cellindex].editable && hover" (click)="toggleEditCell($event, rowindex, cellindex)" [ngStyle]="{'background-color': hoverEdit && opts.colors.primaryColor, 'color': hoverEdit && opts.colors.primaryFontColor}" (mouseenter)="hoverEdit=true" (mouseleave)="hoverEdit=false" class="cell-controll edit">
                      <div *ngIf="hover" class="iconfont tbl-iconfont-pen"></div>
                    </div>
                    <div *ngIf="opts.columns[cellindex].editable && editableCell[0]===rowindex && editableCell[1]===cellindex" [ngStyle]="{'background-color': opts.colors.secondaryColor, 'color': opts.colors.secondaryFontColor}" (click)="hover=false;saveEditedColumn()" class="cell-controll save">
                      <div class="iconfont iconfont-check"></div>
                    </div>--->
                  </div>
                </td>
              </template>
              <td *ngIf="opts.showActionsColumn" class="edit"><span *ngIf="onAssign" (click)="!onAssign || editableCell[0]!==null || onAssign({$index: rowindex})" class="tbl-iconfont tbl-iconfont-export"></span><span *ngIf="onEdit" (click)="!onEdit || editableCell[0]!==null || onEdit({$index: rowindex})" class="tbl-iconfont tbl-iconfont-pen"></span><span *ngIf="onDelete" (click)="!onDelete || editableCell[0]!==null || onDelete({$index: rowindex})" class="tbl-iconfont tbl-iconfont-delete"></span><span *ngIf="onAdd" (click)="!onAdd || editableCell[0] !== null || onAdd({$index: rowindex})" class="icon icon-cal-button"></span><span *ngIf="onConfirm" (click)="!onConfirm || editableCell[0]!=null || onConfirm({$index: rowindex})" class="iconfont iconfont-check"></span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div *ngIf="opts.paginationModel && opts.showPagination" class="bottom-row">
        <div class="paginator">
          <div *ngIf="paginationStart < paginationEnd" [class.inactive]="opts.paginationModel === 1" [ngStyle]="handleFirstPaginatorStyles()" [attr.disabled]="opts.paginationModel === 1" (click)="setPage(1, true)" (mouseenter)="pageFirstHover=true" (mouseleave)="pageFirstHover=false" class="paginator__first">{{'TABLE_PAGING_START'|translate}}</div>
          <div *ngIf="paginationStart > 1" (click)="skipPagesBackward()" [ngStyle]="handleMidPaginatorStyles()" (mouseenter)="pageMid1Hover=true" (mouseleave)="pageMid1Hover=false" class="paginator__mid">...</div>
          <template ngFor let-i [ngForOf]="[paginationStart, paginationEnd] | toRange">
            <div *ngIf="i" [class.active]="i === opts.paginationModel" (click)="setPage(i, true)" [ngStyle]="handleMid2PaginatorStyles(i)" (mouseenter)="pageMidHover=true" (mouseleave)="pageMidHover=false" class="paginator__mid">{{i}}</div>
          </template>
          <div *ngIf="paginationEnd < opts.pageCount" (click)="skipPagesForward()" [ngStyle]="handleMid3PaginatorStyles()" (mouseenter)="pageMid2Hover=true" (mouseleave)="pageMid2Hover=false" class="paginator__mid">...</div>
          <div *ngIf="paginationStart < paginationEnd" [class.inactive]="opts.paginationModel === opts.pageCount" [ngStyle]="handleMid4PaginatorStyles()" [attr.disabled]="opts.paginationModel === opts.pageCount" (click)="setPage(opts.pageCount, true)" (mouseenter)="pageLastHover=true" (mouseleave)="pageLastHover=false" class="paginator__last">{{'TABLE_PAGING_END'|translate}}</div>
        </div>
      </div>
    </div>
  `,
  directives: [FocusMeDirective, LoadingPointsComponent],
  providers: [TplTableService],
  pipes: [CheckmarkPipe, ToRangePipe, TranslatePipe]
})
export class TplTableComponent implements OnDestroy, OnInit {
  editableCell: number[];
  entriesPerPageCount: number;
  hover: boolean;
  hoverEdit: boolean;

  @Output() add = new EventEmitter<TplTableCallback>();
  @Output() assign = new EventEmitter<TplTableCallback>();
  @Output() confirm = new EventEmitter<TplTableCallback>();
  @Output() delete = new EventEmitter<TplTableCallback>();
  @Output() edit = new EventEmitter<TplTableCallback>();
  @Output() pageChange = new EventEmitter<TplTablePageChangeModel>();
  @Output() pageSizeChange = new EventEmitter<TplTablePageSizeChangeModel>();
  @Output() rowClick = new EventEmitter<TplTableCallback>();
  @Output() searchChange = new EventEmitter<TplTableSearchChangeModel>();

  opts: TplTableOptions;
  pageFirstHover: boolean;
  pageLastHover: boolean;
  pageMidHover: boolean;
  pageMid1Hover: boolean;
  pageMid2Hover: boolean;
  paginationStart: number;
  paginationEnd: number;
  POSSIBLE_CONTENT_TYPES: TplTableColumnContentType[];
  POSSIBLE_RANGE_VALUES: number[];
  searchInput: string;
  tempEditColumnCopy: any;

  @Input() tplTableOptions: TplTableOptions;

  // private $log: any;

  constructor(
    // @Inject(DOCUMENT) private $document: any,
    private tplTableService: TplTableService
  ) {
    vm = this;

    // this.$log = console.log; // TODO: check if there is a better solution, maybe a native angular service; otherwise write your own service

    this.editableCell = [null, null];
    this.POSSIBLE_CONTENT_TYPES = [TplTableColumnContentType.TEXT, TplTableColumnContentType.IMAGE];
    this.POSSIBLE_RANGE_VALUES = [10, 25, 50, 100];
  }

  ///////////
  // HOOKS //
  ///////////
  ngOnInit() {
    if (this.checkBindings()) {
      this.tplTableService.addTable(_.cloneDeep(this.opts));

      if (this.restoreTableStateBeforeDestroying() && this.pageChange) {
        this.onPageChange({ new: this.opts.paginationModel, old: this.opts.paginationModel }); //TODO: find a better way
      }

      this.refreshPagination();
      this.resetEdit();
    }
  }

  ngOnDestroy() {
    this.saveTableStateBeforeDestroying();
  }
  ///////////////
  // END HOOKS //
  ///////////////


  //////////////////////
  // PUBLIC FUNCTIONS //
  //////////////////////

  /////////////
  // OUTPUTS //
  /////////////
  onAdd(index: TplTableCallback) {
    this.add.next(index);
  }

  onAssign(index: TplTableCallback) {
    this.assign.next(index);
  }

  onConfirm(index: TplTableCallback) {
    this.confirm.next(index);
  }

  onDelete(index: TplTableCallback) {
    this.delete.next(index);
  }

  onEdit(index: TplTableCallback) {
    this.edit.next(index);
  }

  onPageChange(model: TplTablePageChangeModel) {
    this.pageChange.next(model);
  }

  onPageSizeChange(model: TplTablePageSizeChangeModel) {
    this.pageSizeChange.next(model);
  }

  onRowClick(index: TplTableCallback) {
    this.rowClick.next(index);
  }

  onSearchChange(model: TplTableSearchChangeModel) {
    this.searchChange.next(model);
  }
  /////////////////
  // END OUTPUTS //
  /////////////////

  ////////////
  // STYLES //
  ////////////
  handleFirstPaginatorStyles(): any {
    if (this.opts.paginationModel !== 1 && !this.pageFirstHover) {
      return {'color': this.opts.colors.secondaryColor};
    }

    if (this.opts.paginationModel !== 1 && this.pageFirstHover) {
      return {'color': this.opts.colors.secondaryColor, 'background-color': this.opts.colors.primaryColor};
    }

    return {};
  }

  handleMidPaginatorStyles(): any {
    if (this.pageMid1Hover) {
      return {'color': this.opts.colors.secondaryColor, 'background-color': this.opts.colors.primaryColor};
    }
    return {'color': this.opts.colors.secondaryColor};
  }

  handleMid2PaginatorStyles(page: number): any {
    if (page !== this.opts.paginationModel && !this.pageMidHover) {
      return {'color': this.opts.colors.secondaryColor};
    }

    if (page !== this.opts.paginationModel && this.pageMidHover) {
      return {'background-color': this.opts.colors.primaryColor, 'color': this.opts.colors.secondaryColor};
    }

    return {'color': this.opts.colors.secondaryFontColor, 'background-color': this.opts.colors.secondaryColor};
  }

  handleMid3PaginatorStyles(): any {
    if (this.pageMid2Hover) {
      return {'color': this.opts.colors.secondaryColor, 'background-color': this.opts.colors.primaryColor};
    }

    return {'color': this.opts.colors.secondaryColor};
  }

  handleMid4PaginatorStyles(): any {
    if (this.opts.paginationModel !== this.opts.pageCount && !this.pageLastHover) {
      return {'color': this.opts.colors.secondaryColor};
    }

    if (this.opts.paginationModel !== this.opts.pageCount && this.pageLastHover) {
      return {'color': this.opts.colors.secondaryColor, 'background-color': this.opts.colors.primaryColor};
    }

    return {};
  }

  ////////////////
  // END STYLES //
  ////////////////

  /* toggleEditCell(event: Event, rowIndex: number, columnIndex: number) {
    event.stopPropagation();

    this.editableCell[0] = rowIndex;
    this.editableCell[1] = columnIndex;

    this.tempEditColumnCopy = angular.copy(vm.opts.entries[rowIndex]);
    angular.forEach(this.tempEditColumnCopy, (value, key) => {
      if (value === '-' || value === '--' || value === '---') {
        this.tempEditColumnCopy[key] = null;
      }
    });

    this.$document.find('body').bind('click', this.resetEdit);
  }

  saveEditedColumn() {
    this.opts.entries[this.editableCell[0]] = this.tempEditColumnCopy;

    this.$rootScope.$emit('tpltable.datarow.edited.' + this.opts.id,
      this.editableCell[0],
      this.opts.entries[this.editableCell[0]]
    );

    this.editableCell[0] = null;
    this.editableCell[1] = null;
  } */

  getCellValue(row: TplTableRow, cell: string): any {
    const LEVELS: string[] = cell.split('.');
    const LEVELS_MAP: { [levelNumber: number]: () => any } = {
      2: () => {
        return row[LEVELS[0]] ? row[LEVELS[0]][LEVELS[1]] : '-';
      },
      3: () => {
        return row[LEVELS[0]] ? (row[LEVELS[0]][LEVELS[1]] ? row[LEVELS[0]][LEVELS[1]][LEVELS[2]] : '-') : '-';
      },
      4: () => {
        return row[LEVELS[0]] ? (row[LEVELS[0]][LEVELS[1]] ? (row[LEVELS[0]][LEVELS[1]][LEVELS[2]] ? row[LEVELS[0]][LEVELS[1]][LEVELS[2]][LEVELS[3]] : '-') : '-') : '-';
      }
    };

    return LEVELS_MAP[LEVELS.length] ? LEVELS_MAP[LEVELS.length]() : '';
  }

  skipPagesForward() {
    let calculatedPage: number = vm.opts.paginationModel + MAX_PAGINATION_BUTTONS;
    if (calculatedPage > vm.opts.pageCount) {
      calculatedPage = vm.opts.pageCount;
    }

    this.setPage(calculatedPage, true);
  }

  skipPagesBackward() {
    let calculatedPage: number = vm.opts.paginationModel - MAX_PAGINATION_BUTTONS;
    if (calculatedPage <= 0) {
      calculatedPage = 1;
    }

    this.setPage(calculatedPage, true);
  }

  setEntriesPerPageCount(entriesPerPageCount: number, callback?: boolean, old?: number) {
    let oldEntriesPerPageCount = old || this.opts.entriesPerPageCount;
    this.opts.entriesPerPageCount = entriesPerPageCount;

    this.handleEntriesPerPageCount(this.opts.entriesPerPageCount, oldEntriesPerPageCount);

    if (callback && this.pageSizeChange && this.opts.entriesPerPageCount !== oldEntriesPerPageCount) {
      this.onPageSizeChange({new: this.opts.entriesPerPageCount, old: oldEntriesPerPageCount});
    }
  }

  setPage(page: number, callback?: boolean) {
    let old = this.opts.paginationModel;
    this.opts.paginationModel = page;

    this.refreshPagination();
    this.resetEdit();

    if (callback && this.pageChange && this.opts.paginationModel !== old) {
      this.onPageChange({new: this.opts.paginationModel, old: old});
    }
  }

  setSearch(search: string, callback?: boolean) {
    let old = this.opts.searchModel;

    if (search) {
      this.opts.searchModel = search;
      this.searchInput = search;
    } else {
      this.opts.searchModel = this.searchInput;
    }

    this.resetEdit();

    this.handleSearchChange(this.opts.searchModel, old);

    if (callback && this.searchChange && this.opts.searchModel !== old) {
      this.onSearchChange({new: this.opts.searchModel, old: old});
    }
  }
  //////////////////////////
  // END PUBLIC FUNCTIONS //
  //////////////////////////


  ////////////
  // HELPER //
  ////////////
  private checkBindings(): boolean {
    this.opts = this.tplTableOptions;

    if (this.opts) {
      this.opts.setPageCount = this.setPageCount;
      this.opts.setColumns = this.setColumns;

      this.opts.id = this.opts.id || 'tpltable';
      this.opts.loading = this.opts.loading !== null && this.opts.loading !== undefined ? this.opts.loading : false;
      this.opts.searchPlaceholderText = this.opts.searchPlaceholderText || 'TABLE_SEARCH';
      this.opts.noDataAvailableText = this.opts.noDataAvailableText || 'No Data Available ...';
      this.opts.showActionsColumn = this.opts.showActionsColumn !== null && this.opts.showActionsColumn !== undefined ? this.opts.showActionsColumn : false;
      this.opts.searchModel = this.opts.searchModel !== undefined ? this.opts.searchModel : null;
      this.opts.showPagination = this.opts.showPagination !== null && this.opts.showPagination !== undefined ? this.opts.showPagination : true;
      this.opts.paginationModel = this.opts.paginationModel || null;
      this.opts.pageCount = this.opts.pageCount || null;
      this.opts.entriesPerPageCount = this.opts.entriesPerPageCount || null;
      this.entriesPerPageCount = this.opts.entriesPerPageCount;
      this.opts.entries = this.opts.entries || [];
      this.opts.entrieValuesOrder = this.opts.entrieValuesOrder || null;
      this.opts.columns = this.opts.columns || [
        {
          name: '',
          editable: true,
          unit: null,
          content: TplTableColumnContentType.TEXT
        },
        {
          name: '',
          editable: true,
          unit: null,
          content: TplTableColumnContentType.TEXT
        },
        {
          name: '',
          editable: true,
          unit: null,
          content: TplTableColumnContentType.TEXT
        },
        {
          name: '',
          editable: true,
          unit: null,
          content: TplTableColumnContentType.TEXT
        }
      ];

      this.paginationStart = 1;
      this.paginationEnd = 1;
      this.opts.colors = this.opts.colors || {};
      this.opts.colors.primaryColor = this.opts.colors.primaryColor || 'e8f7fe';
      this.opts.colors.secondaryColor = this.opts.colors.secondaryColor || '004894';
      this.opts.colors.primaryFontColor = this.opts.colors.primaryFontColor || '333333';
      this.opts.colors.secondaryFontColor = this.opts.colors.secondaryFontColor || 'ffffff';

      return true;
    }
    return false;
  }

  private handleEntriesPerPageCount(newVal: number, oldVal: number) {
    if ((newVal || newVal === 0) && newVal !== oldVal) {
      this.setPage(1);
    }
  }

  private handleSearchChange(newVal: string, oldVal: string) {
    if ((oldVal === '' || !oldVal) && newVal !== oldVal) { // Search started
      this.saveTableStateBeforeSearch();

      if (this.opts.paginationModel !== 1) {
        this.setPage(1);
      }
    } else if ((newVal === '' || !newVal)) { // Search ended
      this.restoreTableStateBeforeSearch();
    } else if (newVal !== oldVal) { // New search after search started
      if (this.opts.paginationModel !== 1) {
        this.setPage(1);
      }
    } // Init or returned to list
  }

  private saveTableStateBeforeSearch() {
    this.tplTableService.setStateBeforeSearch(this.opts.id, {
      pageBeforeSearch: this.opts.paginationModel - 1,
      entriesPerPageCountBeforeSearch: this.opts.entriesPerPageCount
    });
  }

  private restoreTableStateBeforeSearch() {
    const state = this.tplTableService.getStateBeforeSearch(this.opts.id);
    if (state) {
      if (state.pageBeforeSearch >= 0) {
        if (state.entriesPerPageCountBeforeSearch) {
          this.setEntriesPerPageCount(state.entriesPerPageCountBeforeSearch);
        }

        this.setPage(state.pageBeforeSearch + 1);

        this.tplTableService.setStateBeforeSearch(this.opts.id, {
          pageBeforeSearch: null,
          entriesPerPageCountBeforeSearch: null
        });
      }
    }
  }

  private saveTableStateBeforeDestroying() {
    this.tplTableService.setStateBeforeDetail(this.opts.id, {
      actualPage: this.opts.paginationModel - 1,
      actualSearch: this.opts.searchModel,
      actualEntriesPerPageCount: this.opts.entriesPerPageCount
    });
  }

  private restoreTableStateBeforeDestroying(): boolean {
    const stateBeforeDetail = this.tplTableService.getStateBeforeDetail(this.opts.id);
    if (stateBeforeDetail) {
      const actualSearch = stateBeforeDetail.actualSearch || '';
      if (actualSearch.length) {
        this.setSearch(actualSearch);
      }

      const actualPage = Number(stateBeforeDetail.actualPage);
      if (actualPage >= 0) {
        this.setPage(stateBeforeDetail.actualPage + 1);
      }

      const actualEntriesPerPageCount = Number(stateBeforeDetail.actualEntriesPerPageCount);
      if (actualEntriesPerPageCount) {
        this.setEntriesPerPageCount(actualEntriesPerPageCount);
      }

      this.tplTableService.setStateBeforeDetail(this.opts.id, {
        actualPage: null,
        actualSearch: null,
        actualEntriesPerPageCount: null
      });

      return true;
    }
    return false;
  }

  private refreshPagination() {
    let calculatedStart: number = vm.opts.paginationModel - ((MAX_PAGINATION_BUTTONS - 1) / 2);
    if (calculatedStart > 0) {
      vm.paginationStart = calculatedStart;
    } else {
      vm.paginationStart = 1;
    }

    let calculatedEnd: number = vm.opts.paginationModel + ((MAX_PAGINATION_BUTTONS - 1) / 2);
    if (calculatedEnd <= vm.opts.pageCount && (calculatedEnd - vm.paginationStart) === 5) {
      vm.paginationEnd = calculatedEnd;
    } else if (vm.paginationStart + (MAX_PAGINATION_BUTTONS - 1) <= vm.opts.pageCount) {
      vm.paginationEnd = vm.paginationStart + (MAX_PAGINATION_BUTTONS - 1);
    } else {
      vm.paginationEnd = vm.opts.pageCount;
    }
  }

  private resetEdit(event?: Event) {
    setTimeout(() => { // TODO: check if there is a native angular service for that
      /* vm.editableCell[0] = null;
      vm.editableCell[1] = null; */
      if (event) {
        event.stopPropagation();
      }
      // vm.$document.find('body').unbind('click', vm.resetEdit); // TODO: find out how to do this in angular 2
    }, 0);
  }

  private setPageCount(pageCount: number) {
    vm.opts.pageCount = pageCount;

    vm.refreshPagination();
    vm.resetEdit();
  }

  private setColumns(columns: TplTableColumn[]) {
    vm.opts.columns = columns;

    if (vm.opts.columns && vm.opts.columns.length) {
      vm.opts.columns.forEach((column: TplTableColumn) => {
        if (column.content) {
          const CONTENT_TYPE: TplTableColumnContentType = column.content;
          if (this.POSSIBLE_CONTENT_TYPES.indexOf(CONTENT_TYPE) < 0) {
            column.content = TplTableColumnContentType.TEXT;
          } else {
            column.content = CONTENT_TYPE;
          }
        } else {
          column.content = TplTableColumnContentType.TEXT;
        }
      });
    }
  }
  ////////////////
  // END HELPER //
  ////////////////
}
