let vm;
export default class TplTableCtrl {
  constructor($scope, $rootScope, $document, $timeout, tplTableService, $log, scopeListenerManager) {
    vm = this;


    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$document = $document;
    this.$timeout = $timeout;
    this.$log = $log;

    this.tplTableService = tplTableService;
    this.scopeListenerManager = scopeListenerManager;


    this.initialLoad = true;
    this.MAX_PAGINATION_BUTTONS = 5;

    this.POSSIBLE_RANGE_VALUES = [10, 25, 50, 100];

    this.POSSIBLE_CONTENT_TYPES = ['TEXT', 'IMAGE'];
    this.CONTENT_TYPE_TEXT = 0;
    this.CONTENT_TYPE_IMAGE = 1;

    this.editableCell = [null, null];

    this.opts.id = this.opts.id || 'tpltable';
    this.opts.loading = this.opts.loading || false;
    this.opts.noDataAvailableText = this.opts.noDataAvailableText || 'No Data Available ...';
    this.opts.showActionsColumn = this.opts.showActionsColumn || false;
    this.opts.searchModel = this.opts.searchModel !== undefined ? this.opts.searchModel : null;
    this.opts.showPagination = this.opts.showPagination !== null && this.opts.showPagination !== undefined ? this.opts.showPagination : true;
    this.opts.paginationModel = this.opts.paginationModel || null;
    this.opts.pageCount = this.opts.pageCount || null;
    this.opts.entriesPerPageCount = this.opts.entriesPerPageCount || null;
    this.opts.entries = this.opts.entries || [];
    this.opts.entrieValuesOrder = this.opts.entrieValuesOrder || null;
    this.opts.onRowClick = this.opts.onRowClick || null;
    this.opts.columns = this.opts.columns || [
                                          {
                                            name : '',
                                            editable : true,
                                            unit: null,
                                            content: this.POSSIBLE_CONTENT_TYPES[this.CONTENT_TYPE_TEXT]
                                          },
                                          {
                                            name : '',
                                            editable : true,
                                            unit: null,
                                            content: this.POSSIBLE_CONTENT_TYPES[this.CONTENT_TYPE_TEXT]
                                          },
                                          {
                                            name : '',
                                            editable : true,
                                            unit: null,
                                            content: this.POSSIBLE_CONTENT_TYPES[this.CONTENT_TYPE_TEXT]
                                          },
                                          {
                                            name : '',
                                            editable : true,
                                            unit: null,
                                            content: this.POSSIBLE_CONTENT_TYPES[this.CONTENT_TYPE_TEXT]
                                          }
                                         ];

    this.paginationStart = 1;
    this.paginationEnd = 1;
    this.opts.colors = this.opts.colors || {};
    this.opts.colors.primaryColor = this.opts.colors.primaryColor || 'e8f7fe';
    this.opts.colors.secondaryColor = this.opts.colors.secondaryColor || '004894';
    this.opts.colors.primaryFontColor = this.opts.colors.primaryFontColor || '333333';
    this.opts.colors.secondaryFontColor = this.opts.colors.secondaryFontColor || 'ffffff';


    this.tplTableService.addTable(angular.copy(this.opts));

    // RESTORE STATE BEFORE DETAIL
    var stateBeforeDetail = this.tplTableService.getStateBeforeDetail(this.opts.id);
    if (stateBeforeDetail) {
      var actualSearch = stateBeforeDetail.actualSearch || '';
      if (actualSearch.length) {
        this.opts.searchModel = actualSearch;
      }

      var actualPage = Number(stateBeforeDetail.actualPage);
      if (actualPage >= 0) {
        this.opts.paginationModel = stateBeforeDetail.actualPage + 1;
      }

      var actualEntriesPerPageCount = Number(stateBeforeDetail.actualEntriesPerPageCount);
      if (actualEntriesPerPageCount > 0) {
        this.opts.entriesPerPageCount = actualEntriesPerPageCount;
      }
    }

    this.setupListeners();
  }

  setupListeners() {
    this.scopeListenerManager.saveAddListener(this.$scope, this.$scope.$on('$destroy', () => {
      this.tplTableService.setStateBeforeDetail(vm.opts.id, {
        actualPage: vm.opts.paginationModel - 1,
        actualSearch: vm.opts.searchModel,
        actualEntriesPerPageCount: vm.opts.entriesPerPageCount
      });
    }));

    this.scopeListenerManager.saveAddListener(this.$scope, this.$scope.$watch('vm.opts.searchModel', (newVal, oldVal) => {
      if ((oldVal === '' || !oldVal) && newVal !== oldVal) { // Search started
        this.tplTableService.setStateBeforeSearch(vm.opts.id, {
          pageBeforeSearch: vm.opts.paginationModel - 1,
          entriesPerPageCountBeforeSearch: vm.opts.entriesPerPageCount
        });

        if (vm.opts.paginationModel === 1) { // from page 1
        } else {
          vm.opts.paginationModel = 1;
          this.refreshPagination();
        }
      } else if ((newVal === '' || !newVal) && !this.initialLoad) { // Search ended
        var state = this.tplTableService.getStateBeforeSearch(vm.opts.id);
        if (state) {
          if (state.pageBeforeSearch >= 0) {
            if (vm.opts.paginationModel === 1 && (state.pageBeforeSearch + 1) === vm.opts.paginationModel) { // from page 1
            }
            vm.opts.paginationModel = state.pageBeforeSearch + 1;

            if (state.entriesPerPageCountBeforeSearch > 0) {
              vm.opts.entriesPerPageCount = state.entriesPerPageCountBeforeSearch;
            }

            this.tplTableService.setStateBeforeSearch(vm.opts.id, {
              pageBeforeSearch: null,
              entriesPerPageCountBeforeSearch: null
            });
          }
        }
      } else if (newVal !== oldVal) { // New search after search started
        if (vm.opts.paginationModel === 1) {
        } else {
          vm.opts.paginationModel = 1;
          this.refreshPagination();
        }
      } else if (newVal === oldVal) {} // Init or returned to list
      this.initialLoad = false;
    }));

    this.scopeListenerManager.saveAddListener(this.$scope, this.$scope.$watch('vm.opts.paginationModel', (newVal, oldVal) => {
      if (newVal === oldVal || newVal !== oldVal) { // Init, new page, search start or search end, returned to list
        if (vm.opts.searchModel !== '') { // Check for active search
          if (newVal === oldVal) { // Returned to list
              var state = this.tplTableService.getStateBeforeDetail(vm.opts.id);
              if (state) {
                if (state.actualPage >= 0) {
                  vm.opts.paginationModel = state.actualPage + 1;

                  if (state.actualSearch) {
                    vm.opts.searchModel = state.actualSearch;
                    vm.searchInput = vm.opts.searchModel;
                  }

                  if (state.actualEntriesPerPageCount > 0) {
                    vm.opts.entriesPerPageCount = state.actualEntriesPerPageCount;
                  }

                  this.tplTableService.setStateBeforeDetail(vm.opts.id, {
                    actualPage: null,
                    actualSearch: null,
                    actualEntriesPerPageCount: null
                  });
                } else {}
              }
          } else {} // or search started
        } else if (!this.initialLoad) {} // Returned to list without search
        this.initialLoad = false;
      }
    }));

    this.scopeListenerManager.saveAddListener(this.$scope, this.$scope.$watch('vm.opts.entriesPerPageCount', (newVal, oldVal) => {
      if ((newVal || newVal === 0) && newVal !== oldVal) {
        vm.opts.paginationModel = 1;
        this.resetEdit();
      }
    }));

    this.scopeListenerManager.saveAddListener(this.$scope, this.$scope.$watch('vm.opts.pageCount', (newVal) => {
      if (newVal || newVal === 0) {
        this.refreshPagination();
        this.resetEdit();
      }
    }));

    this.scopeListenerManager.saveAddListener(this.$scope, this.$scope.$watchCollection('vm.opts.columns', (newVal) => {
      if (newVal && newVal.length) {

        angular.forEach(newVal, (column) => {
          if (column.content && column.content !== '') {

            var contentString = column.content.toUpperCase();
            if (vm.POSSIBLE_CONTENT_TYPES.indexOf(contentString) < 0) {
              column.content = vm.POSSIBLE_CONTENT_TYPES[vm.CONTENT_TYPE_TEXT];
            } else {
              column.content = contentString;
            }

          } else {
            column.content = vm.POSSIBLE_CONTENT_TYPES[vm.CONTENT_TYPE_TEXT];
          }
        });

      }
    }));
  }

  // FUNCTIONS
  refreshPagination() {
    var calculatedStart = vm.opts.paginationModel - ((this.MAX_PAGINATION_BUTTONS - 1) / 2);
    if (calculatedStart > 0) {
      vm.paginationStart = calculatedStart;
    } else {
      vm.paginationStart = 1;
    }

    var calculatedEnd = vm.opts.paginationModel + ((this.MAX_PAGINATION_BUTTONS - 1) / 2);
    if (calculatedEnd <= vm.opts.pageCount && (calculatedEnd - vm.paginationStart) === 5) {
      vm.paginationEnd = calculatedEnd;
    } else if (vm.paginationStart + (this.MAX_PAGINATION_BUTTONS - 1) <= vm.opts.pageCount) {
      vm.paginationEnd = vm.paginationStart + (this.MAX_PAGINATION_BUTTONS - 1);
    } else {
      vm.paginationEnd = vm.opts.pageCount;
    }
  }

  skipPagesForward() {
    var calculatedPage = vm.opts.paginationModel + this.MAX_PAGINATION_BUTTONS;
    if (calculatedPage <= vm.dataPageCount) {
      vm.opts.paginationModel += this.MAX_PAGINATION_BUTTONS;
    } else {
      vm.opts.paginationModel = vm.opts.pageCount;
    }
    this.refreshPagination();
    this.resetEdit();

    this.onPageChange();
  }

  skipPagesBackward() {
    var calculatedPage = vm.opts.paginationModel- this.MAX_PAGINATION_BUTTONS;
    if (calculatedPage > 0) {
      vm.opts.paginationModel = calculatedPage;
    } else {
      vm.opts.paginationModel = 1;
    }
    this.refreshPagination();
    this.resetEdit();

    this.onPageChange();
  }

  setPage(page) {
    vm.opts.paginationModel = page;
    this.refreshPagination();
    this.resetEdit();

    this.onPageChange();
  }

  setSearch() {
    vm.opts.searchModel = vm.searchInput;
    this.resetEdit();

    this.onSearchChange();
  }

  resetEdit(event) {
    this.$timeout(() => {
      vm.editableCell[0] = null;
      vm.editableCell[1] = null;
      if (event) {
        event.stopPropagation();
      }
      this.$document.find('body').unbind('click', this.resetEdit);
    }, 0);
  }

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
    var levels = cell.split('.');
    var levelsMap = {
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
}