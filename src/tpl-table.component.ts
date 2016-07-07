import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { Subject } from 'rxjs/Rx';

import { FocusMeDirective } from './helper';
import { TplTableCallback, TplTableColors, TplTableColumn, TplTableColumnContentType, TplTableOptions, TplTablePageChangeModel, TplTablePageSizeChangeModel, TplTableRow, TplTableSearchChangeModel, TplTableStateBeforeDetail, TplTableStateBeforeSearch } from './interfaces';
import { LoadingPointsComponent } from './loading-points';
import { CheckmarkPipe, ToRangePipe } from './pipes';
import { TplTableService } from './tpl-table.service';

const MAX_PAGINATION_BUTTONS: number = 5;

let vm: TplTableComponent;

@Component({
  selector: 'tpl-table',
  template: `
    <div *ngIf="optionsValidationSuccess">
      <div class="top-row">
        <div *ngIf="enablePagination && entriesPerPageCount" class="elementsperside__select prettyselect">
          <select [ngModel]="entriesPerPageCount" [ngStyle]="{'color': colors.secondaryColor}" (ngModelChange)="oldEntriesPerPageCount = entriesPerPageCount; setEntriesPerPageCount(entriesPerPageCount, true, oldEntriesPerPageCount)" class="top-row__entry-count input-sm">
            <template ngFor let-range [ngForOf]="entriesPerPageValues">
              <option *ngIf="range" [value]="range">{{range}}</option>
            </template>
          </select>
        </div><span *ngIf="enablePagination && entriesPerPageCount" class="elementsperside__label">{{ 'TABLE_ENTRIES_PER_SITE' | translate }} {{dataOrder}}</span>
        <form *ngIf="enableSearch" (ngSubmit)="setSearch(searchInput, true)">
          <input type="text" [ngModel]="searchInput" [placeholder]="searchPlaceholderText|translate" class="top-row__search"/>
        </form>
      </div>
      <table class="tpltable">
        <thead class="tpltable__head">
          <tr>
            <template ngFor let-column [ngForOf]="columns">
              <th *ngIf="column && (!column.ngIf || column.ngIf())">
                <span *ngIf="!column.translateColumn">{{column.name}}</span>
                <span *ngIf="column.translateColumn">{{column.name | translate}}</span>
              </th>
            </template>
            <th *ngIf="enableActionsColumn" class="edit">Aktionen</th>
          </tr>
        </thead>
        <tbody class="tpltable__body">
          <tr *ngIf="!entries || !entries.length || opts.loading" class="tpltable__row--placeholder">
            <td [colSpan]="entrieValuesOrder.length + (enableActionsColumn ? 1 : 0)"><span *ngIf="!opts.loading">{{noDataAvailableText | translate}}</span>
              <loading-points *ngIf="opts.loading"></loading-points>
            </td>
          </tr>
          <template ngFor let-row [ngForOf]="entries" let-rowindex="index">
            <tr *ngIf="entries && entries.length && !opts.loading && row">
              <template ngFor let-cell [ngForOf]="entrieValuesOrder" let-cellindex="index">
                <td (mouseleave)="hover=false" (mouseenter)="hover=true" [ngStyle]="{'background-color': editableCell[0]===rowindex && colors.primaryColor, 'color': editableCell[0]===rowindex && colors.primaryFontColor}" [class.clickable]="rowClick$?.observers?.length" [class.notclickable]="!rowClick$?.observers?.length || editableCell[0]!==null" (click)="!rowClick$?.observers?.length || editableCell[0]!==null || onRowClick({$index: rowindex})">
                  <div *ngIf="cell && columns && (!columns[cellindex].ngIf || columns[cellindex].ngIf())">
                    <div *ngIf="(editableCell[0]!==rowindex || editableCell[1]!==cellindex || !columns[cellindex].editable)">
                      <div *ngIf="columns[cellindex].content === POSSIBLE_CONTENT_TYPES[0]" class="cell__text"><span *ngIf="!columns[cellindex].translateValues">{{(cell.indexOf('.') !== -1 ? getCellValue(row, cell) : row[cell]) | checkmark}}</span><span *ngIf="columns[cellindex].translateValues">{{((columns[cellindex].translateValuePrefix ? columns[cellindex].translateValuePrefix : '') + (cell.indexOf('.') !== -1 ? getCellValue(row, cell) : row[cell])) | translate}}</span></div>
                      <div *ngIf="columns[cellindex].content === POSSIBLE_CONTENT_TYPES[1]" class="cell__image"><img [src]="row[cell]" [ngStyle]="{'max-width': columns[cellindex].maxWidth ? columns[cellindex].maxWidth : '250px', 'max-height': columns[cellindex].maxHeight ? columns[cellindex].maxHeight : '250px'}"/></div>
                    </div>
                    <!---<span *ngIf="editableCell[1]===cellindex && editableCell[0]===rowindex && columns[cellindex].editable">
                      <input type="text" [ngModel]="tempEditColumnCopy[cell]" [focus-me=]"editableCell[1]===cellindex && editableCell[0]===rowindex" (click)="$event.stopPropagation()" (keyup)="$event.keyCode == 13 && saveEditedColumn()" class="edit-input"/>
                    </span>
                    <div *ngIf="columns[cellindex].editable && hover" (click)="toggleEditCell($event, rowindex, cellindex)" [ngStyle]="{'background-color': hoverEdit && colors.primaryColor, 'color': hoverEdit && colors.primaryFontColor}" (mouseenter)="hoverEdit=true" (mouseleave)="hoverEdit=false" class="cell-controll edit">
                      <div *ngIf="hover" class="iconfont tbl-iconfont-pen"></div>
                    </div>
                    <div *ngIf="columns[cellindex].editable && editableCell[0]===rowindex && editableCell[1]===cellindex" [ngStyle]="{'background-color': colors.secondaryColor, 'color': colors.secondaryFontColor}" (click)="hover=false;saveEditedColumn()" class="cell-controll save">
                      <div class="iconfont iconfont-check"></div>
                    </div>--->
                  </div>
                </td>
              </template>
              <td *ngIf="enableActionsColumn" class="edit"><span *ngIf="assign$?.observers?.length" (click)="!assign$?.observers?.length || editableCell[0]!==null || onAssign({$index: rowindex})" class="tbl-iconfont tbl-iconfont-export"></span><span *ngIf="edit$?.observers?.length" (click)="!edit$?.observers?.length || editableCell[0]!==null || onEdit({$index: rowindex})" class="tbl-iconfont tbl-iconfont-pen"></span><span *ngIf="delete$?.observers?.length" (click)="!delete$?.observers?.length || editableCell[0]!==null || onDelete({$index: rowindex})" class="tbl-iconfont tbl-iconfont-delete"></span><span *ngIf="add$?.observers?.length" (click)="!add$?.observers?.length || editableCell[0] !== null || onAdd({$index: rowindex})" class="icon icon-cal-button"></span><span *ngIf="confirm$?.observers?.length" (click)="!confirm$?.observers?.length || editableCell[0]!=null || onConfirm({$index: rowindex})" class="iconfont iconfont-check"></span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div *ngIf="enablePagination && paginationModel && paginationStart !== 1 && paginationEnd !== 1" class="bottom-row">
        <div class="paginator">
          <div *ngIf="paginationStart < paginationEnd" [class.inactive]="paginationModel === 1" [ngStyle]="handleFirstPaginatorStyles()" [attr.disabled]="paginationModel === 1" (click)="setPage(1, true)" (mouseenter)="pageFirstHover=true" (mouseleave)="pageFirstHover=false" class="paginator__first">{{'TABLE_PAGING_START'|translate}}</div>
          <div *ngIf="paginationStart > 1" (click)="skipPagesBackward()" [ngStyle]="handleMidPaginatorStyles()" (mouseenter)="pageMid1Hover=true" (mouseleave)="pageMid1Hover=false" class="paginator__mid">...</div>
          <template ngFor let-i [ngForOf]="[paginationStart, paginationEnd] | toRange">
            <div *ngIf="i" [class.active]="i === paginationModel" (click)="setPage(i, true)" [ngStyle]="handleMid2PaginatorStyles(i)" (mouseenter)="pageMidHover=true" (mouseleave)="pageMidHover=false" class="paginator__mid">{{i}}</div>
          </template>
          <div *ngIf="paginationEnd < pageCount" (click)="skipPagesForward()" [ngStyle]="handleMid3PaginatorStyles()" (mouseenter)="pageMid2Hover=true" (mouseleave)="pageMid2Hover=false" class="paginator__mid">...</div>
          <div *ngIf="paginationStart < paginationEnd" [class.inactive]="paginationModel === pageCount" [ngStyle]="handleMid4PaginatorStyles()" [attr.disabled]="paginationModel === pageCount" (click)="setPage(pageCount, true)" (mouseenter)="pageLastHover=true" (mouseleave)="pageLastHover=false" class="paginator__last">{{'TABLE_PAGING_END'|translate}}</div>
        </div>
      </div>
    </div>
  `,
  directives: [FocusMeDirective, LoadingPointsComponent],
  providers: [TplTableService],
  pipes: [CheckmarkPipe, ToRangePipe, TranslatePipe]
})
export class TplTableComponent implements OnDestroy, OnInit {
  ////////////
  // INPUTS //
  ////////////
  @Input('tplTableOptions') opts: TplTableOptions;
  ////////////////
  // END INPUTS //
  ////////////////


  /////////////
  // OUTPUTS //
  /////////////
  @Output() pageChange = new EventEmitter<TplTablePageChangeModel>();
  @Output() pageSizeChange = new EventEmitter<TplTablePageSizeChangeModel>();
  @Output() searchChange = new EventEmitter<TplTableSearchChangeModel>();
  /////////////////
  // END OUTPUTS //
  /////////////////


  /////////////////
  // OBSERVABLES //
  /////////////////

  ///////////////////////////////
  // ACTIONS IN ACTIONS COLUMN //
  ///////////////////////////////
  add$: Subject<TplTableCallback>;
  assign$: Subject<TplTableCallback>;
  confirm$: Subject<TplTableCallback>;
  delete$: Subject<TplTableCallback>;
  edit$: Subject<TplTableCallback>;
  ///////////////////////////////////
  // END ACTIONS IN ACTIONS COLUMN //
  ///////////////////////////////////

  rowClick$: Subject<TplTableCallback>;
  /////////////////////
  // END OBSERVABLES //
  /////////////////////


  colors: TplTableColors;
  columns: TplTableColumn[];
  editableCell: number[];
  enableActionsColumn: boolean;
  enablePagination: boolean;
  enableSearch: boolean;
  entries: TplTableRow[];
  entriesPerPageValues: number[];
  entrieValuesOrder: string[];
  hover: boolean;
  hoverEdit: boolean;
  id: string;
  noDataAvailableText: string;
  oldEntriesPerPageCount: number;
  optionsValidationSuccess: boolean;
  pageFirstHover: boolean;
  pageLastHover: boolean;
  pageMidHover: boolean;
  pageMid1Hover: boolean;
  pageMid2Hover: boolean;
  paginationStart: number;
  paginationEnd: number;
  POSSIBLE_CONTENT_TYPES: TplTableColumnContentType[];
  searchInput: string;
  searchPlaceholderText: string;
  tempEditColumnCopy: any;

  private entriesPerPageCount: number;
  private paginationModel: number;
  private pageCount: number;
  private searchModel: string;

  // private $log: any;

  constructor(
    // @Inject(DOCUMENT) private $document: any,
    private tplTableService: TplTableService
  ) {
    vm = this;

    // this.$log = console.log; // TODO: check if there is a better solution, maybe a native angular service; otherwise write your own service

    this.editableCell = [null, null];
    this.POSSIBLE_CONTENT_TYPES = [TplTableColumnContentType.TEXT, TplTableColumnContentType.IMAGE];
  }

  ///////////
  // HOOKS //
  ///////////
  ngOnInit() {
    if (this.checkOptions()) {
      this.tplTableService.addTable(_.cloneDeep(this.opts));

      if (this.restoreTableStateBeforeDestroying() && this.pageChange) {
        this.onPageChange({ new: this.paginationModel, old: this.paginationModel }); //TODO: find a better way
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
    this.add$.next(index);
  }

  onAssign(index: TplTableCallback) {
    this.assign$.next(index);
  }

  onConfirm(index: TplTableCallback) {
    this.confirm$.next(index);
  }

  onDelete(index: TplTableCallback) {
    this.delete$.next(index);
  }

  onEdit(index: TplTableCallback) {
    this.edit$.next(index);
  }

  onPageChange(model: TplTablePageChangeModel) {
    this.pageChange.next(model);
  }

  onPageSizeChange(model: TplTablePageSizeChangeModel) {
    this.pageSizeChange.next(model);
  }

  onRowClick(index: TplTableCallback) {
    this.rowClick$.next(index);
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
    if (this.paginationModel !== 1 && !this.pageFirstHover) {
      return {'color': this.colors.secondaryColor};
    }

    if (this.paginationModel !== 1 && this.pageFirstHover) {
      return {'color': this.colors.secondaryColor, 'background-color': this.colors.primaryColor};
    }

    return {};
  }

  handleMidPaginatorStyles(): any {
    if (this.pageMid1Hover) {
      return {'color': this.colors.secondaryColor, 'background-color': this.colors.primaryColor};
    }
    return {'color': this.colors.secondaryColor};
  }

  handleMid2PaginatorStyles(page: number): any {
    if (page !== this.paginationModel && !this.pageMidHover) {
      return {'color': this.colors.secondaryColor};
    }

    if (page !== this.paginationModel && this.pageMidHover) {
      return {'background-color': this.colors.primaryColor, 'color': this.colors.secondaryColor};
    }

    return {'color': this.colors.secondaryFontColor, 'background-color': this.colors.secondaryColor};
  }

  handleMid3PaginatorStyles(): any {
    if (this.pageMid2Hover) {
      return {'color': this.colors.secondaryColor, 'background-color': this.colors.primaryColor};
    }

    return {'color': this.colors.secondaryColor};
  }

  handleMid4PaginatorStyles(): any {
    if (this.paginationModel !== this.pageCount && !this.pageLastHover) {
      return {'color': this.colors.secondaryColor};
    }

    if (this.paginationModel !== this.pageCount && this.pageLastHover) {
      return {'color': this.colors.secondaryColor, 'background-color': this.colors.primaryColor};
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

    this.tempEditColumnCopy = angular.copy(vm.entries[rowIndex]);
    angular.forEach(this.tempEditColumnCopy, (value, key) => {
      if (value === '-' || value === '--' || value === '---') {
        this.tempEditColumnCopy[key] = null;
      }
    });

    this.$document.find('body').bind('click', this.resetEdit);
  }

  saveEditedColumn() {
    this.entries[this.editableCell[0]] = this.tempEditColumnCopy;

    this.$rootScope.$emit('tpltable.datarow.edited.' + this.id,
      this.editableCell[0],
      this.entries[this.editableCell[0]]
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
    let calculatedPage: number = vm.paginationModel + MAX_PAGINATION_BUTTONS;
    if (calculatedPage > vm.pageCount) {
      calculatedPage = vm.pageCount;
    }

    this.setPage(calculatedPage, true);
  }

  skipPagesBackward() {
    let calculatedPage: number = vm.paginationModel - MAX_PAGINATION_BUTTONS;
    if (calculatedPage <= 0) {
      calculatedPage = 1;
    }

    this.setPage(calculatedPage, true);
  }

  setEntriesPerPageCount(entriesPerPageCount: number, callback?: boolean, old?: number) {
    let oldEntriesPerPageCount = old || this.entriesPerPageCount;
    this.entriesPerPageCount = entriesPerPageCount;

    this.handleEntriesPerPageCount(this.entriesPerPageCount, oldEntriesPerPageCount);

    if (callback && this.pageSizeChange && this.entriesPerPageCount !== oldEntriesPerPageCount) {
      this.onPageSizeChange({new: this.entriesPerPageCount, old: oldEntriesPerPageCount});
    }
  }

  setPage(page: number, callback?: boolean) {
    let old = this.paginationModel;
    this.paginationModel = page;

    this.refreshPagination();
    this.resetEdit();

    if (callback && this.pageChange && this.paginationModel !== old) {
      this.onPageChange({new: this.paginationModel, old: old});
    }
  }

  setSearch(search: string, callback?: boolean) {
    let old = this.searchModel;

    if (search) {
      this.searchModel = search;
      this.searchInput = search;
    } else {
      this.searchModel = this.searchInput;
    }

    this.resetEdit();

    this.handleSearchChange(this.searchModel, old);

    if (callback && this.searchChange && this.searchModel !== old) {
      this.onSearchChange({new: this.searchModel, old: old});
    }
  }
  //////////////////////////
  // END PUBLIC FUNCTIONS //
  //////////////////////////


  ////////////
  // HELPER //
  ////////////
  private checkOptions(): boolean {
    if (this.opts) {
      //////////
      // MAIN //
      //////////
      if (!this.opts.id || !this.opts.id.length) {
        console.error('The option id is required');
        return false;
      }
      this.id = this.opts.id;

      this.opts.loading = this.opts.loading !== null && this.opts.loading !== undefined ? this.opts.loading : false;


      ////////////
      // SEARCH //
      ////////////
      this.enableSearch = this.opts.enableSearch !== null && this.opts.enableSearch !== undefined ? this.opts.enableSearch : false;
      this.searchPlaceholderText = this.opts.searchPlaceholderText || 'TABLE_SEARCH';


      ////////////////
      // PAGINATION //
      ////////////////
      this.enablePagination = this.opts.enablePagination !== null && this.opts.enablePagination !== undefined ? this.opts.enablePagination : false;
      this.entriesPerPageValues = this.opts.entriesPerPageValues || [10, 25, 50, 100];
      this.entriesPerPageCount = this.opts.defaultEntriesPerPageCount && this.entriesPerPageValues.indexOf(this.opts.defaultEntriesPerPageCount) > -1 ? this.opts.defaultEntriesPerPageCount : 10;
      this.oldEntriesPerPageCount = this.entriesPerPageCount;
      this.pageCount = this.opts.initialPageCount || 1;

      this.paginationStart = 1;
      this.paginationEnd = 1;


      ////////////////
      // TABLE DATA //
      ////////////////
      this.noDataAvailableText = this.opts.noDataAvailableText || 'No Data Available ...';

      if (!this.opts.initialColumns || !this.opts.initialColumns.length) {
        console.error('The option initialColumns is required');
        return false;
      }
      this.columns = this.opts.initialColumns;
      this.columns.forEach(column => {
        if (!column.content) {
          column.content = TplTableColumnContentType.TEXT;
        }
      });

      if (!this.opts.initialEntries || !this.opts.initialEntries.length) {
        console.error('The option initialEntries is required');
        return false;
      }
      this.entries = this.opts.initialEntries;

      if (!this.opts.initialEntrieValuesOrder || !this.opts.initialEntrieValuesOrder.length) {
        console.error('The option initialEntrieValuesOrder is required');
        return false;
      }
      this.entrieValuesOrder = this.opts.initialEntrieValuesOrder;


      /////////////////
      // TABLE STYLE //
      /////////////////
      this.colors = this.opts.colors || {};
      this.colors.primaryColor = this.opts.colors && this.opts.colors.primaryColor || '#e8f7fe';
      this.colors.secondaryColor = this.opts.colors && this.opts.colors.secondaryColor || '#004894';
      this.colors.primaryFontColor = this.opts.colors && this.opts.colors.primaryFontColor || '#333333';
      this.colors.secondaryFontColor = this.opts.colors && this.opts.colors.secondaryFontColor || '#ffffff';


      ///////////////////
      // TABLE ACTIONS //
      ///////////////////
      this.enableActionsColumn = this.opts.enableActionsColumn !== null && this.opts.enableActionsColumn !== undefined ? this.opts.enableActionsColumn : false;

      /////////////////
      // OBSERVABLES //
      /////////////////
      this.add$ = new Subject<TplTableCallback>();
      this.assign$ = new Subject<TplTableCallback>();
      this.confirm$ = new Subject<TplTableCallback>();
      this.delete$ = new Subject<TplTableCallback>();
      this.edit$ = new Subject<TplTableCallback>();
      this.rowClick$ = new Subject<TplTableCallback>();
      /////////////////////
      // END OBSERVABLES //
      /////////////////////


      ////////////
      // HELPER //
      ////////////
      this.opts.setColumns = this.setColumns;
      this.opts.setEntries = this.setEntries;
      this.opts.setEntrieValuesOrder = this.setEntrieValuesOrder;
      this.opts.setPageCount = this.setPageCount;


      this.optionsValidationSuccess = true;
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

      if (this.paginationModel !== 1) {
        this.setPage(1);
      }
    } else if ((newVal === '' || !newVal)) { // Search ended
      this.restoreTableStateBeforeSearch();
    } else if (newVal !== oldVal) { // New search after search started
      if (this.paginationModel !== 1) {
        this.setPage(1);
      }
    } // Init or returned to list
  }

  private saveTableStateBeforeSearch() {
    this.tplTableService.setStateBeforeSearch(this.id, {
      pageBeforeSearch: this.paginationModel - 1,
      entriesPerPageCountBeforeSearch: this.entriesPerPageCount
    });
  }

  private restoreTableStateBeforeSearch() {
    const state = this.tplTableService.getStateBeforeSearch(this.id);
    if (state) {
      if (state.pageBeforeSearch >= 0) {
        if (state.entriesPerPageCountBeforeSearch) {
          this.setEntriesPerPageCount(state.entriesPerPageCountBeforeSearch);
        }

        this.setPage(state.pageBeforeSearch + 1);

        this.tplTableService.setStateBeforeSearch(this.id, {
          pageBeforeSearch: null,
          entriesPerPageCountBeforeSearch: null
        });
      }
    }
  }

  private saveTableStateBeforeDestroying() {
    this.tplTableService.setStateBeforeDetail(this.id, {
      actualPage: this.paginationModel - 1,
      actualSearch: this.searchModel,
      actualEntriesPerPageCount: this.entriesPerPageCount
    });
  }

  private restoreTableStateBeforeDestroying(): boolean {
    const stateBeforeDetail = this.tplTableService.getStateBeforeDetail(this.id);
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

      this.tplTableService.setStateBeforeDetail(this.id, {
        actualPage: null,
        actualSearch: null,
        actualEntriesPerPageCount: null
      });

      return true;
    }
    return false;
  }

  private refreshPagination() {
    let calculatedStart: number = vm.paginationModel - ((MAX_PAGINATION_BUTTONS - 1) / 2);
    if (calculatedStart > 0) {
      vm.paginationStart = calculatedStart;
    } else {
      vm.paginationStart = 1;
    }

    let calculatedEnd: number = vm.paginationModel + ((MAX_PAGINATION_BUTTONS - 1) / 2);
    if (calculatedEnd <= vm.pageCount && (calculatedEnd - vm.paginationStart) === 5) {
      vm.paginationEnd = calculatedEnd;
    } else if (vm.paginationStart + (MAX_PAGINATION_BUTTONS - 1) <= vm.pageCount) {
      vm.paginationEnd = vm.paginationStart + (MAX_PAGINATION_BUTTONS - 1);
    } else {
      vm.paginationEnd = vm.pageCount;
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

  /////////////////////////////
  // CALLED BY TABLE SERVICE //
  /////////////////////////////
  private setColumns(columns: TplTableColumn[]) {
    if (columns && columns.length) {
      vm.columns = columns;
      vm.columns.forEach((column: TplTableColumn) => {
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

  private setEntries(entries: TplTableRow[]) {
    if (entries && entries.length) {
      vm.entries = entries;
    }
  }

  private setEntrieValuesOrder(entrieValuesOrder: string[]) {
    if (entrieValuesOrder && entrieValuesOrder.length) {
      vm.entrieValuesOrder = entrieValuesOrder;
    }
  }

  private setPageCount(pageCount: number) {
    vm.pageCount = pageCount;

    vm.refreshPagination();
    vm.resetEdit();
  }
  /////////////////////////////////
  // END CALLED BY TABLE SERVICE //
  /////////////////////////////////

  ////////////////
  // END HELPER //
  ////////////////
}
