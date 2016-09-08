(function () {
  'use strict';
  angular.module('tpl.table', ['tpl.scope-listener-manager']);
}());
(function () {
  'use strict';
  /* jshint latedef: nofunc */
  /* @ngdoc filter
     * @name tpl.table.filter:checkmark
     * @description
     * Filter
    */
  angular.module('tpl.table').filter('checkmark', checkmark);
  function checkmark() {
    return checkmarkFilter;
    ////////////////
    function checkmarkFilter(input) {
      return typeof input === 'boolean' ? input ? '\u2713' : '\u2718' : input;
    }
  }
}());
(function () {
  'use strict';
  angular.module('tpl.table').directive('tplTable', function tpltable() {
    return {
      restrict: 'E',
      controller: 'TplTableCtrl',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'src/tpltable.directive.html',
      scope: { opts: '=tplTableOptions' }
    };
  }).directive('focusMe', [
    '$timeout',
    'scopeListenerManager',
    function ($timeout, scopeListenerManager) {
      return {
        link: function (scope, element, attrs) {
          scopeListenerManager.saveAddListener(scope, scope.$watch(attrs.focusMe, function (value) {
            if (value === true) {
              $timeout(function () {
                element[0].focus();
                scope[attrs.focusMe] = false;
              });
            }
          }));
        }
      };
    }
  ]).controller('TplTableCtrl', [
    '$scope',
    '$rootScope',
    '$document',
    '$timeout',
    'tplTableService',
    '$log',
    'scopeListenerManager',
    function TplTableCtrl($scope, $rootScope, $document, $timeout, tplTableService, $log, scopeListenerManager) {
      var vm = this;
      var initialLoad = true;
      var MAX_PAGINATION_BUTTONS = 5;
      vm.getCellValue = getCellValue;
      init();
      function init() {
        vm.POSSIBLE_RANGE_VALUES = [
          10,
          25,
          50,
          100
        ];
        vm.POSSIBLE_CONTENT_TYPES = [
          'TEXT',
          'IMAGE'
        ];
        vm.CONTENT_TYPE_TEXT = 0;
        vm.CONTENT_TYPE_IMAGE = 1;
        vm.editableCell = [
          null,
          null
        ];
        vm.opts.id = vm.opts.id || 'tpltable';
        vm.opts.loading = vm.opts.loading || false;
        vm.opts.noDataAvailableText = vm.opts.noDataAvailableText || 'No Data Available ...';
        vm.opts.showActionsColumn = vm.opts.showActionsColumn || false;
        vm.opts.searchModel = vm.opts.searchModel !== undefined ? vm.opts.searchModel : null;
        vm.opts.showPagination = vm.opts.showPagination !== null && vm.opts.showPagination !== undefined ? vm.opts.showPagination : true;
        vm.opts.paginationModel = vm.opts.paginationModel || null;
        vm.opts.pageCount = vm.opts.pageCount || null;
        vm.opts.entriesPerPageCount = vm.opts.entriesPerPageCount || null;
        vm.opts.entries = vm.opts.entries || [];
        vm.opts.entrieValuesOrder = vm.opts.entrieValuesOrder || null;
        vm.opts.onRowClick = vm.opts.onRowClick || null;
        // removed since version 1.2 and replaced by the 'actions'-object
        // vm.opts.onAssignBtnClick = vm.opts.onAssignBtnClick || null;
        // vm.opts.onEditBtnClick = vm.opts.onEditBtnClick || null;
        // vm.opts.onDeleteBtnClick = vm.opts.onDeleteBtnClick || null;
        // vm.opts.onAddBtnClick = vm.opts.onAddBtnClick || null;
        vm.opts.actions = vm.opts.actions || {
          add: {
            'function': null,
            'if': function () {
              return false;
            }
          },
          delete: {
            'function': null,
            'if': function () {
              return false;
            }
          },
          assign: {
            'function': null,
            'if': function () {
              return false;
            }
          },
          edit: {
            'function': null,
            'if': function () {
              return false;
            }
          },
          confirm: {
            'function': null,
            'if': function () {
              return false;
            }
          }
        };
        vm.opts.pageAndSearchChangeMethod = vm.opts.pageAndSearchChangeMethod || function () {
          $log.info('tbl-table: no pageAndSearchChangeMethod given');
        };
        vm.opts.onCellEdit = vm.opts.onCellEdit || null;
        vm.opts.columns = vm.opts.columns || [
          {
            name: '',
            editable: true,
            unit: null,
            content: vm.POSSIBLE_CONTENT_TYPES[vm.CONTENT_TYPE_TEXT]
          },
          {
            name: '',
            editable: true,
            unit: null,
            content: vm.POSSIBLE_CONTENT_TYPES[vm.CONTENT_TYPE_TEXT]
          },
          {
            name: '',
            editable: true,
            unit: null,
            content: vm.POSSIBLE_CONTENT_TYPES[vm.CONTENT_TYPE_TEXT]
          },
          {
            name: '',
            editable: true,
            unit: null,
            content: vm.POSSIBLE_CONTENT_TYPES[vm.CONTENT_TYPE_TEXT]
          }
        ];
        vm.paginationStart = 1;
        vm.paginationEnd = 1;
        vm.opts.colors = vm.opts.colors || {};
        vm.opts.colors.primaryColor = vm.opts.colors.primaryColor || '#e8f7fe';
        vm.opts.colors.secondaryColor = vm.opts.colors.secondaryColor || '#004894';
        vm.opts.colors.primaryFontColor = vm.opts.colors.primaryFontColor || '#333333';
        vm.opts.colors.secondaryFontColor = vm.opts.colors.secondaryFontColor || '#ffffff';
        tplTableService.addTable(angular.copy(vm.opts));
        // RESTORE STATE BEFORE DETAIL
        var stateBeforeDetail = tplTableService.getStateBeforeDetail(vm.opts.id);
        if (stateBeforeDetail) {
          var actualSearch = stateBeforeDetail.actualSearch || '';
          if (actualSearch.length) {
            vm.opts.searchModel = actualSearch;
          }
          var actualPage = Number(stateBeforeDetail.actualPage);
          if (actualPage >= 0) {
            vm.opts.paginationModel = stateBeforeDetail.actualPage + 1;
          }
          initialLoad = false;
        }
        var actualEntriesPerPageCount = Number(stateBeforeDetail.actualEntriesPerPageCount);
        if (actualEntriesPerPageCount > 0) {
          vm.opts.entriesPerPageCount = actualEntriesPerPageCount;
        }
        setupListeners();
      }
      function setupListeners() {
        scopeListenerManager.saveAddListener($scope, $scope.$on('$destroy', function () {
          tplTableService.setStateBeforeDetail(vm.opts.id, {
            actualPage: vm.opts.paginationModel - 1,
            actualSearch: vm.opts.searchModel,
            actualEntriesPerPageCount: vm.opts.entriesPerPageCount
          });
        }));
        scopeListenerManager.saveAddListener($scope, $scope.$watch('vm.opts.entries', function (newVal, oldVal) {
          if ((oldVal === '' || !oldVal) && newVal !== oldVal) {
            angular.forEach(newVal, function (entry) {
              if (!entry.meta) {
                entry.meta = {};
              }
              entry.meta.disable = entry.meta.disable !== null && entry.meta.disable !== undefined ? entry.meta : false;
              entry.meta.onDisabledRowClick = entry.meta.onDisabledRowClick !== null && entry.meta.onDisabledRowClick !== undefined ? entry.onDisabledRowClick : null;
            });
          }
        }));
        scopeListenerManager.saveAddListener($scope, $scope.$watch('vm.opts.searchModel', function (newVal, oldVal) {
          if ((oldVal === '' || !oldVal) && newVal !== oldVal) {
            // Search started
            tplTableService.setStateBeforeSearch(vm.opts.id, {
              pageBeforeSearch: vm.opts.paginationModel - 1,
              entriesPerPageCountBeforeSearch: vm.opts.entriesPerPageCount
            });
            if (vm.opts.paginationModel === 1) {
              // from page 1
              vm.opts.pageAndSearchChangeMethod();
            } else {
              vm.opts.paginationModel = 1;
              refreshPagination();
            }
          } else if ((newVal === '' || !newVal) && !initialLoad) {
            // Search ended
            var state = tplTableService.getStateBeforeSearch(vm.opts.id);
            if (state) {
              if (state.pageBeforeSearch >= 0) {
                if (vm.opts.paginationModel === 1 && state.pageBeforeSearch + 1 === vm.opts.paginationModel) {
                  // from page 1
                  vm.opts.pageAndSearchChangeMethod();
                }
                vm.opts.paginationModel = state.pageBeforeSearch + 1;
                if (state.entriesPerPageCountBeforeSearch > 0) {
                  vm.opts.entriesPerPageCount = state.entriesPerPageCountBeforeSearch;
                }
                tplTableService.setStateBeforeSearch(vm.opts.id, {
                  pageBeforeSearch: null,
                  entriesPerPageCountBeforeSearch: null
                });
              }
            }
          } else if (newVal !== oldVal) {
            // New search after search started
            if (vm.opts.paginationModel === 1) {
              vm.opts.pageAndSearchChangeMethod();
            } else {
              vm.opts.paginationModel = 1;
              refreshPagination();
            }
          } else if (newVal === oldVal) {
          }
          // Init or returned to list
          initialLoad = false;
        }));
        scopeListenerManager.saveAddListener($scope, $scope.$watch('vm.opts.paginationModel', function (newVal, oldVal) {
          if (newVal === oldVal || newVal !== oldVal) {
            // Init, new page, search start or search end, returned to list
            if (vm.opts.searchModel !== '') {
              // Check for active search
              if (newVal === oldVal) {
                // Returned to list
                var state = tplTableService.getStateBeforeDetail(vm.opts.id);
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
                    tplTableService.setStateBeforeDetail(vm.opts.id, {
                      actualPage: null,
                      actualSearch: null,
                      actualEntriesPerPageCount: null
                    });
                  } else {
                    vm.opts.pageAndSearchChangeMethod();
                  }
                }
              } else {
                // or search started
                vm.opts.pageAndSearchChangeMethod();
              }
            } else if (!initialLoad) {
              // Returned to list without search
              vm.opts.pageAndSearchChangeMethod();
            }
            initialLoad = false;
          }
        }));
        scopeListenerManager.saveAddListener($scope, $scope.$watch('vm.opts.entriesPerPageCount', function (newVal, oldVal) {
          if ((newVal || newVal === 0) && newVal !== oldVal) {
            vm.opts.paginationModel = 1;
            resetEdit();
            vm.opts.pageAndSearchChangeMethod();
          }
        }));
        scopeListenerManager.saveAddListener($scope, $scope.$watch('vm.opts.pageCount', function (newVal) {
          if (newVal || newVal === 0) {
            refreshPagination();
            resetEdit();
          }
        }));
        scopeListenerManager.saveAddListener($scope, $scope.$watchCollection('vm.opts.columns', function (newVal) {
          if (newVal && newVal.length) {
            angular.forEach(newVal, function (column) {
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
      var refreshPagination = function refreshPagination() {
        var calculatedStart = vm.opts.paginationModel - (MAX_PAGINATION_BUTTONS - 1) / 2;
        if (calculatedStart > 0) {
          vm.paginationStart = calculatedStart;
        } else {
          vm.paginationStart = 1;
        }
        var calculatedEnd = vm.opts.paginationModel + (MAX_PAGINATION_BUTTONS - 1) / 2;
        if (calculatedEnd <= vm.opts.pageCount && calculatedEnd - vm.paginationStart === 5) {
          vm.paginationEnd = calculatedEnd;
        } else if (vm.paginationStart + (MAX_PAGINATION_BUTTONS - 1) <= vm.opts.pageCount) {
          vm.paginationEnd = vm.paginationStart + (MAX_PAGINATION_BUTTONS - 1);
        } else {
          vm.paginationEnd = vm.opts.pageCount;
        }
      };
      $scope.skipPagesForward = function skipPagesForward() {
        var calculatedPage = vm.opts.paginationModel + MAX_PAGINATION_BUTTONS;
        if (calculatedPage <= vm.dataPageCount) {
          vm.opts.paginationModel += MAX_PAGINATION_BUTTONS;
        } else {
          vm.opts.paginationModel = vm.opts.pageCount;
        }
        refreshPagination();
        resetEdit();
      };
      $scope.skipPagesBackward = function skipPagesBackward() {
        var calculatedPage = vm.opts.paginationModel - MAX_PAGINATION_BUTTONS;
        if (calculatedPage > 0) {
          vm.opts.paginationModel = calculatedPage;
        } else {
          vm.opts.paginationModel = 1;
        }
        refreshPagination();
        resetEdit();
      };
      $scope.setPage = function setPage(page) {
        vm.opts.paginationModel = page;
        refreshPagination();
        resetEdit();
      };
      $scope.setSearch = function setSearch() {
        vm.opts.searchModel = vm.searchInput;
        resetEdit();
      };
      var resetEdit = function resetEdit(event) {
        $timeout(function () {
          vm.editableCell[0] = null;
          vm.editableCell[1] = null;
          if (event) {
            event.stopPropagation();
          }
          $document.find('body').unbind('click', resetEdit);
        }, 0);
      };
      $scope.toggleEditCell = function toggleEditCell(event, rowIndex, columnIndex) {
        event.stopPropagation();
        var entry = vm.opts.entries[rowIndex];
        if (!entry.meta || !entry.meta.disable) {
          vm.editableCell[0] = rowIndex;
          vm.editableCell[1] = columnIndex;
          vm.tempEditColumnCopy = angular.copy(entry);
          angular.forEach(vm.tempEditColumnCopy, function (value, key) {
            if (value === '-' || value === '--' || value === '---') {
              vm.tempEditColumnCopy[key] = null;
            }
          });
          $document.find('body').bind('click', resetEdit);
        }
      };
      $scope.saveEditedColumn = function saveEditedColumn() {
        vm.opts.entries[vm.editableCell[0]] = vm.tempEditColumnCopy;
        // given values are the rowId and the data holded by the row
        vm.opts.onCellEdit(vm.editableCell[0], vm.opts.entries[vm.editableCell[0]]);
        $rootScope.$emit('tpltable.datarow.edited.' + vm.opts.id, vm.editableCell[0], vm.opts.entries[vm.editableCell[0]]);
        vm.editableCell[0] = null;
        vm.editableCell[1] = null;
      };
      $scope.onDisabledRowClick = function onDisabledRowClick(event, entry) {
        event.stopPropagation();
        event.preventDefault();
        if (entry && entry.meta && entry.meta.onDisabledRowClick) {
          entry.meta.onDisabledRowClick();
        }
      };
      function getCellValue(row, cell) {
        var levels = cell.split('.');
        var levelsMap = {
            2: function () {
              return row[levels[0]] ? row[levels[0]][levels[1]] : '-';
            },
            3: function () {
              return row[levels[0]] ? row[levels[0]][levels[1]] ? row[levels[0]][levels[1]][levels[2]] : '-' : '-';
            },
            4: function () {
              return row[levels[0]] ? row[levels[0]][levels[1]] ? row[levels[0]][levels[1]][levels[2]] ? row[levels[0]][levels[1]][levels[2]][levels[3]] : '-' : '-' : '-';
            }
          };
        return levelsMap[levels.length] ? levelsMap[levels.length]() : '';
      }
    }
  ]);
}());
(function () {
  'use strict';
  angular.module('tpl.table').service('tplTableService', TplTableService);
  function TplTableService() {
    var tables = {};
    var exports = {
        addTable: addTable,
        setStateBeforeDetail: setStateBeforeDetail,
        getStateBeforeDetail: getStateBeforeDetail,
        setStateBeforeSearch: setStateBeforeSearch,
        getStateBeforeSearch: getStateBeforeSearch
      };
    return exports;
    function addTable(table) {
      // if (tables[table.id]) {
      //   return tables[table.id];
      // }
      tables[table.id] = table;
      tables[table.id].pageObj = {
        actualPage: null,
        pageBeforeSearch: null
      };
      return table;
    }
    function setStateBeforeDetail(id, state) {
      tables[id].pageObj.actualPage = state.actualPage;
      tables[id].pageObj.actualSearch = state.actualSearch;
    }
    function getStateBeforeDetail(id) {
      return {
        actualPage: tables[id].pageObj.actualPage,
        actualSearch: tables[id].pageObj.actualSearch
      };
    }
    function setStateBeforeSearch(id, stateBeforeSearch) {
      tables[id].pageObj.pageBeforeSearch = stateBeforeSearch;
    }
    function getStateBeforeSearch(id) {
      return { pageBeforeSearch: tables[id].pageObj.pageBeforeSearch };
    }
  }
}());
(function () {
  'use strict';
  angular.module('tpl.table').filter('toRange', function () {
    return function (input) {
      var lowBound, highBound;
      if (input.length === 1) {
        lowBound = 0;
        highBound = +input[0] - 1;
      } else if (input.length === 2) {
        lowBound = +input[0];
        highBound = +input[1];
      }
      var i = lowBound;
      var result = [];
      while (i <= highBound) {
        result.push(i);
        i++;
      }
      return result;
    };
  });
}());
angular.module('tpl.table').directive('loadingpoints', function () {
  'use strict';
  return {
    restrict: 'E',
    templateUrl: 'src/loading-points.directive.html'
  };
});
angular.module('tpl.table').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('src/loading-points.directive.html', '<!-- <svg width="70" height="20">\n' + '  <rect width="6" height="6" x="0" y="0" rx="1" ry="1">\n' + '    <animate attributeName="width" values="0;6;6;6;0" dur="1000ms" repeatCount="indefinite"/>\n' + '    <animate attributeName="height" values="0;6;6;6;0" dur="1000ms" repeatCount="indefinite"/>\n' + '    <animate attributeName="x" values="3;0;0;0;3" dur="1000ms" repeatCount="indefinite"/>\n' + '    <animate attributeName="y" values="3;0;0;0;3" dur="1000ms" repeatCount="indefinite"/>\n' + '  </rect>\n' + '  <rect width="6" height="6" x="10" y="0" rx="1" ry="1">\n' + '    <animate attributeName="width" values="0;6;6;6;0" begin="200ms" dur="1000ms" repeatCount="indefinite"/>\n' + '    <animate attributeName="height" values="0;6;6;6;0" begin="200ms" dur="1000ms" repeatCount="indefinite"/>\n' + '    <animate attributeName="x" values="10;8;8;8;10" begin="200ms" dur="1000ms" repeatCount="indefinite"/>\n' + '    <animate attributeName="y" values="3;0;0;0;3" begin="200ms" dur="1000ms" repeatCount="indefinite"/>\n' + '  </rect>\n' + '  <rect width="6" height="6" x="20" y="0" rx="1" ry="1">\n' + '    <animate attributeName="width" values="0;6;6;6;0" begin="400ms" dur="1000ms" repeatCount="indefinite"/>\n' + '    <animate attributeName="height" values="0;6;6;6;0" begin="400ms" dur="1000ms" repeatCount="indefinite"/>\n' + '    <animate attributeName="x" values="18;16;16;16;18" begin="400ms" dur="1000ms" repeatCount="indefinite"/>\n' + '    <animate attributeName="y" values="3;0;0;0;3" begin="400ms" dur="1000ms" repeatCount="indefinite"/>\n' + '  </rect>\n' + '</svg> -->\n' + '<div id="rect3"></div>\n' + '<div id="rect2"></div>\n' + '<div id="rect1"></div>\n');
    $templateCache.put('src/tpltable.directive.html', '\n' + '<div class="top-row" ng-if="(vm.opts.entriesPerPageCount && vm.opts.showPagination) || vm.opts.searchModel">\n' + '\n' + '  <div class="elementsperside__select prettyselect" ng-if="vm.opts.entriesPerPageCount && vm.opts.showPagination">\n' + '    <select class="top-row__entry-count input-sm" ng-model="vm.opts.entriesPerPageCount" ng-options="o as o for o in vm.POSSIBLE_RANGE_VALUES" ng-style="{\'color\': vm.opts.colors.secondaryColor}"></select>\n' + '  </div>\n' + '  <span class="elementsperside__label" ng-if="vm.opts.entriesPerPageCount && vm.opts.showPagination">\n' + '    {{ \'TABLE_ENTRIES_PER_SITE\' | translate }} {{dataOrder}}\n' + '  </span>\n' + '\n' + '  <form ng-if="vm.opts.searchModel!==null" ng-submit="setSearch()">\n' + '    <input class="top-row__search" type="text" ng-model="vm.searchInput" placeholder="{{\'TABLE_SEARCH\'|translate}}" />\n' + '  </form>\n' + '\n' + '</div>\n' + '\n' + '<table class="tpltable">\n' + '\n' + '  <thead class="tpltable__head">\n' + '    <tr>\n' + '      <th ng-repeat="column in vm.opts.columns" ng-if="!column.ngIf || column.ngIf()">\n' + '        <span ng-if="!column.translateColumn">{{column.name}}</span>\n' + '        <span ng-if="column.translateColumn">{{column.name | translate}}</span>\n' + '      </th>\n' + '      <th ng-if="vm.opts.showActionsColumn" class="edit">Aktionen</th>\n' + '    </tr>\n' + '  </thead>\n' + '\n' + '  <tbody class="tpltable__body">\n' + '\n' + '    <tr class="tpltable__row--placeholder" ng-if="!vm.opts.entries || !vm.opts.entries.length || vm.opts.loading">\n' + '      <td colspan="{{vm.opts.entrieValuesOrder.length + (vm.opts.actions ? 1 : 0)}}">\n' + '        <span ng-if="!vm.opts.loading">{{vm.opts.noDataAvailableText | translate}}</span>\n' + '        <loadingpoints ng-if="vm.opts.loading"></loadingpoints>\n' + '      </td>\n' + '    </tr>\n' + '\n' + '    <tr ng-if="vm.opts.entries && vm.opts.entries.length" ng-repeat="row in vm.opts.entries" ng-class="{\'disabled\': row.meta && row.meta.disable }">\n' + '\n' + '      <td ng-repeat="cell in vm.opts.entrieValuesOrder" ng-mouseleave="hover=false" ng-mouseenter="hover=true" ng-style="vm.editableCell[1]===$parent.$index && vm.editableCell[0]===$parent.$parent.$index && {\'background-color\': vm.opts.colors.primaryColor, \'color\': vm.opts.colors.primaryFontColor}" ng-class="{\'clickable\': vm.opts.onRowClick, \'notclickable\': !vm.opts.onRowClick || vm.editableCell[0]!==null || row.meta.disable}" ng-click="(row.meta.disable && onDisabledRowClick($event, row)) || row.meta.disable || !vm.opts.onRowClick || vm.editableCell[0]!==null || vm.opts.onRowClick($parent.$parent.$index)" ng-if="!vm.opts.columns[$index].ngIf || vm.opts.columns[$index].ngIf()">\n' + '\n' + '        <div ng-if="(vm.editableCell[0]!==$parent.$parent.$parent.$index || vm.editableCell[1]!==$index || !vm.opts.columns[$index].editable)">\n' + '          <!-- TEXT -->\n' + '          <div class="cell__text" ng-if="vm.opts.columns[$index].content === vm.POSSIBLE_CONTENT_TYPES[0]">\n' + '            <span ng-if="!vm.opts.columns[$index].translateValues">\n' + '              {{(cell.indexOf(\'.\') !== -1 ? vm.getCellValue(row, cell) : row[cell]) | checkmark}} {{columnValues[$index]}}\n' + '            </span>\n' + '            <span ng-if="vm.opts.columns[$index].translateValues">\n' + '              {{((vm.opts.columns[$index].translateValuePrefix ? vm.opts.columns[$index].translateValuePrefix : \'\') + (cell.indexOf(\'.\') !== -1 ? vm.getCellValue(row, cell) : row[cell])) | translate}} {{columnValues[$index]}}\n' + '            </span>\n' + '          </div>\n' + '          <!-- IMAGE -->\n' + '          <div class="cell__image" ng-if="vm.opts.columns[$index].content === vm.POSSIBLE_CONTENT_TYPES[1]">\n' + '            <img  ng-src="{{row[cell]}}" ng-style="{\'max-width\': vm.opts.columns[$index].maxWidth ? vm.opts.columns[$index].maxWidth : \'250px\', \'max-height\': vm.opts.columns[$index].maxHeight ? vm.opts.columns[$index].maxHeight : \'250px\'}" />\n' + '          </div>\n' + '          <!-- OTHER ??? -->\n' + '        </div>\n' + '\n' + '        <span ng-if="vm.editableCell[0]===$parent.$parent.$parent.$index && vm.editableCell[1]===$index && vm.opts.columns[$index].editable">\n' + '          <input type="text" class="edit-input" ng-model="vm.tempEditColumnCopy[cell]" focus-me="vm.editableCell[0]===$parent.$parent.$parent.$index && vm.editableCell[1]===$index" ng-click="$event.stopPropagation()" ng-keyup="$event.keyCode == 13 && saveEditedColumn()"/> {{columnValues[$index]}}{{columnValues[$index]}}\n' + '        </span>\n' + '\n' + '        <div class="cell-controll unit" ng-if="vm.opts.columns[$index].unit && !hover">\n' + '          <span>\n' + '            {{ vm.opts.columns[$index].unit }}\n' + '          </span>\n' + '        </div>\n' + '        <div class="cell-controll edit" ng-if="vm.opts.columns[$index].editable && hover" ng-click="toggleEditCell($event, $parent.$parent.$parent.$parent.$index, $index)" ng-style="hoverEdit && {\'background-color\': vm.opts.colors.primaryColor, \'color\': vm.opts.colors.primaryFontColor}" ng-mouseenter="hoverEdit=true" ng-mouseleave="hoverEdit=false">\n' + '          <div ng-if="hover" class="iconfont tbl-iconfont-pen"></div>\n' + '        </div>\n' + '        <div class="cell-controll save" ng-if="vm.opts.columns[$index].editable && vm.editableCell[0]===$parent.$parent.$parent.$index && vm.editableCell[1]===$index" ng-style="{\'background-color\': vm.opts.colors.secondaryColor, \'color\': vm.opts.colors.secondaryFontColor}" ng-click="$parent.hover=false;saveEditedColumn()">\n' + '          <div  class="iconfont iconfont-check"></div>\n' + '        </div>\n' + '      </td>\n' + '\n' + '      <td ng-if="vm.opts.showActionsColumn" class="edit">\n' + '        <span ng-if="vm.opts.actions.assign.function && vm.opts.actions.assign.if($index)" class="tbl-iconfont tbl-iconfont-export" ng-click="(row.meta.disable && onDisabledRowClick($event, row)) || row.meta.disable || !vm.opts.actions.assign.function || vm.editableCell[0]!==null || vm.opts.actions.assign.function($index)"></span>\n' + '        <span ng-if="vm.opts.actions.edit.function && vm.opts.actions.edit.if($index)" class="tbl-iconfont tbl-iconfont-pen" ng-click="(row.meta.disable && onDisabledRowClick($event, row)) || row.meta.disable || !vm.opts.actions.edit.function || vm.editableCell[0]!==null || vm.opts.actions.edit.function($index)"></span>\n' + '        <span ng-if="vm.opts.actions.add.function && vm.opts.actions.add.if($index)" class="icon icon-cal-button" ng-click="(row.meta.disable && onDisabledRowClick($event, row)) || row.meta.disable || !vm.opts.actions.add.function || vm.editableCell[0] !== null || vm.opts.actions.add.function($index)"></span>\n' + '        <span ng-if="vm.opts.actions.confirm.function && vm.opts.actions.confirm.if($index)" class="iconfont iconfont-check" ng-click="(row.meta.disable && onDisabledRowClick($event, row)) || row.meta.disable || !vm.opts.actions.confirm.function ||  vm.editableCell[0]!=null || vm.opts.actions.confirm.function($index)"></span>\n' + '        <span ng-if="vm.opts.actions.delete.function && vm.opts.actions.delete.if($index)" class="tbl-iconfont tbl-iconfont-delete" ng-click="(row.meta.disable && onDisabledRowClick($event, row)) || row.meta.disable || !vm.opts.actions.delete.function || vm.editableCell[0]!==null || vm.opts.actions.delete.function($index)"></span>\n' + '      </td>\n' + '\n' + '    </tr>\n' + '  </tbody>\n' + '\n' + '</table>\n' + '\n' + '<div class="bottom-row" ng-if="vm.opts.paginationModel && vm.opts.showPagination">\n' + '  <div class="paginator">\n' + '\n' + '    <div class="paginator__first" ng-class="{\'inactive\': vm.opts.paginationModel === 1}"\n' + '    ng-style="vm.opts.paginationModel !== 1 && !pageFirstHover && {\'color\': vm.opts.colors.secondaryColor} ||\n' + '    vm.opts.paginationModel !== 1 && pageFirstHover && {\'color\': vm.opts.colors.secondaryColor, \'background-color\': vm.opts.colors.primaryColor}"\n' + '    ng-disabled="vm.opts.paginationModel === 1" ng-click="setPage(1)" ng-mouseenter="pageFirstHover=true" ng-mouseleave="pageFirstHover=false"> {{\'TABLE_PAGING_START\'|translate}}</div>\n' + '\n' + '    <div class="paginator__mid" ng-if="vm.paginationStart > 1" ng-click="skipPagesBackward()"\n' + '      ng-style="pageMid1Hover && {\'color\': vm.opts.colors.secondaryColor, \'background-color\': vm.opts.colors.primaryColor} ||\n' + '      {\'color\': vm.opts.colors.secondaryColor}"\n' + '      ng-mouseenter="pageMid1Hover=true" ng-mouseleave="pageMid1Hover=false"> ... </div>\n' + '\n' + '      <div class="paginator__mid" ng-class="{\'active\': i === vm.opts.paginationModel}" ng-repeat="i in [vm.paginationStart, vm.paginationEnd] | toRange" ng-click="setPage(i)"\n' + '      ng-style="i !== vm.opts.paginationModel && !pageMidHover && {\'color\': vm.opts.colors.secondaryColor} ||\n' + '      i !== vm.opts.paginationModel && pageMidHover && {\'background-color\': vm.opts.colors.primaryColor, \'color\': vm.opts.colors.secondaryColor} ||\n' + '      {\'color\': vm.opts.colors.secondaryFontColor, \'background-color\': vm.opts.colors.secondaryColor}"\n' + '      ng-mouseenter="pageMidHover=true" ng-mouseleave="pageMidHover=false"> {{i}} </div>\n' + '\n' + '      <div class="paginator__mid" ng-if="vm.paginationEnd < vm.opts.pageCount" ng-click="skipPagesForward()"\n' + '      ng-style="pageMid2Hover && {\'color\': vm.opts.colors.secondaryColor, \'background-color\': vm.opts.colors.primaryColor} ||\n' + '      {\'color\': vm.opts.colors.secondaryColor}"\n' + '      ng-mouseenter="pageMid2Hover=true" ng-mouseleave="pageMid2Hover=false"> ... </div>\n' + '\n' + '      <div class="paginator__last" ng-class="{\'inactive\': vm.opts.paginationModel === vm.opts.pageCount}"\n' + '      ng-style="vm.opts.paginationModel !== vm.opts.pageCount && !pageLastHover && {\'color\': vm.opts.colors.secondaryColor} ||\n' + '      vm.opts.paginationModel !== vm.opts.pageCount && pageLastHover && {\'color\': vm.opts.colors.secondaryColor, \'background-color\': vm.opts.colors.primaryColor}"\n' + '      ng-disabled="vm.opts.paginationModel === vm.opts.pageCount" ng-click="setPage(vm.opts.pageCount)" ng-mouseenter="pageLastHover=true" ng-mouseleave="pageLastHover=false"> {{\'TABLE_PAGING_END\'|translate}}</div>\n' + '\n' + '    </div>\n' + '  </div>\n');
  }
]);