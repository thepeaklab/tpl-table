"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var _ = require('lodash');
var helper_1 = require('./helper');
var interfaces_1 = require('./interfaces');
var loading_points_1 = require('./loading-points');
var pipes_1 = require('./pipes');
var tpl_table_service_1 = require('./tpl-table.service');
var CONTENT_TYPE_TEXT = 0;
var MAX_PAGINATION_BUTTONS = 5;
var vm;
var TplTableComponent = (function () {
    // private $log: any;
    function TplTableComponent(
        // @Inject(DOCUMENT) private $document: any,
        tplTableService) {
        this.tplTableService = tplTableService;
        this.add = new core_1.EventEmitter();
        this.assign = new core_1.EventEmitter();
        this.confirm = new core_1.EventEmitter();
        this.delete = new core_1.EventEmitter();
        this.edit = new core_1.EventEmitter();
        this.pageChange = new core_1.EventEmitter();
        this.pageSizeChange = new core_1.EventEmitter();
        this.rowClick = new core_1.EventEmitter();
        this.searchChange = new core_1.EventEmitter();
        vm = this;
        // this.$log = console.log; // TODO: check if there is a better solution, maybe a native angular service; otherwise write your own service
        this.editableCell = [null, null];
        this.POSSIBLE_CONTENT_TYPES = [interfaces_1.TplTableColumnContentType.TEXT, interfaces_1.TplTableColumnContentType.IMAGE];
        this.POSSIBLE_RANGE_VALUES = [10, 25, 50, 100];
    }
    ///////////
    // HOOKS //
    ///////////
    TplTableComponent.prototype.ngOnInit = function () {
        if (this.checkBindings()) {
            this.tplTableService.addTable(_.cloneDeep(this.opts));
            if (this.restoreTableStateBeforeDestroying() && this.pageChange) {
                this.onPageChange({ new: this.opts.paginationModel, old: this.opts.paginationModel }); //TODO: find a better way
            }
            this.refreshPagination();
            this.resetEdit();
        }
    };
    TplTableComponent.prototype.ngOnDestroy = function () {
        this.saveTableStateBeforeDestroying();
    };
    ///////////////
    // END HOOKS //
    ///////////////
    //////////////////////
    // PUBLIC FUNCTIONS //
    //////////////////////
    /////////////
    // OUTPUTS //
    /////////////
    TplTableComponent.prototype.onAdd = function (index) {
        this.add.next(index);
    };
    TplTableComponent.prototype.onAssign = function (index) {
        this.assign.next(index);
    };
    TplTableComponent.prototype.onConfirm = function (index) {
        this.confirm.next(index);
    };
    TplTableComponent.prototype.onDelete = function (index) {
        this.delete.next(index);
    };
    TplTableComponent.prototype.onEdit = function (index) {
        this.edit.next(index);
    };
    TplTableComponent.prototype.onPageChange = function (model) {
        this.pageChange.next(model);
    };
    TplTableComponent.prototype.onPageSizeChange = function (model) {
        this.pageSizeChange.next(model);
    };
    TplTableComponent.prototype.onRowClick = function (index) {
        this.rowClick.next(index);
    };
    TplTableComponent.prototype.onSearchChange = function (model) {
        this.searchChange.next(model);
    };
    /////////////////
    // END OUTPUTS //
    /////////////////
    ////////////
    // STYLES //
    ////////////
    TplTableComponent.prototype.handleFirstPaginatorStyles = function () {
        if (this.opts.paginationModel !== 1 && !this.pageFirstHover) {
            return { 'color': this.opts.colors.secondaryColor };
        }
        if (this.opts.paginationModel !== 1 && this.pageFirstHover) {
            return { 'color': this.opts.colors.secondaryColor, 'background-color': this.opts.colors.primaryColor };
        }
        return {};
    };
    TplTableComponent.prototype.handleMidPaginatorStyles = function () {
        if (this.pageMid1Hover) {
            return { 'color': this.opts.colors.secondaryColor, 'background-color': this.opts.colors.primaryColor };
        }
        return { 'color': this.opts.colors.secondaryColor };
    };
    TplTableComponent.prototype.handleMid2PaginatorStyles = function (page) {
        if (page !== this.opts.paginationModel && !this.pageMidHover) {
            return { 'color': this.opts.colors.secondaryColor };
        }
        if (page !== this.opts.paginationModel && this.pageMidHover) {
            return { 'background-color': this.opts.colors.primaryColor, 'color': this.opts.colors.secondaryColor };
        }
        return { 'color': this.opts.colors.secondaryFontColor, 'background-color': this.opts.colors.secondaryColor };
    };
    TplTableComponent.prototype.handleMid3PaginatorStyles = function () {
        if (this.pageMid2Hover) {
            return { 'color': this.opts.colors.secondaryColor, 'background-color': this.opts.colors.primaryColor };
        }
        return { 'color': this.opts.colors.secondaryColor };
    };
    TplTableComponent.prototype.handleMid4PaginatorStyles = function () {
        if (this.opts.paginationModel !== this.opts.pageCount && !this.pageLastHover) {
            return { 'color': this.opts.colors.secondaryColor };
        }
        if (this.opts.paginationModel !== this.opts.pageCount && this.pageLastHover) {
            return { 'color': this.opts.colors.secondaryColor, 'background-color': this.opts.colors.primaryColor };
        }
        return {};
    };
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
    TplTableComponent.prototype.getCellValue = function (row, cell) {
        var LEVELS = cell.split('.');
        var LEVELS_MAP = {
            2: function () {
                return row[LEVELS[0]] ? row[LEVELS[0]][LEVELS[1]] : '-';
            },
            3: function () {
                return row[LEVELS[0]] ? (row[LEVELS[0]][LEVELS[1]] ? row[LEVELS[0]][LEVELS[1]][LEVELS[2]] : '-') : '-';
            },
            4: function () {
                return row[LEVELS[0]] ? (row[LEVELS[0]][LEVELS[1]] ? (row[LEVELS[0]][LEVELS[1]][LEVELS[2]] ? row[LEVELS[0]][LEVELS[1]][LEVELS[2]][LEVELS[3]] : '-') : '-') : '-';
            }
        };
        return LEVELS_MAP[LEVELS.length] ? LEVELS_MAP[LEVELS.length]() : '';
    };
    TplTableComponent.prototype.skipPagesForward = function () {
        var calculatedPage = vm.opts.paginationModel + MAX_PAGINATION_BUTTONS;
        if (calculatedPage > vm.opts.pageCount) {
            calculatedPage = vm.opts.pageCount;
        }
        this.setPage(calculatedPage, true);
    };
    TplTableComponent.prototype.skipPagesBackward = function () {
        var calculatedPage = vm.opts.paginationModel - MAX_PAGINATION_BUTTONS;
        if (calculatedPage <= 0) {
            calculatedPage = 1;
        }
        this.setPage(calculatedPage, true);
    };
    TplTableComponent.prototype.setEntriesPerPageCount = function (entriesPerPageCount, callback, old) {
        var oldEntriesPerPageCount = old || this.opts.entriesPerPageCount;
        this.opts.entriesPerPageCount = entriesPerPageCount;
        this.handleEntriesPerPageCount(this.opts.entriesPerPageCount, oldEntriesPerPageCount);
        if (callback && this.pageSizeChange && this.opts.entriesPerPageCount !== oldEntriesPerPageCount) {
            this.onPageSizeChange({ new: this.opts.entriesPerPageCount, old: oldEntriesPerPageCount });
        }
    };
    TplTableComponent.prototype.setPage = function (page, callback) {
        var old = this.opts.paginationModel;
        this.opts.paginationModel = page;
        this.refreshPagination();
        this.resetEdit();
        if (callback && this.pageChange && this.opts.paginationModel !== old) {
            this.onPageChange({ new: this.opts.paginationModel, old: old });
        }
    };
    TplTableComponent.prototype.setSearch = function (search, callback) {
        var old = this.opts.searchModel;
        if (search) {
            this.opts.searchModel = search;
            this.searchInput = search;
        }
        else {
            this.opts.searchModel = this.searchInput;
        }
        this.resetEdit();
        this.handleSearchChange(this.opts.searchModel, old);
        if (callback && this.searchChange && this.opts.searchModel !== old) {
            this.onSearchChange({ new: this.opts.searchModel, old: old });
        }
    };
    //////////////////////////
    // END PUBLIC FUNCTIONS //
    //////////////////////////
    ////////////
    // HELPER //
    ////////////
    TplTableComponent.prototype.checkBindings = function () {
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
                    content: interfaces_1.TplTableColumnContentType.TEXT
                },
                {
                    name: '',
                    editable: true,
                    unit: null,
                    content: interfaces_1.TplTableColumnContentType.TEXT
                },
                {
                    name: '',
                    editable: true,
                    unit: null,
                    content: interfaces_1.TplTableColumnContentType.TEXT
                },
                {
                    name: '',
                    editable: true,
                    unit: null,
                    content: interfaces_1.TplTableColumnContentType.TEXT
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
    };
    TplTableComponent.prototype.handleEntriesPerPageCount = function (newVal, oldVal) {
        if ((newVal || newVal === 0) && newVal !== oldVal) {
            this.setPage(1);
        }
    };
    TplTableComponent.prototype.handleSearchChange = function (newVal, oldVal) {
        if ((oldVal === '' || !oldVal) && newVal !== oldVal) {
            this.saveTableStateBeforeSearch();
            if (this.opts.paginationModel !== 1) {
                this.setPage(1);
            }
        }
        else if ((newVal === '' || !newVal)) {
            this.restoreTableStateBeforeSearch();
        }
        else if (newVal !== oldVal) {
            if (this.opts.paginationModel !== 1) {
                this.setPage(1);
            }
        } // Init or returned to list
    };
    TplTableComponent.prototype.saveTableStateBeforeSearch = function () {
        this.tplTableService.setStateBeforeSearch(this.opts.id, {
            pageBeforeSearch: this.opts.paginationModel - 1,
            entriesPerPageCountBeforeSearch: this.opts.entriesPerPageCount
        });
    };
    TplTableComponent.prototype.restoreTableStateBeforeSearch = function () {
        var state = this.tplTableService.getStateBeforeSearch(this.opts.id);
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
    };
    TplTableComponent.prototype.saveTableStateBeforeDestroying = function () {
        this.tplTableService.setStateBeforeDetail(this.opts.id, {
            actualPage: this.opts.paginationModel - 1,
            actualSearch: this.opts.searchModel,
            actualEntriesPerPageCount: this.opts.entriesPerPageCount
        });
    };
    TplTableComponent.prototype.restoreTableStateBeforeDestroying = function () {
        var stateBeforeDetail = this.tplTableService.getStateBeforeDetail(this.opts.id);
        if (stateBeforeDetail) {
            var actualSearch = stateBeforeDetail.actualSearch || '';
            if (actualSearch.length) {
                this.setSearch(actualSearch);
            }
            var actualPage = Number(stateBeforeDetail.actualPage);
            if (actualPage >= 0) {
                this.setPage(stateBeforeDetail.actualPage + 1);
            }
            var actualEntriesPerPageCount = Number(stateBeforeDetail.actualEntriesPerPageCount);
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
    };
    TplTableComponent.prototype.refreshPagination = function () {
        var calculatedStart = vm.opts.paginationModel - ((MAX_PAGINATION_BUTTONS - 1) / 2);
        if (calculatedStart > 0) {
            vm.paginationStart = calculatedStart;
        }
        else {
            vm.paginationStart = 1;
        }
        var calculatedEnd = vm.opts.paginationModel + ((MAX_PAGINATION_BUTTONS - 1) / 2);
        if (calculatedEnd <= vm.opts.pageCount && (calculatedEnd - vm.paginationStart) === 5) {
            vm.paginationEnd = calculatedEnd;
        }
        else if (vm.paginationStart + (MAX_PAGINATION_BUTTONS - 1) <= vm.opts.pageCount) {
            vm.paginationEnd = vm.paginationStart + (MAX_PAGINATION_BUTTONS - 1);
        }
        else {
            vm.paginationEnd = vm.opts.pageCount;
        }
    };
    TplTableComponent.prototype.resetEdit = function (event) {
        setTimeout(function () {
            /* vm.editableCell[0] = null;
            vm.editableCell[1] = null; */
            if (event) {
                event.stopPropagation();
            }
            // vm.$document.find('body').unbind('click', vm.resetEdit); // TODO: find out how to do this in angular 2
        }, 0);
    };
    TplTableComponent.prototype.setPageCount = function (pageCount) {
        vm.opts.pageCount = pageCount;
        vm.refreshPagination();
        vm.resetEdit();
    };
    TplTableComponent.prototype.setColumns = function (columns) {
        var _this = this;
        vm.opts.columns = columns;
        if (vm.opts.columns && vm.opts.columns.length) {
            vm.opts.columns.forEach(function (column) {
                if (column.content) {
                    var CONTENT_TYPE = column.content;
                    if (_this.POSSIBLE_CONTENT_TYPES.indexOf(CONTENT_TYPE) < 0) {
                        column.content = interfaces_1.TplTableColumnContentType.TEXT;
                    }
                    else {
                        column.content = CONTENT_TYPE;
                    }
                }
                else {
                    column.content = interfaces_1.TplTableColumnContentType.TEXT;
                }
            });
        }
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TplTableComponent.prototype, "add", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TplTableComponent.prototype, "assign", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TplTableComponent.prototype, "confirm", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TplTableComponent.prototype, "delete", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TplTableComponent.prototype, "edit", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TplTableComponent.prototype, "pageChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TplTableComponent.prototype, "pageSizeChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TplTableComponent.prototype, "rowClick", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TplTableComponent.prototype, "searchChange", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TplTableComponent.prototype, "tplTableOptions", void 0);
    TplTableComponent = __decorate([
        core_1.Component({
            selector: 'tpl-table',
            template: "\n    <div *ngIf=\"opts\">\n      <div class=\"top-row\">\n        <div *ngIf=\"opts.entriesPerPageCount && opts.showPagination\" class=\"elementsperside__select prettyselect\">\n          <select [ngModel]=\"opts.entriesPerPageCount\" [ngStyle]=\"{'color': opts.colors.secondaryColor}\" (ngModelChange)=\"entriesPerPageCount = opts.entriesPerPageCount; setEntriesPerPageCount(opts.entriesPerPageCount, true, entriesPerPageCount)\" class=\"top-row__entry-count input-sm\">\n            <template ngFor let-range [ngForOf]=\"POSSIBLE_RANGE_VALUES\">\n              <option *ngIf=\"range\" [value]=\"range\">range</option>\n            </template>\n          </select>\n        </div><span *ngIf=\"opts.entriesPerPageCount && opts.showPagination\" class=\"elementsperside__label\">{{ 'TABLE_ENTRIES_PER_SITE' | translate }} {{dataOrder}}</span>\n        <form *ngIf=\"opts.searchModel!==null\" (ngSubmit)=\"setSearch(searchInput, true)\">\n          <input type=\"text\" [ngModel]=\"searchInput\" [placeholder]=\"opts.searchPlaceholderText|translate\" class=\"top-row__search\"/>\n        </form>\n      </div>\n      <table class=\"tpltable\">\n        <thead class=\"tpltable__head\">\n          <tr>\n            <template ngFor let-column [ngForOf]=\"opts.columns\">\n              <th *ngIf=\"column && (!column.ngIf || column.ngIf())\">\n                <span *ngIf=\"!column.translateColumn\">{{column.name}}</span>\n                <span *ngIf=\"column.translateColumn\">{{column.name | translate}}</span>\n              </th>\n            </template>\n            <th *ngIf=\"opts.showActionsColumn\" class=\"edit\">Aktionen</th>\n          </tr>\n        </thead>\n        <tbody class=\"tpltable__body\">\n          <tr *ngIf=\"!opts.entries || !opts.entries.length || opts.loading\" class=\"tpltable__row--placeholder\">\n            <td [colSpan]=\"opts.entrieValuesOrder.length + (opts.showActionsColumn ? 1 : 0)\"><span *ngIf=\"!opts.loading\">{{opts.noDataAvailableText | translate}}</span>\n              <loadingpoints *ngIf=\"opts.loading\"></loadingpoints>\n            </td>\n          </tr>\n          <template ngFor let-row [ngForOf]=\"opts.entries\" let-rowindex=\"index\">\n            <tr *ngIf=\"opts.entries && opts.entries.length && row\">\n              <template ngFor let-cell [ngForOf]=\"opts.entrieValuesOrder\" let-cellindex=\"index\">\n                <td (mouseleave)=\"hover=false\" (mouseenter)=\"hover=true\" [ngStyle]=\"{'background-color': editableCell[0]===rowindex && opts.colors.primaryColor, 'color': editableCell[0]===rowindex && opts.colors.primaryFontColor}\" [class.clickable]=\"rowClick\" [class.notclickable]=\"!rowClick || editableCell[0]!==null\" (click)=\"!rowClick || editableCell[0]!==null || onRowClick({$index: rowindex})\">\n                  <div *ngIf=\"cell && opts.columns && (!opts.columns[cellindex].ngIf || opts.columns[cellindex].ngIf())\">\n                    <div *ngIf=\"(editableCell[0]!==rowindex || editableCell[1]!==cellindex || !opts.columns[cellindex].editable)\">\n                      <div *ngIf=\"opts.columns[cellindex].content === POSSIBLE_CONTENT_TYPES[0]\" class=\"cell__text\"><span *ngIf=\"!opts.columns[cellindex].translateValues\">{{(cell.indexOf('.') !== -1 ? getCellValue(row, cell) : row[cell]) | checkmark}}</span><span *ngIf=\"opts.columns[cellindex].translateValues\">{{((opts.columns[cellindex].translateValuePrefix ? opts.columns[cellindex].translateValuePrefix : '') + (cell.indexOf('.') !== -1 ? getCellValue(row, cell) : row[cell])) | translate}}</span></div>\n                      <div *ngIf=\"opts.columns[cellindex].content === POSSIBLE_CONTENT_TYPES[1]\" class=\"cell__image\"><img [src]=\"row[cell]\" [ngStyle]=\"{'max-width': opts.columns[cellindex].maxWidth ? opts.columns[cellindex].maxWidth : '250px', 'max-height': opts.columns[cellindex].maxHeight ? opts.columns[cellindex].maxHeight : '250px'}\"/></div>\n                    </div>\n                    <!---<span *ngIf=\"editableCell[1]===cellindex && editableCell[0]===rowindex && opts.columns[cellindex].editable\">\n                      <input type=\"text\" [ngModel]=\"tempEditColumnCopy[cell]\" [focus-me=]\"editableCell[1]===cellindex && editableCell[0]===rowindex\" (click)=\"$event.stopPropagation()\" (keyup)=\"$event.keyCode == 13 && saveEditedColumn()\" class=\"edit-input\"/>\n                    </span>\n                    <div *ngIf=\"opts.columns[cellindex].editable && hover\" (click)=\"toggleEditCell($event, rowindex, cellindex)\" [ngStyle]=\"{'background-color': hoverEdit && opts.colors.primaryColor, 'color': hoverEdit && opts.colors.primaryFontColor}\" (mouseenter)=\"hoverEdit=true\" (mouseleave)=\"hoverEdit=false\" class=\"cell-controll edit\">\n                      <div *ngIf=\"hover\" class=\"iconfont tbl-iconfont-pen\"></div>\n                    </div>\n                    <div *ngIf=\"opts.columns[cellindex].editable && editableCell[0]===rowindex && editableCell[1]===cellindex\" [ngStyle]=\"{'background-color': opts.colors.secondaryColor, 'color': opts.colors.secondaryFontColor}\" (click)=\"hover=false;saveEditedColumn()\" class=\"cell-controll save\">\n                      <div class=\"iconfont iconfont-check\"></div>\n                    </div>--->\n                  </div>\n                </td>\n              </template>\n              <td *ngIf=\"opts.showActionsColumn\" class=\"edit\"><span *ngIf=\"assign\" (click)=\"!assign || editableCell[0]!==null || onAssign({$index: rowindex})\" class=\"tbl-iconfont tbl-iconfont-export\"></span><span *ngIf=\"edit\" (click)=\"!edit || editableCell[0]!==null || onEdit({$index: rowindex})\" class=\"tbl-iconfont tbl-iconfont-pen\"></span><span *ngIf=\"delete\" (click)=\"!delete || editableCell[0]!==null || onDelete({$index: rowindex})\" class=\"tbl-iconfont tbl-iconfont-delete\"></span><span *ngIf=\"add\" (click)=\"!add || editableCell[0] !== null || onAdd({$index: rowindex})\" class=\"icon icon-cal-button\"></span><span *ngIf=\"confirm\" (click)=\"!confirm || editableCell[0]!=null || onConfirm({$index: rowindex})\" class=\"iconfont iconfont-check\"></span>\n              </td>\n            </tr>\n          </template>\n        </tbody>\n      </table>\n      <div *ngIf=\"opts.showPagination && opts.paginationModel && paginationStart !== 1 && paginationEnd !== 1\" class=\"bottom-row\">\n        <div class=\"paginator\">\n          <div *ngIf=\"paginationStart < paginationEnd\" [class.inactive]=\"opts.paginationModel === 1\" [ngStyle]=\"handleFirstPaginatorStyles()\" [attr.disabled]=\"opts.paginationModel === 1\" (click)=\"setPage(1, true)\" (mouseenter)=\"pageFirstHover=true\" (mouseleave)=\"pageFirstHover=false\" class=\"paginator__first\">{{'TABLE_PAGING_START'|translate}}</div>\n          <div *ngIf=\"paginationStart > 1\" (click)=\"skipPagesBackward()\" [ngStyle]=\"handleMidPaginatorStyles()\" (mouseenter)=\"pageMid1Hover=true\" (mouseleave)=\"pageMid1Hover=false\" class=\"paginator__mid\">...</div>\n          <template ngFor let-i [ngForOf]=\"[paginationStart, paginationEnd] | toRange\">\n            <div *ngIf=\"i\" [class.active]=\"i === opts.paginationModel\" (click)=\"setPage(i, true)\" [ngStyle]=\"handleMid2PaginatorStyles(i)\" (mouseenter)=\"pageMidHover=true\" (mouseleave)=\"pageMidHover=false\" class=\"paginator__mid\">{{i}}</div>\n          </template>\n          <div *ngIf=\"paginationEnd < opts.pageCount\" (click)=\"skipPagesForward()\" [ngStyle]=\"handleMid3PaginatorStyles()\" (mouseenter)=\"pageMid2Hover=true\" (mouseleave)=\"pageMid2Hover=false\" class=\"paginator__mid\">...</div>\n          <div *ngIf=\"paginationStart < paginationEnd\" [class.inactive]=\"opts.paginationModel === opts.pageCount\" [ngStyle]=\"handleMid4PaginatorStyles()\" [attr.disabled]=\"opts.paginationModel === opts.pageCount\" (click)=\"setPage(opts.pageCount, true)\" (mouseenter)=\"pageLastHover=true\" (mouseleave)=\"pageLastHover=false\" class=\"paginator__last\">{{'TABLE_PAGING_END'|translate}}</div>\n        </div>\n      </div>\n    </div>\n  ",
            directives: [helper_1.FocusMeDirective, loading_points_1.LoadingPointsComponent],
            providers: [tpl_table_service_1.TplTableService],
            pipes: [pipes_1.CheckmarkPipe, pipes_1.ToRangePipe, pipes_1.TranslatePipe]
        }), 
        __metadata('design:paramtypes', [tpl_table_service_1.TplTableService])
    ], TplTableComponent);
    return TplTableComponent;
}());
exports.TplTableComponent = TplTableComponent;
//# sourceMappingURL=tpl-table.component.js.map