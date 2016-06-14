import * as angular from 'angular';

let vm;
const MAX_PAGINATION_BUTTONS: number = 5;
const CONTENT_TYPE_TEXT: number = 0;

class TplTableCtrl {
  editableCell: any[];
  entriesPerPageCount: number;
  onPageChange: (model: {new: any, old: any}) => {};
  onPageSizeChange: (model: { new: any, old: any }) => {};
  onSearchChange: (model: { new: any, old: any }) => {};
  opts: any;
  paginationStart: number;
  paginationEnd: number;
  POSSIBLE_CONTENT_TYPES: string[];
  POSSIBLE_RANGE_VALUES: number[];
  tplTableOptions: any;

  private $document: angular.IDocumentService;
  private $log: angular.ILogService;
  private $rootScope: angular.IRootScopeService;
  private $scope: angular.IScope;
  private scopeListenerManager: any;
  private $timeout: angular.ITimeoutService;
  private tplTableService: any;

  constructor($scope: angular.IScope, $rootScope: angular.IRootScopeService, $document: angular.IDocumentService, $timeout: angular.ITimeoutService, tplTableService: any, $log: angular.ILogService, scopeListenerManager: any) {
    vm = this;

    this.$document = $document;
    this.$log = $log;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.scopeListenerManager = scopeListenerManager;
    this.$timeout = $timeout;
    this.tplTableService = tplTableService;


    this.POSSIBLE_RANGE_VALUES = [10, 25, 50, 100];
    this.POSSIBLE_CONTENT_TYPES = ['TEXT', 'IMAGE'];
    this.editableCell = [null, null];
  }

  $onInit() {
    if (this.checkBindings()) {
      this.tplTableService.addTable(angular.copy(this.opts));

      if (this.restoreTableStateBeforeDestroying() && this.onPageChange) {
        this.onPageChange({ new: vm.opts.paginationModel, old: vm.opts.paginationModel }); //TODO: find a better way
      }

      this.refreshPagination();
      this.resetEdit();

      this.setupListeners();
    }
  }

  // CONSTRUCTOR HELPER
  checkBindings() {
    this.opts = this.tplTableOptions;

    if (this.opts) {
      this.opts.setPageCount = this.setPageCount;
      this.opts.setColumns = this.setColumns;

      this.opts.id = this.opts.id || 'tpltable';
      this.opts.loading = this.opts.loading || false;
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
                                              name : '',
                                              editable : true,
                                              unit: null,
                                              content: this.POSSIBLE_CONTENT_TYPES[CONTENT_TYPE_TEXT]
                                            },
                                            {
                                              name : '',
                                              editable : true,
                                              unit: null,
                                              content: this.POSSIBLE_CONTENT_TYPES[CONTENT_TYPE_TEXT]
                                            },
                                            {
                                              name : '',
                                              editable : true,
                                              unit: null,
                                              content: this.POSSIBLE_CONTENT_TYPES[CONTENT_TYPE_TEXT]
                                            },
                                            {
                                              name : '',
                                              editable : true,
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

  setupListeners() {
    this.scopeListenerManager.saveAddListener(this.$scope, this.$scope.$on('$destroy', () => {
      this.saveTableStateBeforeDestroying();
    }));
  }

  // PUBLIC FUNCTIONS
  toggleEditCell(event, rowIndex, columnIndex) {
    event.stopPropagation();
    vm.editableCell[0] = rowIndex;
    vm.editableCell[1] = columnIndex;
    vm.tempEditColumnCopy = angular.copy(vm.opts.entries[rowIndex]);
    angular.forEach(vm.tempEditColumnCopy, (value, key) => {
      if (value === '-' || value === '--' || value === '---') {
        vm.tempEditColumnCopy[key] = null;
      }
    });

    this.$document.find('body').bind('click', this.resetEdit);
  }

  saveEditedColumn() {
    vm.opts.entries[vm.editableCell[0]] = vm.tempEditColumnCopy;

    this.$rootScope.$emit('tpltable.datarow.edited.' + vm.opts.id,
      vm.editableCell[0],
      vm.opts.entries[vm.editableCell[0]]);

    vm.editableCell[0] = null;
    vm.editableCell[1] = null;
  }

  getCellValue(row, cell) {
    let levels = cell.split('.');
    let levelsMap = {
      2: () => {
        return row[levels[0]] ? row[levels[0]][levels[1]] : '-';
      },
      3: () => {
        return row[levels[0]] ? (row[levels[0]][levels[1]] ? row[levels[0]][levels[1]][levels[2]] : '-') : '-';
      },
      4: () => {
        return row[levels[0]] ? (row[levels[0]][levels[1]] ? (row[levels[0]][levels[1]][levels[2]] ? row[levels[0]][levels[1]][levels[2]][levels[3]] : '-') : '-') : '-';
      }
    };

    return levelsMap[levels.length] ? levelsMap[levels.length]() : '';
  }

  skipPagesForward() {
    let calculatedPage = vm.opts.paginationModel + MAX_PAGINATION_BUTTONS;
    if (calculatedPage > vm.opts.pageCount) {
      calculatedPage = vm.opts.pageCount;
    }

    this.setPage(calculatedPage, true);
  }

  skipPagesBackward() {
    let calculatedPage = vm.opts.paginationModel - MAX_PAGINATION_BUTTONS;
    if (calculatedPage <= 0) {
      calculatedPage = 1;
    }

    this.setPage(calculatedPage, true);
  }

  setEntriesPerPageCount(entriesPerPageCount, callback?, old?) {
    let oldEntriesPerPageCount = old || vm.opts.entriesPerPageCount;
    vm.opts.entriesPerPageCount = entriesPerPageCount;

    this.handleEntriesPerPageCount(vm.opts.entriesPerPageCount, oldEntriesPerPageCount);

    if (callback && this.onPageSizeChange && vm.opts.entriesPerPageCount !== oldEntriesPerPageCount) {
      this.onPageSizeChange({new: vm.opts.entriesPerPageCount, old: oldEntriesPerPageCount});
    }
  }

  setPage(page, callback?) {
    let old = vm.opts.paginationModel;
    vm.opts.paginationModel = page;

    this.refreshPagination();
    this.resetEdit();

    // this.handlePageChange(vm.opts.paginationModel, old);

    if (callback && this.onPageChange && vm.opts.paginationModel !== old) {
      this.onPageChange({new: vm.opts.paginationModel, old: old});
    }
  }

  setSearch(search, callback?) {
    let old = vm.opts.searchModel;

    if (search) {
      vm.opts.searchModel = search;
      vm.searchInput = search;
    } else {
      vm.opts.searchModel = vm.searchInput;
    }

    this.resetEdit();

    this.handleSearchChange(vm.opts.searchModel, old);

    if (callback && this.onSearchChange && vm.opts.searchModel !== old) {
      this.onSearchChange({new: vm.opts.searchModel, old: old});
    }
  }

  // HANDLERS
  handleEntriesPerPageCount(newVal, oldVal) {
    if ((newVal || newVal === 0) && newVal !== oldVal) {
      this.setPage(1);
    }
  }

  handleSearchChange(newVal, oldVal) {
    if ((oldVal === '' || !oldVal) && newVal !== oldVal) { // Search started
      this.saveTableStateBeforeSearch();

      if (vm.opts.paginationModel !== 1) {
        this.setPage(1);
      }
    } else if ((newVal === '' || !newVal)) { // Search ended
      this.restoreTableStateBeforeSearch();
    } else if (newVal !== oldVal) { // New search after search started
      if (vm.opts.paginationModel !== 1) {
        this.setPage(1);
      }
    } // Init or returned to list
  }

  // handlePageChange(newVal, oldVal) {
    // Init, new page, search start or search end, returned to list
  // }

  // HELPER
  saveTableStateBeforeSearch() {
    this.tplTableService.setStateBeforeSearch(vm.opts.id, {
      pageBeforeSearch: vm.opts.paginationModel - 1,
      entriesPerPageCountBeforeSearch: vm.opts.entriesPerPageCount
    });
  }

  restoreTableStateBeforeSearch() {
    const state = this.tplTableService.getStateBeforeSearch(vm.opts.id);
    if (state) {
      if (state.pageBeforeSearch >= 0) {
        if (state.entriesPerPageCountBeforeSearch) {
          this.setEntriesPerPageCount(state.entriesPerPageCountBeforeSearch);
        }

        this.setPage(state.pageBeforeSearch + 1);

        this.tplTableService.setStateBeforeSearch(vm.opts.id, {
          pageBeforeSearch: null,
          entriesPerPageCountBeforeSearch: null
        });
      }
    }
  }

  saveTableStateBeforeDestroying() {
    this.tplTableService.setStateBeforeDetail(vm.opts.id, {
      actualPage: vm.opts.paginationModel - 1,
      actualSearch: vm.opts.searchModel,
      actualEntriesPerPageCount: vm.opts.entriesPerPageCount
    });
  }

  restoreTableStateBeforeDestroying() {
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

      this.tplTableService.setStateBeforeDetail(vm.opts.id, {
        actualPage: null,
        actualSearch: null,
        actualEntriesPerPageCount: null
      });

      return true;
    }
    return false;
  }

  refreshPagination() {
    let calculatedStart = vm.opts.paginationModel - ((MAX_PAGINATION_BUTTONS - 1) / 2);
    if (calculatedStart > 0) {
      vm.paginationStart = calculatedStart;
    } else {
      vm.paginationStart = 1;
    }

    let calculatedEnd = vm.opts.paginationModel + ((MAX_PAGINATION_BUTTONS - 1) / 2);
    if (calculatedEnd <= vm.opts.pageCount && (calculatedEnd - vm.paginationStart) === 5) {
      vm.paginationEnd = calculatedEnd;
    } else if (vm.paginationStart + (MAX_PAGINATION_BUTTONS - 1) <= vm.opts.pageCount) {
      vm.paginationEnd = vm.paginationStart + (MAX_PAGINATION_BUTTONS - 1);
    } else {
      vm.paginationEnd = vm.opts.pageCount;
    }
  }

  resetEdit(event?) {
    this.$timeout(() => {
      vm.editableCell[0] = null;
      vm.editableCell[1] = null;
      if (event) {
        event.stopPropagation();
      }
      this.$document.find('body').unbind('click', this.resetEdit);
    }, 0);
  }

  // GETTER AND SETTER
  setPageCount(pageCount) {
    vm.opts.pageCount = pageCount;

    vm.refreshPagination();
    vm.resetEdit();
  }

  setColumns(columns) {
    vm.opts.columns = columns;

    if (vm.opts.columns && vm.opts.columns.length) {
      angular.forEach(vm.opts.columns, (column) => {
        if (column.content && column.content !== '') {

          const contentString = column.content.toUpperCase();
          if (this.POSSIBLE_CONTENT_TYPES.indexOf(contentString) < 0) {
            column.content = this.POSSIBLE_CONTENT_TYPES[CONTENT_TYPE_TEXT];
          } else {
            column.content = contentString;
          }

        } else {
          column.content = this.POSSIBLE_CONTENT_TYPES[CONTENT_TYPE_TEXT];
        }
      });
    }
  }
}
TplTableCtrl.$inject = ['$scope', '$rootScope', '$document', '$timeout', 'tplTableService', '$log', 'scopeListenerManager'];


const BINDINGS: { [binding: string]: string } = {
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

const TplTableComponent = {
  template: `
    <div class="top-row">
      <div ng-if="tplTableCtrl.opts.entriesPerPageCount && tplTableCtrl.opts.showPagination" class="elementsperside__select prettyselect">
        <select ng-model="tplTableCtrl.opts.entriesPerPageCount" ng-options="o as o for o in tplTableCtrl.POSSIBLE_RANGE_VALUES" ng-style="{'color': tplTableCtrl.opts.colors.secondaryColor}" ng-change="tplTableCtrl.entriesPerPageCount = '{{tplTableCtrl.opts.entriesPerPageCount}}'; tplTableCtrl.setEntriesPerPageCount(tplTableCtrl.opts.entriesPerPageCount, true, tplTableCtrl.entriesPerPageCount)" class="top-row__entry-count input-sm"></select>
      </div><span ng-if="tplTableCtrl.opts.entriesPerPageCount && tplTableCtrl.opts.showPagination" class="elementsperside__label">{{ 'TABLE_ENTRIES_PER_SITE' | translate }} {{dataOrder}}</span>
      <form ng-if="tplTableCtrl.opts.searchModel!==null" ng-submit="tplTableCtrl.setSearch(tplTableCtrl.searchInput, true)">
        <input type="text" ng-model="tplTableCtrl.searchInput" placeholder="{{'TABLE_SEARCH'|translate}}" class="top-row__search"/>
      </form>
    </div>
    <table class="tpltable">
      <thead class="tpltable__head">
        <tr>
          <th ng-repeat="column in tplTableCtrl.opts.columns" ng-if="!column.ngIf || column.ngIf()"><span ng-if="!column.translateColumn">{{column.name}}</span><span ng-if="column.translateColumn">{{column.name | translate}}</span></th>
          <th ng-if="tplTableCtrl.opts.showActionsColumn" class="edit">Aktionen</th>
        </tr>
      </thead>
      <tbody class="tpltable__body">
        <tr ng-if="!tplTableCtrl.opts.entries || !tplTableCtrl.opts.entries.length || tplTableCtrl.opts.loading" class="tpltable__row--placeholder">
          <td colspan="{{tplTableCtrl.opts.entrieValuesOrder.length + (tplTableCtrl.opts.showActionsColumn ? 1 : 0)}}"><span ng-if="!tplTableCtrl.opts.loading">{{tplTableCtrl.opts.noDataAvailableText | translate}}</span>
            <loadingpoints ng-if="tplTableCtrl.opts.loading"></loadingpoints>
          </td>
        </tr>
        <tr ng-if="tplTableCtrl.opts.entries && tplTableCtrl.opts.entries.length" ng-repeat="row in tplTableCtrl.opts.entries">
          <td ng-repeat="cell in tplTableCtrl.opts.entrieValuesOrder" ng-mouseleave="hover=false" ng-mouseenter="hover=true" ng-style="tplTableCtrl.editableCell[0]===$parent.$parent.$index && {'background-color': tplTableCtrl.opts.colors.primaryColor, 'color': tplTableCtrl.opts.colors.primaryFontColor}" ng-class="{'clickable': tplTableCtrl.onRowClick, 'notclickable': !tplTableCtrl.onRowClick || tplTableCtrl.editableCell[0]!==null}" ng-click="!tplTableCtrl.onRowClick || tplTableCtrl.editableCell[0]!==null || tplTableCtrl.onRowClick({$index: $parent.$parent.$index})" ng-if="!tplTableCtrl.opts.columns[$index].ngIf || tplTableCtrl.opts.columns[$index].ngIf()">
            <div ng-if="(tplTableCtrl.editableCell[0]!==$parent.$parent.$parent.$index || tplTableCtrl.editableCell[1]!==$index || !tplTableCtrl.opts.columns[$index].editable)">
              <div ng-if="tplTableCtrl.opts.columns[$index].content === tplTableCtrl.POSSIBLE_CONTENT_TYPES[0]" class="cell__text"><span ng-if="!tplTableCtrl.opts.columns[$index].translateValues">{{(cell.indexOf('.') !== -1 ? tplTableCtrl.getCellValue(row, cell) : row[cell]) | checkmark}} {{columnValues[$index]}}</span><span ng-if="tplTableCtrl.opts.columns[$index].translateValues">{{((tplTableCtrl.opts.columns[$index].translateValuePrefix ? tplTableCtrl.opts.columns[$index].translateValuePrefix : '') + (cell.indexOf('.') !== -1 ? tplTableCtrl.getCellValue(row, cell) : row[cell])) | translate}} {{columnValues[$index]}}</span></div>
              <div ng-if="tplTableCtrl.opts.columns[$index].content === tplTableCtrl.POSSIBLE_CONTENT_TYPES[1]" class="cell__image"><img ng-src="{{row[cell]}}" ng-style="{'max-width': tplTableCtrl.opts.columns[$index].maxWidth ? tplTableCtrl.opts.columns[$index].maxWidth : '250px', 'max-height': tplTableCtrl.opts.columns[$index].maxHeight ? tplTableCtrl.opts.columns[$index].maxHeight : '250px'}"/></div>
            </div><span ng-if="tplTableCtrl.editableCell[1]===$index && tplTableCtrl.editableCell[0]===$parent.$index && tplTableCtrl.opts.columns[$index].editable">
              <input type="text" ng-model="tplTableCtrl.tempEditColumnCopy[cell]" focus-me="tplTableCtrl.editableCell[1]===$index && tplTableCtrl.editableCell[0]===$parent.$parent.$index" ng-click="$event.stopPropagation()" ng-keyup="$event.keyCode == 13 && tplTableCtrl.saveEditedColumn()" class="edit-input"/>{{columnValues[$index]}}</span>
            <div ng-if="tplTableCtrl.opts.columns[$index].editable && hover" ng-click="tplTableCtrl.toggleEditCell($event, $parent.$parent.$index, $index)" ng-style="hoverEdit && {'background-color': tplTableCtrl.opts.colors.primaryColor, 'color': tplTableCtrl.opts.colors.primaryFontColor}" ng-mouseenter="hoverEdit=true" ng-mouseleave="hoverEdit=false" class="cell-controll edit">
              <div ng-if="hover" class="iconfont tbl-iconfont-pen"></div>
            </div>
            <div ng-if="tplTableCtrl.opts.columns[$index].editable && tplTableCtrl.editableCell[0]===$parent.$index && tplTableCtrl.editableCell[1]===$index" ng-style="{'background-color': tplTableCtrl.opts.colors.secondaryColor, 'color': tplTableCtrl.opts.colors.secondaryFontColor}" ng-click="$parent.hover=false;tplTableCtrl.saveEditedColumn()" class="cell-controll save">
              <div class="iconfont iconfont-check"></div>
            </div>
          </td>
          <td ng-if="tplTableCtrl.opts.showActionsColumn" class="edit"><span ng-if="tplTableCtrl.onAssign" ng-click="!tplTableCtrl.onAssign || tplTableCtrl.editableCell[0]!==null || tplTableCtrl.onAssign({$index: $index})" class="tbl-iconfont tbl-iconfont-export"></span><span ng-if="tplTableCtrl.onEdit" ng-click="!tplTableCtrl.onEdit || tplTableCtrl.editableCell[0]!==null || tplTableCtrl.onEdit({$index: $index})" class="tbl-iconfont tbl-iconfont-pen"></span><span ng-if="tplTableCtrl.onDelete" ng-click="!tplTableCtrl.onDelete || tplTableCtrl.editableCell[0]!==null || tplTableCtrl.onDelete({$index: $index})" class="tbl-iconfont tbl-iconfont-delete"></span><span ng-if="tplTableCtrl.onAdd" ng-click="!tplTableCtrl.onAdd || tplTableCtrl.editableCell[0] !== null || tplTableCtrl.onAdd({$index: $index})" class="icon icon-cal-button"></span><span ng-if="tplTableCtrl.onConfirm" ng-click="!tplTableCtrl.onConfirm || tplTableCtrl.editableCell[0]!=null || tplTableCtrl.onConfirm({$index: $index})" class="iconfont iconfont-check"></span></td>
        </tr>
      </tbody>
    </table>
    <div ng-if="tplTableCtrl.opts.paginationModel && tplTableCtrl.opts.showPagination" class="bottom-row">
      <div class="paginator">
        <div ng-class="{'inactive': tplTableCtrl.opts.paginationModel === 1}" ng-style="tplTableCtrl.opts.paginationModel !== 1 && !pageFirstHover && {'color': tplTableCtrl.opts.colors.secondaryColor} || tplTableCtrl.opts.paginationModel !== 1 && pageFirstHover && {'color': tplTableCtrl.opts.colors.secondaryColor, 'background-color': tplTableCtrl.opts.colors.primaryColor}" ng-disabled="tplTableCtrl.opts.paginationModel === 1" ng-click="tplTableCtrl.setPage(1, true)" ng-mouseenter="pageFirstHover=true" ng-mouseleave="pageFirstHover=false" class="paginator__first">{{'TABLE_PAGING_START'|translate}}</div>
        <div ng-if="tplTableCtrl.paginationStart &gt; 1" ng-click="tplTableCtrl.skipPagesBackward()" ng-style="pageMid1Hover && {'color': tplTableCtrl.opts.colors.secondaryColor, 'background-color': tplTableCtrl.opts.colors.primaryColor} || {'color': tplTableCtrl.opts.colors.secondaryColor}" ng-mouseenter="pageMid1Hover=true" ng-mouseleave="pageMid1Hover=false" class="paginator__mid">...</div>
        <div ng-class="{'active': i === tplTableCtrl.opts.paginationModel}" ng-repeat="i in [tplTableCtrl.paginationStart, tplTableCtrl.paginationEnd] | toRange" ng-click="tplTableCtrl.setPage(i, true)" ng-style="i !== tplTableCtrl.opts.paginationModel && !pageMidHover && {'color': tplTableCtrl.opts.colors.secondaryColor} || i !== tplTableCtrl.opts.paginationModel && pageMidHover && {'background-color': tplTableCtrl.opts.colors.primaryColor, 'color': tplTableCtrl.opts.colors.secondaryColor} || {'color': tplTableCtrl.opts.colors.secondaryFontColor, 'background-color': tplTableCtrl.opts.colors.secondaryColor}" ng-mouseenter="pageMidHover=true" ng-mouseleave="pageMidHover=false" class="paginator__mid">{{i}}</div>
        <div ng-if="tplTableCtrl.paginationEnd &lt; tplTableCtrl.opts.pageCount" ng-click="tplTableCtrl.skipPagesForward()" ng-style="pageMid2Hover && {'color': tplTableCtrl.opts.colors.secondaryColor, 'background-color': tplTableCtrl.opts.colors.primaryColor} || {'color': tplTableCtrl.opts.colors.secondaryColor}" ng-mouseenter="pageMid2Hover=true" ng-mouseleave="pageMid2Hover=false" class="paginator__mid">...</div>
        <div ng-class="{'inactive': tplTableCtrl.opts.paginationModel === tplTableCtrl.opts.pageCount}" ng-style="tplTableCtrl.opts.paginationModel !== tplTableCtrl.opts.pageCount && !pageLastHover && {'color': tplTableCtrl.opts.colors.secondaryColor} || tplTableCtrl.opts.paginationModel !== tplTableCtrl.opts.pageCount && pageLastHover && {'color': tplTableCtrl.opts.colors.secondaryColor, 'background-color': tplTableCtrl.opts.colors.primaryColor}" ng-disabled="tplTableCtrl.opts.paginationModel === tplTableCtrl.opts.pageCount" ng-click="tplTableCtrl.setPage(tplTableCtrl.opts.pageCount, true)" ng-mouseenter="pageLastHover=true" ng-mouseleave="pageLastHover=false" class="paginator__last">{{'TABLE_PAGING_END'|translate}}</div>
      </div>
    </div>
  `,
  controller: TplTableCtrl,
  controllerAs: 'tplTableCtrl',
  bindings: BINDINGS
};
export { TplTableComponent };
