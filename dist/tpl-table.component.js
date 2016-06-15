"use strict";
var angular = require('angular');
var CONTENT_TYPE_TEXT = 0;
var MAX_PAGINATION_BUTTONS = 5;
var vm;
var TplTableCtrl = (function () {
    function TplTableCtrl($scope, $rootScope, $document, $timeout, tplTableService, $log, scopeListenerManager) {
        vm = this;
        this.$document = $document;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.scopeListenerManager = scopeListenerManager;
        this.$timeout = $timeout;
        this.tplTableService = tplTableService;
        this.editableCell = [null, null];
        this.POSSIBLE_CONTENT_TYPES = ['TEXT', 'IMAGE'];
        this.POSSIBLE_RANGE_VALUES = [10, 25, 50, 100];
    }
    TplTableCtrl.prototype.$onInit = function () {
        if (this.checkBindings()) {
            this.tplTableService.addTable(angular.copy(this.opts));
            if (this.restoreTableStateBeforeDestroying() && this.onPageChange) {
                this.onPageChange({ new: vm.opts.paginationModel, old: vm.opts.paginationModel }); //TODO: find a better way
            }
            this.refreshPagination();
            this.resetEdit();
            this.setupListeners();
        }
    };
    // CONSTRUCTOR HELPER
    TplTableCtrl.prototype.checkBindings = function () {
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
    };
    TplTableCtrl.prototype.setupListeners = function () {
        var _this = this;
        this.scopeListenerManager.saveAddListener(this.$scope, this.$scope.$on('$destroy', function () {
            _this.saveTableStateBeforeDestroying();
        }));
    };
    // PUBLIC FUNCTIONS
    TplTableCtrl.prototype.toggleEditCell = function (event, rowIndex, columnIndex) {
        var _this = this;
        event.stopPropagation();
        this.editableCell[0] = rowIndex;
        this.editableCell[1] = columnIndex;
        this.tempEditColumnCopy = angular.copy(vm.opts.entries[rowIndex]);
        angular.forEach(this.tempEditColumnCopy, function (value, key) {
            if (value === '-' || value === '--' || value === '---') {
                _this.tempEditColumnCopy[key] = null;
            }
        });
        this.$document.find('body').bind('click', this.resetEdit);
    };
    TplTableCtrl.prototype.saveEditedColumn = function () {
        this.opts.entries[this.editableCell[0]] = this.tempEditColumnCopy;
        this.$rootScope.$emit('tpltable.datarow.edited.' + this.opts.id, this.editableCell[0], this.opts.entries[this.editableCell[0]]);
        this.editableCell[0] = null;
        this.editableCell[1] = null;
    };
    TplTableCtrl.prototype.getCellValue = function (row, cell) {
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
    TplTableCtrl.prototype.skipPagesForward = function () {
        var calculatedPage = vm.opts.paginationModel + MAX_PAGINATION_BUTTONS;
        if (calculatedPage > vm.opts.pageCount) {
            calculatedPage = vm.opts.pageCount;
        }
        this.setPage(calculatedPage, true);
    };
    TplTableCtrl.prototype.skipPagesBackward = function () {
        var calculatedPage = vm.opts.paginationModel - MAX_PAGINATION_BUTTONS;
        if (calculatedPage <= 0) {
            calculatedPage = 1;
        }
        this.setPage(calculatedPage, true);
    };
    TplTableCtrl.prototype.setEntriesPerPageCount = function (entriesPerPageCount, callback, old) {
        var oldEntriesPerPageCount = old || this.opts.entriesPerPageCount;
        this.opts.entriesPerPageCount = entriesPerPageCount;
        this.handleEntriesPerPageCount(this.opts.entriesPerPageCount, oldEntriesPerPageCount);
        if (callback && this.onPageSizeChange && this.opts.entriesPerPageCount !== oldEntriesPerPageCount) {
            this.onPageSizeChange({ new: this.opts.entriesPerPageCount, old: oldEntriesPerPageCount });
        }
    };
    TplTableCtrl.prototype.setPage = function (page, callback) {
        var old = this.opts.paginationModel;
        this.opts.paginationModel = page;
        this.refreshPagination();
        this.resetEdit();
        if (callback && this.onPageChange && this.opts.paginationModel !== old) {
            this.onPageChange({ new: this.opts.paginationModel, old: old });
        }
    };
    TplTableCtrl.prototype.setSearch = function (search, callback) {
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
        if (callback && this.onSearchChange && this.opts.searchModel !== old) {
            this.onSearchChange({ new: this.opts.searchModel, old: old });
        }
    };
    // HANDLERS
    TplTableCtrl.prototype.handleEntriesPerPageCount = function (newVal, oldVal) {
        if ((newVal || newVal === 0) && newVal !== oldVal) {
            this.setPage(1);
        }
    };
    TplTableCtrl.prototype.handleSearchChange = function (newVal, oldVal) {
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
    // HELPER
    TplTableCtrl.prototype.saveTableStateBeforeSearch = function () {
        this.tplTableService.setStateBeforeSearch(this.opts.id, {
            pageBeforeSearch: this.opts.paginationModel - 1,
            entriesPerPageCountBeforeSearch: this.opts.entriesPerPageCount
        });
    };
    TplTableCtrl.prototype.restoreTableStateBeforeSearch = function () {
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
    TplTableCtrl.prototype.saveTableStateBeforeDestroying = function () {
        this.tplTableService.setStateBeforeDetail(this.opts.id, {
            actualPage: this.opts.paginationModel - 1,
            actualSearch: this.opts.searchModel,
            actualEntriesPerPageCount: this.opts.entriesPerPageCount
        });
    };
    TplTableCtrl.prototype.restoreTableStateBeforeDestroying = function () {
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
    TplTableCtrl.prototype.refreshPagination = function () {
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
    TplTableCtrl.prototype.resetEdit = function (event) {
        vm.$timeout(function () {
            vm.editableCell[0] = null;
            vm.editableCell[1] = null;
            if (event) {
                event.stopPropagation();
            }
            vm.$document.find('body').unbind('click', vm.resetEdit);
        }, 0);
    };
    // SETTER
    TplTableCtrl.prototype.setPageCount = function (pageCount) {
        vm.opts.pageCount = pageCount;
        vm.refreshPagination();
        vm.resetEdit();
    };
    TplTableCtrl.prototype.setColumns = function (columns) {
        var _this = this;
        vm.opts.columns = columns;
        if (vm.opts.columns && vm.opts.columns.length) {
            angular.forEach(vm.opts.columns, function (column) {
                if (column.content && column.content !== '') {
                    var CONTENT_STRING = column.content.toUpperCase();
                    if (_this.POSSIBLE_CONTENT_TYPES.indexOf(CONTENT_STRING) < 0) {
                        column.content = _this.POSSIBLE_CONTENT_TYPES[CONTENT_TYPE_TEXT];
                    }
                    else {
                        column.content = CONTENT_STRING;
                    }
                }
                else {
                    column.content = _this.POSSIBLE_CONTENT_TYPES[CONTENT_TYPE_TEXT];
                }
            });
        }
    };
    return TplTableCtrl;
}());
TplTableCtrl.$inject = ['$scope', '$rootScope', '$document', '$timeout', 'tplTableService', '$log', 'scopeListenerManager'];
var BINDINGS = {
    tplTableOptions: '<',
    onSearchChange: '&?',
    onPageChange: '&?',
    onPageSizeChange: '&?',
    onRowClick: '&?',
    onAdd: '&?',
    onDelete: '&?',
    onAssign: '&?',
    onEdit: '&?',
    onConfirm: '&?'
};
var TplTableComponent = {
    template: "\n    <div class=\"top-row\">\n      <div ng-if=\"tplTableCtrl.opts.entriesPerPageCount && tplTableCtrl.opts.showPagination\" class=\"elementsperside__select prettyselect\">\n        <select ng-model=\"tplTableCtrl.opts.entriesPerPageCount\" ng-options=\"o as o for o in tplTableCtrl.POSSIBLE_RANGE_VALUES\" ng-style=\"{'color': tplTableCtrl.opts.colors.secondaryColor}\" ng-change=\"tplTableCtrl.entriesPerPageCount = '{{tplTableCtrl.opts.entriesPerPageCount}}'; tplTableCtrl.setEntriesPerPageCount(tplTableCtrl.opts.entriesPerPageCount, true, tplTableCtrl.entriesPerPageCount)\" class=\"top-row__entry-count input-sm\"></select>\n      </div><span ng-if=\"tplTableCtrl.opts.entriesPerPageCount && tplTableCtrl.opts.showPagination\" class=\"elementsperside__label\">{{ 'TABLE_ENTRIES_PER_SITE' | translate }} {{dataOrder}}</span>\n      <form ng-if=\"tplTableCtrl.opts.searchModel!==null\" ng-submit=\"tplTableCtrl.setSearch(tplTableCtrl.searchInput, true)\">\n        <input type=\"text\" ng-model=\"tplTableCtrl.searchInput\" placeholder=\"{{tplTableCtrl.opts.searchPlaceholderText|translate}}\" class=\"top-row__search\"/>\n      </form>\n    </div>\n    <table class=\"tpltable\">\n      <thead class=\"tpltable__head\">\n        <tr>\n          <th ng-repeat=\"column in tplTableCtrl.opts.columns\" ng-if=\"!column.ngIf || column.ngIf()\"><span ng-if=\"!column.translateColumn\">{{column.name}}</span><span ng-if=\"column.translateColumn\">{{column.name | translate}}</span></th>\n          <th ng-if=\"tplTableCtrl.opts.showActionsColumn\" class=\"edit\">Aktionen</th>\n        </tr>\n      </thead>\n      <tbody class=\"tpltable__body\">\n        <tr ng-if=\"!tplTableCtrl.opts.entries || !tplTableCtrl.opts.entries.length || tplTableCtrl.opts.loading\" class=\"tpltable__row--placeholder\">\n          <td colspan=\"{{tplTableCtrl.opts.entrieValuesOrder.length + (tplTableCtrl.opts.showActionsColumn ? 1 : 0)}}\"><span ng-if=\"!tplTableCtrl.opts.loading\">{{tplTableCtrl.opts.noDataAvailableText | translate}}</span>\n            <loadingpoints ng-if=\"tplTableCtrl.opts.loading\"></loadingpoints>\n          </td>\n        </tr>\n        <tr ng-if=\"tplTableCtrl.opts.entries && tplTableCtrl.opts.entries.length\" ng-repeat=\"row in tplTableCtrl.opts.entries\">\n          <td ng-repeat=\"cell in tplTableCtrl.opts.entrieValuesOrder\" ng-mouseleave=\"hover=false\" ng-mouseenter=\"hover=true\" ng-style=\"tplTableCtrl.editableCell[0]===$parent.$parent.$index && {'background-color': tplTableCtrl.opts.colors.primaryColor, 'color': tplTableCtrl.opts.colors.primaryFontColor}\" ng-class=\"{'clickable': tplTableCtrl.onRowClick, 'notclickable': !tplTableCtrl.onRowClick || tplTableCtrl.editableCell[0]!==null}\" ng-click=\"!tplTableCtrl.onRowClick || tplTableCtrl.editableCell[0]!==null || tplTableCtrl.onRowClick({$index: $parent.$parent.$index})\" ng-if=\"!tplTableCtrl.opts.columns[$index].ngIf || tplTableCtrl.opts.columns[$index].ngIf()\">\n            <div ng-if=\"(tplTableCtrl.editableCell[0]!==$parent.$parent.$parent.$index || tplTableCtrl.editableCell[1]!==$index || !tplTableCtrl.opts.columns[$index].editable)\">\n              <div ng-if=\"tplTableCtrl.opts.columns[$index].content === tplTableCtrl.POSSIBLE_CONTENT_TYPES[0]\" class=\"cell__text\"><span ng-if=\"!tplTableCtrl.opts.columns[$index].translateValues\">{{(cell.indexOf('.') !== -1 ? tplTableCtrl.getCellValue(row, cell) : row[cell]) | checkmark}} {{columnValues[$index]}}</span><span ng-if=\"tplTableCtrl.opts.columns[$index].translateValues\">{{((tplTableCtrl.opts.columns[$index].translateValuePrefix ? tplTableCtrl.opts.columns[$index].translateValuePrefix : '') + (cell.indexOf('.') !== -1 ? tplTableCtrl.getCellValue(row, cell) : row[cell])) | translate}} {{columnValues[$index]}}</span></div>\n              <div ng-if=\"tplTableCtrl.opts.columns[$index].content === tplTableCtrl.POSSIBLE_CONTENT_TYPES[1]\" class=\"cell__image\"><img ng-src=\"{{row[cell]}}\" ng-style=\"{'max-width': tplTableCtrl.opts.columns[$index].maxWidth ? tplTableCtrl.opts.columns[$index].maxWidth : '250px', 'max-height': tplTableCtrl.opts.columns[$index].maxHeight ? tplTableCtrl.opts.columns[$index].maxHeight : '250px'}\"/></div>\n            </div><span ng-if=\"tplTableCtrl.editableCell[1]===$index && tplTableCtrl.editableCell[0]===$parent.$index && tplTableCtrl.opts.columns[$index].editable\">\n              <input type=\"text\" ng-model=\"tplTableCtrl.tempEditColumnCopy[cell]\" focus-me=\"tplTableCtrl.editableCell[1]===$index && tplTableCtrl.editableCell[0]===$parent.$parent.$index\" ng-click=\"$event.stopPropagation()\" ng-keyup=\"$event.keyCode == 13 && tplTableCtrl.saveEditedColumn()\" class=\"edit-input\"/>{{columnValues[$index]}}</span>\n            <div ng-if=\"tplTableCtrl.opts.columns[$index].editable && hover\" ng-click=\"tplTableCtrl.toggleEditCell($event, $parent.$parent.$index, $index)\" ng-style=\"hoverEdit && {'background-color': tplTableCtrl.opts.colors.primaryColor, 'color': tplTableCtrl.opts.colors.primaryFontColor}\" ng-mouseenter=\"hoverEdit=true\" ng-mouseleave=\"hoverEdit=false\" class=\"cell-controll edit\">\n              <div ng-if=\"hover\" class=\"iconfont tbl-iconfont-pen\"></div>\n            </div>\n            <div ng-if=\"tplTableCtrl.opts.columns[$index].editable && tplTableCtrl.editableCell[0]===$parent.$index && tplTableCtrl.editableCell[1]===$index\" ng-style=\"{'background-color': tplTableCtrl.opts.colors.secondaryColor, 'color': tplTableCtrl.opts.colors.secondaryFontColor}\" ng-click=\"$parent.hover=false;tplTableCtrl.saveEditedColumn()\" class=\"cell-controll save\">\n              <div class=\"iconfont iconfont-check\"></div>\n            </div>\n          </td>\n          <td ng-if=\"tplTableCtrl.opts.showActionsColumn\" class=\"edit\"><span ng-if=\"tplTableCtrl.onAssign\" ng-click=\"!tplTableCtrl.onAssign || tplTableCtrl.editableCell[0]!==null || tplTableCtrl.onAssign({$index: $index})\" class=\"tbl-iconfont tbl-iconfont-export\"></span><span ng-if=\"tplTableCtrl.onEdit\" ng-click=\"!tplTableCtrl.onEdit || tplTableCtrl.editableCell[0]!==null || tplTableCtrl.onEdit({$index: $index})\" class=\"tbl-iconfont tbl-iconfont-pen\"></span><span ng-if=\"tplTableCtrl.onDelete\" ng-click=\"!tplTableCtrl.onDelete || tplTableCtrl.editableCell[0]!==null || tplTableCtrl.onDelete({$index: $index})\" class=\"tbl-iconfont tbl-iconfont-delete\"></span><span ng-if=\"tplTableCtrl.onAdd\" ng-click=\"!tplTableCtrl.onAdd || tplTableCtrl.editableCell[0] !== null || tplTableCtrl.onAdd({$index: $index})\" class=\"icon icon-cal-button\"></span><span ng-if=\"tplTableCtrl.onConfirm\" ng-click=\"!tplTableCtrl.onConfirm || tplTableCtrl.editableCell[0]!=null || tplTableCtrl.onConfirm({$index: $index})\" class=\"iconfont iconfont-check\"></span></td>\n        </tr>\n      </tbody>\n    </table>\n    <div ng-if=\"tplTableCtrl.opts.paginationModel && tplTableCtrl.opts.showPagination\" class=\"bottom-row\">\n      <div class=\"paginator\">\n        <div ng-class=\"{'inactive': tplTableCtrl.opts.paginationModel === 1}\" ng-style=\"tplTableCtrl.opts.paginationModel !== 1 && !pageFirstHover && {'color': tplTableCtrl.opts.colors.secondaryColor} || tplTableCtrl.opts.paginationModel !== 1 && pageFirstHover && {'color': tplTableCtrl.opts.colors.secondaryColor, 'background-color': tplTableCtrl.opts.colors.primaryColor}\" ng-disabled=\"tplTableCtrl.opts.paginationModel === 1\" ng-click=\"tplTableCtrl.setPage(1, true)\" ng-mouseenter=\"pageFirstHover=true\" ng-mouseleave=\"pageFirstHover=false\" class=\"paginator__first\">{{'TABLE_PAGING_START'|translate}}</div>\n        <div ng-if=\"tplTableCtrl.paginationStart > 1\" ng-click=\"tplTableCtrl.skipPagesBackward()\" ng-style=\"pageMid1Hover && {'color': tplTableCtrl.opts.colors.secondaryColor, 'background-color': tplTableCtrl.opts.colors.primaryColor} || {'color': tplTableCtrl.opts.colors.secondaryColor}\" ng-mouseenter=\"pageMid1Hover=true\" ng-mouseleave=\"pageMid1Hover=false\" class=\"paginator__mid\">...</div>\n        <div ng-class=\"{'active': i === tplTableCtrl.opts.paginationModel}\" ng-repeat=\"i in [tplTableCtrl.paginationStart, tplTableCtrl.paginationEnd] | toRange\" ng-click=\"tplTableCtrl.setPage(i, true)\" ng-style=\"i !== tplTableCtrl.opts.paginationModel && !pageMidHover && {'color': tplTableCtrl.opts.colors.secondaryColor} || i !== tplTableCtrl.opts.paginationModel && pageMidHover && {'background-color': tplTableCtrl.opts.colors.primaryColor, 'color': tplTableCtrl.opts.colors.secondaryColor} || {'color': tplTableCtrl.opts.colors.secondaryFontColor, 'background-color': tplTableCtrl.opts.colors.secondaryColor}\" ng-mouseenter=\"pageMidHover=true\" ng-mouseleave=\"pageMidHover=false\" class=\"paginator__mid\">{{i}}</div>\n        <div ng-if=\"tplTableCtrl.paginationEnd < tplTableCtrl.opts.pageCount\" ng-click=\"tplTableCtrl.skipPagesForward()\" ng-style=\"pageMid2Hover && {'color': tplTableCtrl.opts.colors.secondaryColor, 'background-color': tplTableCtrl.opts.colors.primaryColor} || {'color': tplTableCtrl.opts.colors.secondaryColor}\" ng-mouseenter=\"pageMid2Hover=true\" ng-mouseleave=\"pageMid2Hover=false\" class=\"paginator__mid\">...</div>\n        <div ng-class=\"{'inactive': tplTableCtrl.opts.paginationModel === tplTableCtrl.opts.pageCount}\" ng-style=\"tplTableCtrl.opts.paginationModel !== tplTableCtrl.opts.pageCount && !pageLastHover && {'color': tplTableCtrl.opts.colors.secondaryColor} || tplTableCtrl.opts.paginationModel !== tplTableCtrl.opts.pageCount && pageLastHover && {'color': tplTableCtrl.opts.colors.secondaryColor, 'background-color': tplTableCtrl.opts.colors.primaryColor}\" ng-disabled=\"tplTableCtrl.opts.paginationModel === tplTableCtrl.opts.pageCount\" ng-click=\"tplTableCtrl.setPage(tplTableCtrl.opts.pageCount, true)\" ng-mouseenter=\"pageLastHover=true\" ng-mouseleave=\"pageLastHover=false\" class=\"paginator__last\">{{'TABLE_PAGING_END'|translate}}</div>\n      </div>\n    </div>\n  ",
    controller: TplTableCtrl,
    controllerAs: 'tplTableCtrl',
    bindings: BINDINGS
};
exports.TplTableComponent = TplTableComponent;
//# sourceMappingURL=tpl-table.component.js.map