import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import * as _ from 'lodash';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { Subject, Subscription } from 'rxjs/Rx';

import { FocusMeDirective } from './helper';
import { TplTableCallback, TplTableCellEditModel, TplTableColors, TplTableColumn, TplTableColumnContentType, TplTableOptions, TplTablePageChangeModel, TplTablePageSizeChangeModel, TplTableRow, TplTableSearchChangeModel, TplTableStateBeforeDetail, TplTableStateBeforeSearch } from './interfaces';
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
          <select [ngModel]="entriesPerPageCount" [ngStyle]="{'color': colors.secondaryColor}" (ngModelChange)="oldEntriesPerPageCount = entriesPerPageCount; setEntriesPerPageCount($event, true, oldEntriesPerPageCount)" class="top-row__entry-count input-sm">
            <template ngFor let-range [ngForOf]="entriesPerPageValues">
              <option *ngIf="range" [value]="range">{{range}}</option>
            </template>
          </select>
          <span *ngIf="enablePagination && entriesPerPageCount" class="elementsperside__label">{{ 'TABLE_ENTRIES_PER_SITE' | translate }} {{dataOrder}}</span>
        </div>
        <div *ngIf="enableSearch">
          <div class="input-group">
            <input type="search" [formControl]="searchControl" [placeholder]="searchPlaceholderText|translate" class="top-row__search" [disabled]="opts.loading">
            <span class="input-group-addon" [class.action]="searchControl.value" (click)="searchControl.value && onResetSearch()">
              <span *ngIf="searchControl.value">&#x2717;</span>
            </span>
          </div>
        </div>
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
                <td (mouseleave)="hover=false" (mouseenter)="hover=true" [ngStyle]="{'background-color': editableCell[0] === rowindex && colors.primaryColor, 'color': editableCell[0] === rowindex && colors.primaryFontColor}" [class.clickable]="rowClick$?.observers?.length" [class.notclickable]="!rowClick$?.observers?.length || editableCell[0] !== null" (click)="!rowClick$?.observers?.length || editableCell[0] !== null || onRowClick({$index: rowindex})">
                  <div *ngIf="cell && columns && (!columns[cellindex].ngIf || columns[cellindex].ngIf())">
                    <div *ngIf="(editableCell[0]!==rowindex || editableCell[1]!==cellindex || !columns[cellindex].editable)">
                      <div *ngIf="columns[cellindex].content === POSSIBLE_CONTENT_TYPES[0]" class="cell__text"><span *ngIf="!columns[cellindex].translateValues">{{(cell.indexOf('.') !== -1 ? getCellValue(row, cell) : row[cell]) | checkmark}}</span><span *ngIf="columns[cellindex].translateValues">{{((columns[cellindex].translateValuePrefix ? columns[cellindex].translateValuePrefix : '') + (cell.indexOf('.') !== -1 ? getCellValue(row, cell) : row[cell])) | translate}}</span></div>
                      <div *ngIf="columns[cellindex].content === POSSIBLE_CONTENT_TYPES[1]" class="cell__image"><img [src]="row[cell]" [ngStyle]="{'max-width': columns[cellindex].maxWidth ? columns[cellindex].maxWidth : '250px', 'max-height': columns[cellindex].maxHeight ? columns[cellindex].maxHeight : '250px'}"/></div>
                    </div>
                    <span *ngIf="editableCell[1] === cellindex && editableCell[0] === rowindex && columns[cellindex].editable">
                      <input type="text" [(ngModel)]="tmpEditedCellData[cell]" [focusMe]="editableCell[1] === cellindex && editableCell[0] === rowindex" (click)="$event.stopPropagation()" (keyup.enter)="saveEditedCellData()" class="edit-input">
                    </span>
                    <div *ngIf="columns[cellindex].editable && hover" (click)="toggleCellEditing($event, rowindex, cellindex)" [ngStyle]="{'background-color': hoverEdit && colors.primaryColor, 'color': hoverEdit && colors.primaryFontColor}" (mouseenter)="hoverEdit=true" (mouseleave)="hoverEdit=false" class="cell-controll edit">
                      <div class="iconfont tbl-iconfont-pen"></div>
                    </div>
                    <div *ngIf="columns[cellindex].editable && editableCell[0] === rowindex && editableCell[1] === cellindex">
                      <div [ngStyle]="{'background-color': colors.secondaryColor, 'color': colors.secondaryFontColor}" (click)="hover=false; saveEditedCellData()" class="cell-controll save">
                        <div class="iconfont tbl-iconfont-check"></div>
                      </div>
                      <div [ngStyle]="{'background-color': colors.secondaryColor, 'color': colors.secondaryFontColor}" (click)="hover=false; resetInlineCellEdit()" class="cell-controll">
                        <div class="iconfont tbl-iconfont-cancel"></div>
                      </div>
                    </div>
                  </div>
                </td>
              </template>
              <td *ngIf="enableActionsColumn && (assign$?.observers?.length || edit$?.observers?.length || delete$?.observers?.length || add$?.observers?.length || confirm$?.observers?.length)" class="edit"><span *ngIf="assign$?.observers?.length" (click)="!assign$?.observers?.length || editableCell[0]!==null || onAssign({$index: rowindex})" class="tbl-iconfont tbl-iconfont-export"></span><span *ngIf="edit$?.observers?.length" (click)="!edit$?.observers?.length || editableCell[0]!==null || onEdit({$index: rowindex})" class="tbl-iconfont tbl-iconfont-pen"></span><span *ngIf="delete$?.observers?.length" (click)="!delete$?.observers?.length || editableCell[0]!==null || onDelete({$index: rowindex})" class="tbl-iconfont tbl-iconfont-delete"></span><span *ngIf="add$?.observers?.length" (click)="!add$?.observers?.length || editableCell[0] !== null || onAdd({$index: rowindex})" class="icon icon-cal-button"></span><span *ngIf="confirm$?.observers?.length" (click)="!confirm$?.observers?.length || editableCell[0]!=null || onConfirm({$index: rowindex})" class="iconfont tbl-iconfont-check"></span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div *ngIf="enablePagination && paginationModel && paginationEnd !== 1" class="bottom-row">
        <div class="paginator">
          <div *ngIf="paginationStart < paginationEnd" [class.inactive]="paginationModel === 1" [ngStyle]="handleFirstPaginatorStyles()" [attr.disabled]="paginationModel === 1" (click)="paginationModel !== 1 && setPage(1, true)" (mouseenter)="onFirstPaginatorMouseEnter()" (mouseleave)="onFirstPaginatorMouseLeave()" class="paginator__first">
            {{'TABLE_PAGING_START'|translate}}
          </div>
          <div *ngIf="paginationStart > 1" (click)="skipPagesBackward()" [ngStyle]="handleMid1PaginatorStyles()" (mouseenter)="onMid1PaginatorMouseEnter()" (mouseleave)="onMid1PaginatorMouseLeave()" class="paginator__mid">
            ...
          </div>
          <template ngFor let-i [ngForOf]="[paginationStart, paginationEnd] | toRange">
            <div *ngIf="i" [class.active]="i === paginationModel" (click)="i !== paginationModel && setPage(i, true)" [ngStyle]="handleMidPaginatorStyles(i)" (mouseenter)="onMidPaginatorMouseEnter()" (mouseleave)="onMidPaginatorMouseLeave()" class="paginator__mid">
              {{i}}
            </div>
          </template>
          <div *ngIf="paginationEnd < pageCount" (click)="skipPagesForward()" [ngStyle]="handleMid2PaginatorStyles()" (mouseenter)="onMid2PaginatorMouseEnter()" (mouseleave)="onMid2PaginatorMouseLeave()" class="paginator__mid">
            ...
          </div>
          <div *ngIf="paginationStart < paginationEnd" [class.inactive]="paginationModel === pageCount" [ngStyle]="handleLastPaginatorStyles()" [attr.disabled]="paginationModel === pageCount" (click)="paginationModel < pageCount && setPage(pageCount, true)" (mouseenter)="onLastPaginatorMouseEnter()" (mouseleave)="onLastPaginatorMouseLeave()" class="paginator__last">
            {{'TABLE_PAGING_END'|translate}}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    /* IE */
    input[type=text]::-ms-clear { display: none; width: 0; height: 0; }
    input[type=text]::-ms-reveal { display: none; width: 0; height: 0; }

    /* CHROME */
    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration { display: none; }

    .action {
      cursor: pointer;
    }
    `
  ],
  directives: [
    FocusMeDirective,
    FORM_DIRECTIVES,
    LoadingPointsComponent,
    REACTIVE_FORM_DIRECTIVES
  ],
  providers: [
    TplTableService
  ],
  pipes: [
    CheckmarkPipe,
    ToRangePipe,
    TranslatePipe
  ]
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

  inlineCellEdit$: Subject<TplTableCellEditModel>;

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
  searchControl: FormControl;
  searchPlaceholderText: string;
  tmpEditedCellData: TplTableRow;

  private entriesPerPageCount: number;
  private log: Console;
  private paginationModel: number;
  private pageCount: number;
  private searchControlValueChangesSubscription: Subscription;
  private searchModel: string;

  constructor(
    // @Inject(DOCUMENT) private $document: any,
    private tplTableService: TplTableService
  ) {
    vm = this;

    this.log = console; // TODO: check if there is a better solution, maybe a native angular service; otherwise write your own service

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
        this.onPageChange({ new: this.paginationModel, old: this.paginationModel }); //TODO: check if this is necessary
      }

      this.refreshPagination();
      this.resetInlineCellEdit();
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

  ////////////
  // EVENTS //
  ////////////
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

  private onInlineCellEdit(model: TplTableCellEditModel) {
    this.inlineCellEdit$.next(model);
  }

  private onPageChange(model: TplTablePageChangeModel) {
    this.pageChange.next(model);
  }

  private onPageSizeChange(model: TplTablePageSizeChangeModel) {
    this.pageSizeChange.next(model);
  }

  onResetSearch() {
    if (this.searchControlValueChangesSubscription) {
      this.searchControlValueChangesSubscription.unsubscribe();
    }

    this.enableSearch = false;
    this.setupSearch();
    setTimeout(() => { this.enableSearch = true; }, 0);

    this.setSearch(undefined, true);
  }

  onRowClick(index: TplTableCallback) {
    this.rowClick$.next(index);
  }

  private onSearchChange(model: TplTableSearchChangeModel) {
    this.searchChange.next(model);
  }
  ////////////////
  // END EVENTS //
  ////////////////

  //////////////////
  // MOUSE EVENTS //
  //////////////////
  onFirstPaginatorMouseEnter() {
    this.log.info('onFirstPaginatorMouseEnter');
    this.pageFirstHover = true;
  }

  onFirstPaginatorMouseLeave() {
    this.log.info('onFirstPaginatorMouseLeave');
    this.pageFirstHover = false;
  }

  onMid1PaginatorMouseEnter() {
    this.log.info('onMid1PaginatorMouseEnter');
    this.pageMid1Hover = true;
  }

  onMid1PaginatorMouseLeave() {
    this.log.info('onMid1PaginatorMouseLeave');
    this.pageMid1Hover = false;
  }

  onMidPaginatorMouseEnter() {
    this.log.info('onMidPaginatorMouseEnter');
    this.pageMidHover = true;
  }

  onMidPaginatorMouseLeave() {
    this.log.info('onMidPaginatorMouseLeave');
    this.pageMidHover = false;
  }

  onMid2PaginatorMouseEnter() {
    this.log.info('onMid2PaginatorMouseEnter');
    this.pageMid2Hover = true;
  }

  onMid2PaginatorMouseLeave() {
    this.log.info('onMid2PaginatorMouseLeave');
    this.pageMid2Hover = false;
  }

  onLastPaginatorMouseEnter() {
    this.log.info('onLastPaginatorMouseEnter');
    this.pageLastHover = true;
  }

  onLastPaginatorMouseLeave() {
    this.log.info('onLastPaginatorMouseLeave');
    this.pageLastHover = false;
  }
  //////////////////////
  // END MOUSE EVENTS //
  //////////////////////

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

  handleMid1PaginatorStyles(): any {
    if (this.pageMid1Hover) {
      return {'color': this.colors.secondaryColor, 'background-color': this.colors.primaryColor};
    }
    return {'color': this.colors.secondaryColor};
  }

  handleMidPaginatorStyles(page: number): any { // TODO: not working properly
    if (page !== this.paginationModel && !this.pageMidHover) {
      return {'color': this.colors.secondaryColor, 'cursor': 'pointer'};
    }

    if (page !== this.paginationModel && this.pageMidHover) {
      return {'background-color': this.colors.primaryColor, 'color': this.colors.secondaryColor, 'cursor': 'pointer'};
    }

    return {'color': this.colors.secondaryFontColor, 'background-color': this.colors.secondaryColor};
  }

  handleMid2PaginatorStyles(): any {
    if (this.pageMid2Hover) {
      return {'color': this.colors.secondaryColor, 'background-color': this.colors.primaryColor};
    }

    return {'color': this.colors.secondaryColor};
  }

  handleLastPaginatorStyles(): any {
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

  ////////////////////
  // INLINE EDITING //
  ////////////////////
  toggleCellEditing(event: Event, rowIndex: number, columnIndex: number) {
    event.stopPropagation();

    this.editableCell[0] = rowIndex;
    this.editableCell[1] = columnIndex;

    this.tmpEditedCellData = _.cloneDeep(this.entries[rowIndex]);
    for (let key in this.tmpEditedCellData) {
      if (this.tmpEditedCellData[key] === '-' || this.tmpEditedCellData[key] === '--' || this.tmpEditedCellData[key] === '---') {
        this.tmpEditedCellData[key] = null;
      }
    }
  }

  saveEditedCellData() {
    const OLD_ROW = this.entries[this.editableCell[0]];
    const NEW_ROW = this.tmpEditedCellData;

    this.onInlineCellEdit({rowIndex: this.editableCell[0], columnIndex: this.editableCell[1], newValue: NEW_ROW, oldValue: OLD_ROW});

    this.resetInlineCellEdit();
  }
  ////////////////////////
  // END INLINE EDITING //
  ////////////////////////

  getCellValue(row: TplTableRow, cell: string): any {
    const LEVELS: string[] = cell.split('.');
    const LEVELS_MAP: { [levelNumber: number]: () => {} } = {
      2: (): any => {
        return row[LEVELS[0]] ? row[LEVELS[0]][LEVELS[1]] : '-';
      },
      3: (): any => {
        return row[LEVELS[0]] ? (row[LEVELS[0]][LEVELS[1]] ? row[LEVELS[0]][LEVELS[1]][LEVELS[2]] : '-') : '-';
      },
      4: (): any => {
        return row[LEVELS[0]] ? (row[LEVELS[0]][LEVELS[1]] ? (row[LEVELS[0]][LEVELS[1]][LEVELS[2]] ? row[LEVELS[0]][LEVELS[1]][LEVELS[2]][LEVELS[3]] : '-') : '-') : '-';
      }
    };

    return LEVELS_MAP[LEVELS.length] ? LEVELS_MAP[LEVELS.length]() : '';
  }

  ////////////////
  // PAGINATION //
  ////////////////
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
    let oldEntriesPerPageCount = +old || this.entriesPerPageCount;
    this.entriesPerPageCount = +entriesPerPageCount;

    this.handleEntriesPerPageCount(this.entriesPerPageCount, oldEntriesPerPageCount);

    if (callback && this.pageSizeChange && this.entriesPerPageCount !== oldEntriesPerPageCount) {
      this.onPageSizeChange({new: this.entriesPerPageCount, old: oldEntriesPerPageCount});
    }
  }

  setPage(page: number, callback?: boolean) {
    let old = this.paginationModel;
    this.paginationModel = page;

    this.refreshPagination();
    this.resetInlineCellEdit();

    if (callback && this.pageChange && this.paginationModel !== old) {
      this.onPageChange({new: this.paginationModel, old: old});
    }
  }
  ////////////////////
  // END PAGINATION //
  ////////////////////

  setSearch(search: string, callback?: boolean) {
    let old = this.searchModel;

    this.searchModel = search;

    this.resetInlineCellEdit();

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
        this.log.error('The option id is required');
        return false;
      }
      this.id = this.opts.id;

      this.opts.loading = this.opts.loading !== null && this.opts.loading !== undefined ? this.opts.loading : false;


      ////////////
      // SEARCH //
      ////////////
      this.enableSearch = this.opts.enableSearch !== null && this.opts.enableSearch !== undefined ? this.opts.enableSearch : false;
      if (this.enableSearch) {
        this.setupSearch();
      }
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
        this.log.error('The option initialColumns is required');
        return false;
      }
      this.columns = this.opts.initialColumns;
      this.columns.forEach(column => {
        if (!column.content) {
          column.content = TplTableColumnContentType.TEXT;
        }
      });

      if (!this.opts.initialEntries || !this.opts.initialEntries.length) {
        this.log.error('The option initialEntries is required');
        return false;
      }
      this.entries = this.opts.initialEntries;

      if (!this.opts.initialEntrieValuesOrder || !this.opts.initialEntrieValuesOrder.length) {
        this.log.error('The option initialEntrieValuesOrder is required');
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
      this.inlineCellEdit$ = new Subject<TplTableCellEditModel>();
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

  private setupSearch() {
    this.searchControl = new FormControl('');

    this.searchControlValueChangesSubscription = this.searchControl
      .valueChanges
      .debounceTime(this.opts.searchDebounceTime || 1000)
      .subscribe(value => {
        this.setSearch(value, true);
      });
  }

  private handleEntriesPerPageCount(newVal: number, oldVal: number) {
    if ((newVal || newVal === 0) && newVal !== oldVal) {
      this.setPage(1);
    }
  }

  private handleSearchChange(newVal: string, oldVal: string) {
    if ((oldVal === '' || !oldVal) && newVal && newVal.length && newVal !== oldVal) { // Search started
      this.saveTableStateBeforeSearch();

      if (this.paginationModel !== 1) {
        this.setPage(1);
      }
    } else if ((newVal === '' || !newVal) && newVal !== oldVal) { // Search ended
      this.restoreTableStateBeforeSearch();
    } else if (newVal && oldVal && newVal.length && oldVal.length && newVal !== oldVal) { // New search after search started
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
    let paginationStart: number;
    let paginationEnd: number;

    let calculatedStart: number = vm.paginationModel - ((MAX_PAGINATION_BUTTONS - 1) / 2);
    if (calculatedStart > 0) {
      paginationStart = calculatedStart;
    } else {
      paginationStart = 1;
    }

    let calculatedEnd: number = vm.paginationModel + ((MAX_PAGINATION_BUTTONS - 1) / 2);
    if (calculatedEnd <= vm.pageCount && (calculatedEnd - paginationStart) === 5) {
      paginationEnd = calculatedEnd;
    } else if (paginationStart + (MAX_PAGINATION_BUTTONS - 1) <= vm.pageCount) {
      paginationEnd = paginationStart + (MAX_PAGINATION_BUTTONS - 1);
    } else {
      paginationEnd = vm.pageCount;
    }

    if (paginationStart !== vm.paginationStart) {
      vm.paginationStart = paginationStart;
    }

    if (paginationEnd !== vm.paginationEnd) {
      vm.paginationEnd = paginationEnd;
    }
  }

  private resetInlineCellEdit(event?: Event) {
    setTimeout(() => { // TODO: check if there is a native angular service for that
      this.editableCell[0] = null;
      this.editableCell[1] = null;

      this.tmpEditedCellData = null;

      // if (event) { // TODO: check if this is necessary
      //   event.stopPropagation();
      // }
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
    vm.resetInlineCellEdit();
  }
  /////////////////////////////////
  // END CALLED BY TABLE SERVICE //
  /////////////////////////////////

  ////////////////
  // END HELPER //
  ////////////////
}
