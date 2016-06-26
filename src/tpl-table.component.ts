import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { CheckmarkPipe, ToRangePipe } from './filter';
import { FocusMeDirective } from './helper';
import { TplTableCallback, TplTableColumn, TplTableOptions, TplTablePageChangeModel, TplTablePageSizeChangeModel, TplTableRow, TplTableSearchChangeModel, TplTableStateBeforeDetail, TplTableStateBeforeSearch } from './interfaces';
import { LoadingPointsComponent } from './loading-points';
import { TplTableService } from './tpl-table.service';

const CONTENT_TYPE_TEXT: number = 0;
const MAX_PAGINATION_BUTTONS: number = 5;

let vm: TplTableComponent;

@Component({
  selector: 'tpl-table',
  template: `
    <div class="top-row">
      <div ng-if="opts.entriesPerPageCount && opts.showPagination" class="elementsperside__select prettyselect">
        <select ng-model="opts.entriesPerPageCount" ng-options="o as o for o in POSSIBLE_RANGE_VALUES" ng-style="{'color': opts.colors.secondaryColor}" ng-change="entriesPerPageCount = '{{opts.entriesPerPageCount}}'; setEntriesPerPageCount(opts.entriesPerPageCount, true, entriesPerPageCount)" class="top-row__entry-count input-sm"></select>
      </div><span ng-if="opts.entriesPerPageCount && opts.showPagination" class="elementsperside__label">{{ 'TABLE_ENTRIES_PER_SITE' | translate }} {{dataOrder}}</span>
      <form ng-if="opts.searchModel!==null" ng-submit="setSearch(searchInput, true)">
        <input type="text" ng-model="searchInput" placeholder="{{opts.searchPlaceholderText|translate}}" class="top-row__search"/>
      </form>
    </div>
    <table class="tpltable">
      <thead class="tpltable__head">
        <tr>
          <th ng-repeat="column in opts.columns" ng-if="!column.ngIf || column.ngIf()"><span ng-if="!column.translateColumn">{{column.name}}</span><span ng-if="column.translateColumn">{{column.name | translate}}</span></th>
          <th ng-if="opts.showActionsColumn" class="edit">Aktionen</th>
        </tr>
      </thead>
      <tbody class="tpltable__body">
        <tr ng-if="!opts.entries || !opts.entries.length || opts.loading" class="tpltable__row--placeholder">
          <td colspan="{{opts.entrieValuesOrder.length + (opts.showActionsColumn ? 1 : 0)}}"><span ng-if="!opts.loading">{{opts.noDataAvailableText | translate}}</span>
            <loadingpoints ng-if="opts.loading"></loadingpoints>
          </td>
        </tr>
        <tr ng-if="opts.entries && opts.entries.length" ng-repeat="row in opts.entries">
          <td ng-repeat="cell in opts.entrieValuesOrder" ng-mouseleave="hover=false" ng-mouseenter="hover=true" ng-style="editableCell[0]===$parent.$parent.$index && {'background-color': opts.colors.primaryColor, 'color': opts.colors.primaryFontColor}" ng-class="{'clickable': onRowClick, 'notclickable': !onRowClick || editableCell[0]!==null}" ng-click="!onRowClick || editableCell[0]!==null || onRowClick({$index: $parent.$parent.$index})" ng-if="!opts.columns[$index].ngIf || opts.columns[$index].ngIf()">
            <div ng-if="(editableCell[0]!==$parent.$parent.$parent.$index || editableCell[1]!==$index || !opts.columns[$index].editable)">
              <div ng-if="opts.columns[$index].content === POSSIBLE_CONTENT_TYPES[0]" class="cell__text"><span ng-if="!opts.columns[$index].translateValues">{{(cell.indexOf('.') !== -1 ? getCellValue(row, cell) : row[cell]) | checkmark}} {{columnValues[$index]}}</span><span ng-if="opts.columns[$index].translateValues">{{((opts.columns[$index].translateValuePrefix ? opts.columns[$index].translateValuePrefix : '') + (cell.indexOf('.') !== -1 ? getCellValue(row, cell) : row[cell])) | translate}} {{columnValues[$index]}}</span></div>
              <div ng-if="opts.columns[$index].content === POSSIBLE_CONTENT_TYPES[1]" class="cell__image"><img ng-src="{{row[cell]}}" ng-style="{'max-width': opts.columns[$index].maxWidth ? opts.columns[$index].maxWidth : '250px', 'max-height': opts.columns[$index].maxHeight ? opts.columns[$index].maxHeight : '250px'}"/></div>
            </div>
            <!---<span ng-if="editableCell[1]===$index && editableCell[0]===$parent.$index && opts.columns[$index].editable">
              <input type="text" ng-model="tempEditColumnCopy[cell]" [focus-me=]"editableCell[1]===$index && editableCell[0]===$parent.$parent.$index" ng-click="$event.stopPropagation()" ng-keyup="$event.keyCode == 13 && saveEditedColumn()" class="edit-input"/>
              {{columnValues[$index]}}
            </span>
            <div ng-if="opts.columns[$index].editable && hover" ng-click="toggleEditCell($event, $parent.$parent.$index, $index)" ng-style="hoverEdit && {'background-color': opts.colors.primaryColor, 'color': opts.colors.primaryFontColor}" ng-mouseenter="hoverEdit=true" ng-mouseleave="hoverEdit=false" class="cell-controll edit">
              <div ng-if="hover" class="iconfont tbl-iconfont-pen"></div>
            </div>
            <div ng-if="opts.columns[$index].editable && editableCell[0]===$parent.$index && editableCell[1]===$index" ng-style="{'background-color': opts.colors.secondaryColor, 'color': opts.colors.secondaryFontColor}" ng-click="$parent.hover=false;saveEditedColumn()" class="cell-controll save">
              <div class="iconfont iconfont-check"></div>
            </div>--->
          </td>
          <td ng-if="opts.showActionsColumn" class="edit"><span ng-if="onAssign" ng-click="!onAssign || editableCell[0]!==null || onAssign({$index: $index})" class="tbl-iconfont tbl-iconfont-export"></span><span ng-if="onEdit" ng-click="!onEdit || editableCell[0]!==null || onEdit({$index: $index})" class="tbl-iconfont tbl-iconfont-pen"></span><span ng-if="onDelete" ng-click="!onDelete || editableCell[0]!==null || onDelete({$index: $index})" class="tbl-iconfont tbl-iconfont-delete"></span><span ng-if="onAdd" ng-click="!onAdd || editableCell[0] !== null || onAdd({$index: $index})" class="icon icon-cal-button"></span><span ng-if="onConfirm" ng-click="!onConfirm || editableCell[0]!=null || onConfirm({$index: $index})" class="iconfont iconfont-check"></span>
          </td>
        </tr>
      </tbody>
    </table>
    <div ng-if="opts.paginationModel && opts.showPagination" class="bottom-row">
      <div class="paginator">
        <div ng-class="{'inactive': opts.paginationModel === 1}" ng-style="opts.paginationModel !== 1 && !pageFirstHover && {'color': opts.colors.secondaryColor} || opts.paginationModel !== 1 && pageFirstHover && {'color': opts.colors.secondaryColor, 'background-color': opts.colors.primaryColor}" ng-disabled="opts.paginationModel === 1" ng-click="setPage(1, true)" ng-mouseenter="pageFirstHover=true" ng-mouseleave="pageFirstHover=false" class="paginator__first">{{'TABLE_PAGING_START'|translate}}</div>
        <div ng-if="paginationStart > 1" ng-click="skipPagesBackward()" ng-style="pageMid1Hover && {'color': opts.colors.secondaryColor, 'background-color': opts.colors.primaryColor} || {'color': opts.colors.secondaryColor}" ng-mouseenter="pageMid1Hover=true" ng-mouseleave="pageMid1Hover=false" class="paginator__mid">...</div>
        <div ng-class="{'active': i === opts.paginationModel}" ng-repeat="i in [paginationStart, paginationEnd] | toRange" ng-click="setPage(i, true)" ng-style="i !== opts.paginationModel && !pageMidHover && {'color': opts.colors.secondaryColor} || i !== opts.paginationModel && pageMidHover && {'background-color': opts.colors.primaryColor, 'color': opts.colors.secondaryColor} || {'color': opts.colors.secondaryFontColor, 'background-color': opts.colors.secondaryColor}" ng-mouseenter="pageMidHover=true" ng-mouseleave="pageMidHover=false" class="paginator__mid">{{i}}</div>
        <div ng-if="paginationEnd < opts.pageCount" ng-click="skipPagesForward()" ng-style="pageMid2Hover && {'color': opts.colors.secondaryColor, 'background-color': opts.colors.primaryColor} || {'color': opts.colors.secondaryColor}" ng-mouseenter="pageMid2Hover=true" ng-mouseleave="pageMid2Hover=false" class="paginator__mid">...</div>
        <div ng-class="{'inactive': opts.paginationModel === opts.pageCount}" ng-style="opts.paginationModel !== opts.pageCount && !pageLastHover && {'color': opts.colors.secondaryColor} || opts.paginationModel !== opts.pageCount && pageLastHover && {'color': opts.colors.secondaryColor, 'background-color': opts.colors.primaryColor}" ng-disabled="opts.paginationModel === opts.pageCount" ng-click="setPage(opts.pageCount, true)" ng-mouseenter="pageLastHover=true" ng-mouseleave="pageLastHover=false" class="paginator__last">{{'TABLE_PAGING_END'|translate}}</div>
      </div>
    </div>
  `,
  directives: [FocusMeDirective, LoadingPointsComponent],
  providers: [DOCUMENT, TplTableService],
  pipes: [CheckmarkPipe, ToRangePipe]
})
export class TplTableComponent implements OnDestroy, OnInit {
  // editableCell: number[];
  entriesPerPageCount: number;

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
  paginationStart: number;
  paginationEnd: number;
  POSSIBLE_CONTENT_TYPES: string[];
  POSSIBLE_RANGE_VALUES: number[];
  searchInput: string;
  tempEditColumnCopy: any;

  @Input() tplTableOptions: TplTableOptions;

  // private $log: any;

  constructor(
    @Inject(DOCUMENT) private $document: any,
    private tplTableService: TplTableService
  ) {
    vm = this;

    // this.$log = console.log; // TODO: check if there is a better solution, maybe a native angular service; otherwise write your own service

    // this.editableCell = [null, null];
    this.POSSIBLE_CONTENT_TYPES = ['TEXT', 'IMAGE'];
    this.POSSIBLE_RANGE_VALUES = [10, 25, 50, 100];
  }

  ///////////
  // HOOKS //
  ///////////
  ngOnInit() {
    if (this.checkBindings()) {
      this.tplTableService.addTable(angular.copy(this.opts));

      if (this.restoreTableStateBeforeDestroying() && this.onPageChange) {
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

    if (callback && this.onPageSizeChange && this.opts.entriesPerPageCount !== oldEntriesPerPageCount) {
      this.onPageSizeChange({new: this.opts.entriesPerPageCount, old: oldEntriesPerPageCount});
    }
  }

  setPage(page: number, callback?: boolean) {
    let old = this.opts.paginationModel;
    this.opts.paginationModel = page;

    this.refreshPagination();
    this.resetEdit();

    if (callback && this.onPageChange && this.opts.paginationModel !== old) {
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

    if (callback && this.onSearchChange && this.opts.searchModel !== old) {
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
      this.opts.loading = this.opts.loading || false;
      this.opts.searchPlaceholderText = this.opts.searchPlaceholderText || 'TABLE_SEARCH';
      this.opts.noDataAvailableText = this.opts.noDataAvailableText || 'No Data Available ...';
      this.opts.showActionsColumn = this.opts.showActionsColumn || false;
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
          content: this.POSSIBLE_CONTENT_TYPES[CONTENT_TYPE_TEXT]
        },
        {
          name: '',
          editable: true,
          unit: null,
          content: this.POSSIBLE_CONTENT_TYPES[CONTENT_TYPE_TEXT]
        },
        {
          name: '',
          editable: true,
          unit: null,
          content: this.POSSIBLE_CONTENT_TYPES[CONTENT_TYPE_TEXT]
        },
        {
          name: '',
          editable: true,
          unit: null,
          content: this.POSSIBLE_CONTENT_TYPES[CONTENT_TYPE_TEXT]
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
      vm.$document.find('body').unbind('click', vm.resetEdit);
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
      angular.forEach(vm.opts.columns, (column: TplTableColumn) => {
        if (column.content && column.content !== '') {
          const CONTENT_STRING: string = column.content.toUpperCase();
          if (this.POSSIBLE_CONTENT_TYPES.indexOf(CONTENT_STRING) < 0) {
            column.content = this.POSSIBLE_CONTENT_TYPES[CONTENT_TYPE_TEXT];
          } else {
            column.content = CONTENT_STRING;
          }
        } else {
          column.content = this.POSSIBLE_CONTENT_TYPES[CONTENT_TYPE_TEXT];
        }
      });
    }
  }
  ////////////////
  // END HELPER //
  ////////////////
}
