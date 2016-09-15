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
var forms_1 = require('@angular/forms');
var _ = require('lodash');
var Rx_1 = require('rxjs/Rx');
var interfaces_1 = require('./interfaces');
var tpl_table_service_1 = require('./tpl-table.service');
var MAX_PAGINATION_BUTTONS = 5;
var vm;
var TplTableComponent = (function () {
    function TplTableComponent(
        // @Inject(DOCUMENT) private $document: any,
        tplTableService) {
        this.tplTableService = tplTableService;
        ////////////////
        // END INPUTS //
        ////////////////
        /////////////
        // OUTPUTS //
        /////////////
        this.pageChange = new core_1.EventEmitter();
        this.pageSizeChange = new core_1.EventEmitter();
        this.searchChange = new core_1.EventEmitter();
        vm = this;
        this.log = console; // TODO: check if there is a better solution, maybe a native angular service; otherwise write your own service
        this.editableCell = [null, null];
        this.POSSIBLE_CONTENT_TYPES = [interfaces_1.TplTableColumnContentType.TEXT, interfaces_1.TplTableColumnContentType.IMAGE];
    }
    ///////////
    // HOOKS //
    ///////////
    TplTableComponent.prototype.ngOnInit = function () {
        if (this.checkOptions()) {
            this.tplTableService.addTable(_.cloneDeep(this.opts));
            if (this.restoreTableStateBeforeDestroying() && this.pageChange) {
                this.onPageChange({ new: this.paginationModel, old: this.paginationModel }); //TODO: check if this is necessary
            }
            this.refreshPagination();
            this.resetInlineCellEdit();
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
    ////////////
    // EVENTS //
    ////////////
    TplTableComponent.prototype.onAdd = function (index) {
        this.add$.next(index);
    };
    TplTableComponent.prototype.onAssign = function (index) {
        this.assign$.next(index);
    };
    TplTableComponent.prototype.onConfirm = function (index) {
        this.confirm$.next(index);
    };
    TplTableComponent.prototype.onDelete = function (index) {
        this.delete$.next(index);
    };
    TplTableComponent.prototype.onEdit = function (index) {
        this.edit$.next(index);
    };
    TplTableComponent.prototype.onInlineCellEdit = function (model) {
        this.inlineCellEdit$.next(model);
    };
    TplTableComponent.prototype.onPageChange = function (model) {
        this.pageChange.next(model);
    };
    TplTableComponent.prototype.onPageSizeChange = function (model) {
        this.pageSizeChange.next(model);
    };
    TplTableComponent.prototype.onResetSearch = function () {
        var _this = this;
        if (this.searchControlValueChangesSubscription) {
            this.searchControlValueChangesSubscription.unsubscribe();
        }
        this.enableSearch = false;
        this.setupSearch();
        setTimeout(function () { _this.enableSearch = true; }, 0);
        this.setSearch(undefined, true);
    };
    TplTableComponent.prototype.onRowClick = function (index) {
        this.rowClick$.next(index);
    };
    TplTableComponent.prototype.onSearchChange = function (model) {
        this.searchChange.next(model);
    };
    ////////////////
    // END EVENTS //
    ////////////////
    //////////////////
    // MOUSE EVENTS //
    //////////////////
    TplTableComponent.prototype.onFirstPaginatorMouseEnter = function () {
        this.log.info('onFirstPaginatorMouseEnter');
        this.pageFirstHover = true;
    };
    TplTableComponent.prototype.onFirstPaginatorMouseLeave = function () {
        this.log.info('onFirstPaginatorMouseLeave');
        this.pageFirstHover = false;
    };
    TplTableComponent.prototype.onMid1PaginatorMouseEnter = function () {
        this.log.info('onMid1PaginatorMouseEnter');
        this.pageMid1Hover = true;
    };
    TplTableComponent.prototype.onMid1PaginatorMouseLeave = function () {
        this.log.info('onMid1PaginatorMouseLeave');
        this.pageMid1Hover = false;
    };
    TplTableComponent.prototype.onMidPaginatorMouseEnter = function (i) {
        this.log.info('onMidPaginatorMouseEnter');
        this.currentlyHoveredPage = i;
        this.pageMidHover = true;
    };
    TplTableComponent.prototype.onMidPaginatorMouseLeave = function () {
        this.log.info('onMidPaginatorMouseLeave');
        this.currentlyHoveredPage = null;
        this.pageMidHover = false;
    };
    TplTableComponent.prototype.onMid2PaginatorMouseEnter = function () {
        this.log.info('onMid2PaginatorMouseEnter');
        this.pageMid2Hover = true;
    };
    TplTableComponent.prototype.onMid2PaginatorMouseLeave = function () {
        this.log.info('onMid2PaginatorMouseLeave');
        this.pageMid2Hover = false;
    };
    TplTableComponent.prototype.onLastPaginatorMouseEnter = function () {
        this.log.info('onLastPaginatorMouseEnter');
        this.pageLastHover = true;
    };
    TplTableComponent.prototype.onLastPaginatorMouseLeave = function () {
        this.log.info('onLastPaginatorMouseLeave');
        this.pageLastHover = false;
    };
    //////////////////////
    // END MOUSE EVENTS //
    //////////////////////
    ////////////
    // STYLES //
    ////////////
    TplTableComponent.prototype.handleFirstPaginatorStyles = function () {
        if (this.paginationModel !== 1 && !this.pageFirstHover) {
            return { 'color': this.colors.secondaryColor };
        }
        if (this.paginationModel !== 1 && this.pageFirstHover) {
            return { 'color': this.colors.secondaryColor, 'background-color': this.colors.primaryColor };
        }
        return {};
    };
    TplTableComponent.prototype.handleMid1PaginatorStyles = function () {
        if (this.pageMid1Hover) {
            return { 'color': this.colors.secondaryColor, 'background-color': this.colors.primaryColor, 'cursor': 'pointer' };
        }
        return { 'color': this.colors.secondaryColor };
    };
    TplTableComponent.prototype.handleMidPaginatorStyles = function (page) {
        if (page === this.currentlyHoveredPage) {
            if (this.currentlyHoveredPage !== this.paginationModel && !this.pageMidHover) {
                return { 'color': this.colors.secondaryColor, 'cursor': 'pointer' };
            }
            if (this.currentlyHoveredPage !== this.paginationModel && this.pageMidHover) {
                return { 'background-color': this.colors.primaryColor, 'color': this.colors.secondaryColor, 'cursor': 'pointer' };
            }
            return { 'color': this.colors.secondaryFontColor, 'background-color': this.colors.secondaryColor, 'cursor': 'initial' };
        }
    };
    TplTableComponent.prototype.handleMid2PaginatorStyles = function () {
        if (this.pageMid2Hover) {
            return { 'color': this.colors.secondaryColor, 'background-color': this.colors.primaryColor, 'cursor': 'pointer' };
        }
        return { 'color': this.colors.secondaryColor };
    };
    TplTableComponent.prototype.handleLastPaginatorStyles = function () {
        if (this.paginationModel !== this.pageCount && !this.pageLastHover) {
            return { 'color': this.colors.secondaryColor };
        }
        if (this.paginationModel !== this.pageCount && this.pageLastHover) {
            return { 'color': this.colors.secondaryColor, 'background-color': this.colors.primaryColor };
        }
        return {};
    };
    ////////////////
    // END STYLES //
    ////////////////
    ////////////////////
    // INLINE EDITING //
    ////////////////////
    TplTableComponent.prototype.toggleCellEditing = function (event, rowIndex, columnIndex) {
        event.stopPropagation();
        this.editableCell[0] = rowIndex;
        this.editableCell[1] = columnIndex;
        this.tmpEditedCellData = _.cloneDeep(this.entries[rowIndex]);
        for (var key in this.tmpEditedCellData) {
            if (this.tmpEditedCellData[key] === '-' || this.tmpEditedCellData[key] === '--' || this.tmpEditedCellData[key] === '---') {
                this.tmpEditedCellData[key] = null;
            }
        }
    };
    TplTableComponent.prototype.saveEditedCellData = function () {
        var OLD_ROW = this.entries[this.editableCell[0]];
        var NEW_ROW = this.tmpEditedCellData;
        this.onInlineCellEdit({ rowIndex: this.editableCell[0], columnIndex: this.editableCell[1], newValue: NEW_ROW, oldValue: OLD_ROW });
        this.resetInlineCellEdit();
    };
    ////////////////////////
    // END INLINE EDITING //
    ////////////////////////
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
    ////////////////
    // PAGINATION //
    ////////////////
    TplTableComponent.prototype.skipPagesForward = function () {
        var calculatedPage = vm.paginationModel + MAX_PAGINATION_BUTTONS;
        if (calculatedPage > vm.pageCount) {
            calculatedPage = vm.pageCount;
        }
        this.setPage(calculatedPage, true);
    };
    TplTableComponent.prototype.skipPagesBackward = function () {
        var calculatedPage = vm.paginationModel - MAX_PAGINATION_BUTTONS;
        if (calculatedPage <= 0) {
            calculatedPage = 1;
        }
        this.setPage(calculatedPage, true);
    };
    TplTableComponent.prototype.setEntriesPerPageCount = function (entriesPerPageCount, callback, old) {
        var oldEntriesPerPageCount = +old || this.entriesPerPageCount;
        this.entriesPerPageCount = +entriesPerPageCount;
        this.handleEntriesPerPageCount(this.entriesPerPageCount, oldEntriesPerPageCount);
        if (callback && this.pageSizeChange && this.entriesPerPageCount !== oldEntriesPerPageCount) {
            this.onPageSizeChange({ new: this.entriesPerPageCount, old: oldEntriesPerPageCount });
        }
    };
    TplTableComponent.prototype.setPage = function (page, callback) {
        var old = this.paginationModel;
        this.paginationModel = page;
        this.refreshPagination();
        this.resetInlineCellEdit();
        if (callback && this.pageChange && this.paginationModel !== old) {
            this.onPageChange({ new: this.paginationModel, old: old });
        }
    };
    ////////////////////
    // END PAGINATION //
    ////////////////////
    TplTableComponent.prototype.setSearch = function (search, callback) {
        var old = this.searchModel;
        this.searchModel = search;
        this.resetInlineCellEdit();
        this.handleSearchChange(this.searchModel, old);
        if (callback && this.searchChange && this.searchModel !== old) {
            this.onSearchChange({ new: this.searchModel, old: old });
        }
    };
    //////////////////////////
    // END PUBLIC FUNCTIONS //
    //////////////////////////
    ////////////
    // HELPER //
    ////////////
    TplTableComponent.prototype.checkOptions = function () {
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
            this.columns.forEach(function (column) {
                if (!column.content) {
                    column.content = interfaces_1.TplTableColumnContentType.TEXT;
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
            this.add$ = new Rx_1.Subject();
            this.assign$ = new Rx_1.Subject();
            this.confirm$ = new Rx_1.Subject();
            this.delete$ = new Rx_1.Subject();
            this.edit$ = new Rx_1.Subject();
            this.inlineCellEdit$ = new Rx_1.Subject();
            this.rowClick$ = new Rx_1.Subject();
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
    };
    TplTableComponent.prototype.setupSearch = function () {
        var _this = this;
        this.searchControl = new forms_1.FormControl('');
        this.searchControlValueChangesSubscription = this.searchControl
            .valueChanges
            .debounceTime(this.opts.searchDebounceTime || 1000)
            .subscribe(function (value) {
            _this.setSearch(value, true);
        });
    };
    TplTableComponent.prototype.handleEntriesPerPageCount = function (newVal, oldVal) {
        if ((newVal || newVal === 0) && newVal !== oldVal) {
            this.setPage(1);
        }
    };
    TplTableComponent.prototype.handleSearchChange = function (newVal, oldVal) {
        if ((oldVal === '' || !oldVal) && newVal && newVal.length && newVal !== oldVal) {
            this.saveTableStateBeforeSearch();
            if (this.paginationModel !== 1) {
                this.setPage(1);
            }
        }
        else if ((newVal === '' || !newVal) && newVal !== oldVal) {
            this.restoreTableStateBeforeSearch();
        }
        else if (newVal && oldVal && newVal.length && oldVal.length && newVal !== oldVal) {
            if (this.paginationModel !== 1) {
                this.setPage(1);
            }
        } // Init or returned to list
    };
    TplTableComponent.prototype.saveTableStateBeforeSearch = function () {
        this.tplTableService.setStateBeforeSearch(this.id, {
            pageBeforeSearch: this.paginationModel - 1,
            entriesPerPageCountBeforeSearch: this.entriesPerPageCount
        });
    };
    TplTableComponent.prototype.restoreTableStateBeforeSearch = function () {
        var state = this.tplTableService.getStateBeforeSearch(this.id);
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
    };
    TplTableComponent.prototype.saveTableStateBeforeDestroying = function () {
        this.tplTableService.setStateBeforeDetail(this.id, {
            actualPage: this.paginationModel - 1,
            actualSearch: this.searchModel,
            actualEntriesPerPageCount: this.entriesPerPageCount
        });
    };
    TplTableComponent.prototype.restoreTableStateBeforeDestroying = function () {
        var stateBeforeDetail = this.tplTableService.getStateBeforeDetail(this.id);
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
            this.tplTableService.setStateBeforeDetail(this.id, {
                actualPage: null,
                actualSearch: null,
                actualEntriesPerPageCount: null
            });
            return true;
        }
        return false;
    };
    TplTableComponent.prototype.refreshPagination = function () {
        var paginationStart;
        var paginationEnd;
        var calculatedStart = vm.paginationModel - ((MAX_PAGINATION_BUTTONS - 1) / 2);
        if (calculatedStart > 0) {
            paginationStart = calculatedStart;
        }
        else {
            paginationStart = 1;
        }
        var calculatedEnd = vm.paginationModel + ((MAX_PAGINATION_BUTTONS - 1) / 2);
        if (calculatedEnd <= vm.pageCount && (calculatedEnd - paginationStart) === 5) {
            paginationEnd = calculatedEnd;
        }
        else if (paginationStart + (MAX_PAGINATION_BUTTONS - 1) <= vm.pageCount) {
            paginationEnd = paginationStart + (MAX_PAGINATION_BUTTONS - 1);
        }
        else {
            paginationEnd = vm.pageCount;
        }
        if (paginationStart !== vm.paginationStart) {
            vm.paginationStart = paginationStart;
        }
        if (paginationEnd !== vm.paginationEnd) {
            vm.paginationEnd = paginationEnd;
        }
    };
    TplTableComponent.prototype.resetInlineCellEdit = function (event) {
        var _this = this;
        setTimeout(function () {
            _this.editableCell[0] = null;
            _this.editableCell[1] = null;
            _this.tmpEditedCellData = null;
            // if (event) { // TODO: check if this is necessary
            //   event.stopPropagation();
            // }
        }, 0);
    };
    /////////////////////////////
    // CALLED BY TABLE SERVICE //
    /////////////////////////////
    TplTableComponent.prototype.setColumns = function (columns) {
        var _this = this;
        if (columns && columns.length) {
            vm.columns = columns;
            vm.columns.forEach(function (column) {
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
    TplTableComponent.prototype.setEntries = function (entries) {
        if (entries && entries.length) {
            vm.entries = entries;
        }
    };
    TplTableComponent.prototype.setEntrieValuesOrder = function (entrieValuesOrder) {
        if (entrieValuesOrder && entrieValuesOrder.length) {
            vm.entrieValuesOrder = entrieValuesOrder;
        }
    };
    TplTableComponent.prototype.setPageCount = function (pageCount) {
        vm.pageCount = pageCount;
        vm.refreshPagination();
        vm.resetInlineCellEdit();
    };
    __decorate([
        core_1.Input('tplTableOptions'), 
        __metadata('design:type', Object)
    ], TplTableComponent.prototype, "opts", void 0);
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
    ], TplTableComponent.prototype, "searchChange", void 0);
    TplTableComponent = __decorate([
        core_1.Component({
            selector: 'tpl-table',
            template: "\n    <div *ngIf=\"optionsValidationSuccess\">\n      <div class=\"top-row\">\n        <div *ngIf=\"enablePagination && entriesPerPageCount\" class=\"elementsperside__select prettyselect\">\n          <select [ngModel]=\"entriesPerPageCount\" [ngStyle]=\"{'color': colors.secondaryColor}\" (ngModelChange)=\"oldEntriesPerPageCount = entriesPerPageCount; setEntriesPerPageCount($event, true, oldEntriesPerPageCount)\" class=\"top-row__entry-count input-sm\">\n            <template ngFor let-range [ngForOf]=\"entriesPerPageValues\">\n              <option *ngIf=\"range\" [value]=\"range\">{{range}}</option>\n            </template>\n          </select>\n          <span *ngIf=\"enablePagination && entriesPerPageCount\" class=\"elementsperside__label\">{{ 'TABLE_ENTRIES_PER_SITE' | translate }} {{dataOrder}}</span>\n        </div>\n        <div *ngIf=\"enableSearch\">\n          <div class=\"input-group\">\n            <input type=\"search\" [formControl]=\"searchControl\" [placeholder]=\"searchPlaceholderText|translate\" class=\"top-row__search\" [disabled]=\"opts.loading\">\n            <span class=\"input-group-addon\" [class.action]=\"searchControl.value\" (click)=\"searchControl.value && onResetSearch()\">\n              <span *ngIf=\"searchControl.value\">&#x2717;</span>\n            </span>\n          </div>\n        </div>\n      </div>\n      <table class=\"tpltable\">\n        <thead class=\"tpltable__head\">\n          <tr>\n            <template ngFor let-column [ngForOf]=\"columns\">\n              <th *ngIf=\"column && (!column.ngIf || column.ngIf())\">\n                <span *ngIf=\"!column.translateColumn\">{{column.name}}</span>\n                <span *ngIf=\"column.translateColumn\">{{column.name | translate}}</span>\n              </th>\n            </template>\n            <th *ngIf=\"enableActionsColumn\" class=\"edit\">Aktionen</th>\n          </tr>\n        </thead>\n        <tbody class=\"tpltable__body\">\n          <tr *ngIf=\"!entries || !entries.length || opts.loading\" class=\"tpltable__row--placeholder\">\n            <td [colSpan]=\"entrieValuesOrder.length + (enableActionsColumn ? 1 : 0)\"><span *ngIf=\"!opts.loading\">{{noDataAvailableText | translate}}</span>\n              <loading-points *ngIf=\"opts.loading\"></loading-points>\n            </td>\n          </tr>\n          <template ngFor let-row [ngForOf]=\"entries\" let-rowindex=\"index\">\n            <tr *ngIf=\"entries && entries.length && !opts.loading && row\">\n              <template ngFor let-cell [ngForOf]=\"entrieValuesOrder\" let-cellindex=\"index\">\n                <td (mouseleave)=\"hover=false\" (mouseenter)=\"hover=true\" [ngStyle]=\"{'background-color': editableCell[0] === rowindex && colors.primaryColor, 'color': editableCell[0] === rowindex && colors.primaryFontColor}\" [class.clickable]=\"rowClick$?.observers?.length\" [class.notclickable]=\"!rowClick$?.observers?.length || editableCell[0] !== null\" (click)=\"!rowClick$?.observers?.length || editableCell[0] !== null || onRowClick({$index: rowindex})\">\n                  <div *ngIf=\"cell && columns && (!columns[cellindex].ngIf || columns[cellindex].ngIf())\">\n                    <div *ngIf=\"(editableCell[0]!==rowindex || editableCell[1]!==cellindex || !columns[cellindex].editable)\">\n                      <div *ngIf=\"columns[cellindex].content === POSSIBLE_CONTENT_TYPES[0]\" class=\"cell__text\"><span *ngIf=\"!columns[cellindex].translateValues\">{{(cell.indexOf('.') !== -1 ? getCellValue(row, cell) : row[cell]) | checkmark}}</span><span *ngIf=\"columns[cellindex].translateValues\">{{((columns[cellindex].translateValuePrefix ? columns[cellindex].translateValuePrefix : '') + (cell.indexOf('.') !== -1 ? getCellValue(row, cell) : row[cell])) | translate}}</span></div>\n                      <div *ngIf=\"columns[cellindex].content === POSSIBLE_CONTENT_TYPES[1]\" class=\"cell__image\"><img [src]=\"row[cell]\" [ngStyle]=\"{'max-width': columns[cellindex].maxWidth ? columns[cellindex].maxWidth : '250px', 'max-height': columns[cellindex].maxHeight ? columns[cellindex].maxHeight : '250px'}\"/></div>\n                    </div>\n                    <span *ngIf=\"editableCell[1] === cellindex && editableCell[0] === rowindex && columns[cellindex].editable\">\n                      <input type=\"text\" [(ngModel)]=\"tmpEditedCellData[cell]\" [focusMe]=\"editableCell[1] === cellindex && editableCell[0] === rowindex\" (click)=\"$event.stopPropagation()\" (keyup.enter)=\"saveEditedCellData()\" class=\"edit-input\">\n                    </span>\n                    <div *ngIf=\"columns[cellindex].editable && hover\" (click)=\"toggleCellEditing($event, rowindex, cellindex)\" [ngStyle]=\"{'background-color': hoverEdit && colors.primaryColor, 'color': hoverEdit && colors.primaryFontColor}\" (mouseenter)=\"hoverEdit=true\" (mouseleave)=\"hoverEdit=false\" class=\"cell-controll edit\">\n                      <div class=\"iconfont tbl-iconfont-pen\"></div>\n                    </div>\n                    <div *ngIf=\"columns[cellindex].editable && editableCell[0] === rowindex && editableCell[1] === cellindex\">\n                      <div [ngStyle]=\"{'background-color': colors.secondaryColor, 'color': colors.secondaryFontColor}\" (click)=\"hover=false; saveEditedCellData()\" class=\"cell-controll save\">\n                        <div class=\"iconfont tbl-iconfont-check\"></div>\n                      </div>\n                      <div [ngStyle]=\"{'background-color': colors.secondaryColor, 'color': colors.secondaryFontColor}\" (click)=\"hover=false; resetInlineCellEdit()\" class=\"cell-controll\">\n                        <div class=\"iconfont tbl-iconfont-cancel\"></div>\n                      </div>\n                    </div>\n                  </div>\n                </td>\n              </template>\n              <td *ngIf=\"enableActionsColumn && (assign$?.observers?.length || edit$?.observers?.length || delete$?.observers?.length || add$?.observers?.length || confirm$?.observers?.length)\" class=\"edit\"><span *ngIf=\"assign$?.observers?.length\" (click)=\"!assign$?.observers?.length || editableCell[0]!==null || onAssign({$index: rowindex})\" class=\"tbl-iconfont tbl-iconfont-export\"></span><span *ngIf=\"edit$?.observers?.length\" (click)=\"!edit$?.observers?.length || editableCell[0]!==null || onEdit({$index: rowindex})\" class=\"tbl-iconfont tbl-iconfont-pen\"></span><span *ngIf=\"delete$?.observers?.length\" (click)=\"!delete$?.observers?.length || editableCell[0]!==null || onDelete({$index: rowindex})\" class=\"tbl-iconfont tbl-iconfont-delete\"></span><span *ngIf=\"add$?.observers?.length\" (click)=\"!add$?.observers?.length || editableCell[0] !== null || onAdd({$index: rowindex})\" class=\"icon icon-cal-button\"></span><span *ngIf=\"confirm$?.observers?.length\" (click)=\"!confirm$?.observers?.length || editableCell[0]!=null || onConfirm({$index: rowindex})\" class=\"iconfont tbl-iconfont-check\"></span>\n              </td>\n            </tr>\n          </template>\n        </tbody>\n      </table>\n      <div *ngIf=\"enablePagination && paginationModel && paginationEnd !== 1\" class=\"bottom-row\">\n        <div class=\"paginator\">\n          <div *ngIf=\"paginationStart < paginationEnd\" [class.inactive]=\"paginationModel === 1\" [ngStyle]=\"handleFirstPaginatorStyles()\" [attr.disabled]=\"paginationModel === 1\" (click)=\"paginationModel !== 1 && setPage(1, true)\" (mouseenter)=\"onFirstPaginatorMouseEnter()\" (mouseleave)=\"onFirstPaginatorMouseLeave()\" class=\"paginator__first\">\n            {{'TABLE_PAGING_START'|translate}}\n          </div>\n          <div *ngIf=\"paginationStart > 1\" (click)=\"skipPagesBackward()\" [ngStyle]=\"handleMid1PaginatorStyles()\" (mouseenter)=\"onMid1PaginatorMouseEnter()\" (mouseleave)=\"onMid1PaginatorMouseLeave()\" class=\"paginator__mid\">\n            ...\n          </div>\n          <template ngFor let-i [ngForOf]=\"[paginationStart, paginationEnd] | toRange\">\n            <div *ngIf=\"i\" [class.active]=\"i === paginationModel\" (click)=\"i !== paginationModel && setPage(i, true)\" [ngStyle]=\"handleMidPaginatorStyles(i)\" (mouseenter)=\"onMidPaginatorMouseEnter(i)\" (mouseleave)=\"onMidPaginatorMouseLeave()\" class=\"paginator__mid\">\n              {{i}}\n            </div>\n          </template>\n          <div *ngIf=\"paginationEnd < pageCount\" (click)=\"skipPagesForward()\" [ngStyle]=\"handleMid2PaginatorStyles()\" (mouseenter)=\"onMid2PaginatorMouseEnter()\" (mouseleave)=\"onMid2PaginatorMouseLeave()\" class=\"paginator__mid\">\n            ...\n          </div>\n          <div *ngIf=\"paginationStart < paginationEnd\" [class.inactive]=\"paginationModel === pageCount\" [ngStyle]=\"handleLastPaginatorStyles()\" [attr.disabled]=\"paginationModel === pageCount\" (click)=\"paginationModel < pageCount && setPage(pageCount, true)\" (mouseenter)=\"onLastPaginatorMouseEnter()\" (mouseleave)=\"onLastPaginatorMouseLeave()\" class=\"paginator__last\">\n            {{'TABLE_PAGING_END'|translate}}\n          </div>\n        </div>\n      </div>\n    </div>\n  ",
            styles: [
                "\n    /* IE */\n    input[type=text]::-ms-clear { display: none; width: 0; height: 0; }\n    input[type=text]::-ms-reveal { display: none; width: 0; height: 0; }\n\n    /* CHROME */\n    input[type=\"search\"]::-webkit-search-decoration,\n    input[type=\"search\"]::-webkit-search-cancel-button,\n    input[type=\"search\"]::-webkit-search-results-button,\n    input[type=\"search\"]::-webkit-search-results-decoration { display: none; }\n\n    .action {\n      cursor: pointer;\n    }\n    "
            ]
        }), 
        __metadata('design:paramtypes', [tpl_table_service_1.TplTableService])
    ], TplTableComponent);
    return TplTableComponent;
}());
exports.TplTableComponent = TplTableComponent;
//# sourceMappingURL=tpl-table.component.js.map