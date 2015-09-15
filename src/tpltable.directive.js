(function() {
  'use strict';

  angular.module('tpl.table')
    .directive('tplTable', function tpltable() {
      return {
        restrict: 'E',
        controller: 'TplTableCtrl',
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: 'src/tpltable.directive.html',
        scope: {
          opts: '=tplTableOptions'
        }
      };
    })

    .directive('focusMe', ['$timeout', function($timeout) {
      return {
        link: function(scope, element, attrs) {
          scope.$watch(attrs.focusMe, function(value) {
            if(value === true) {
              $timeout(function() {
                element[0].focus();
                scope[attrs.focusMe] = false;
              });
            }
          });
        }
      };
    }])

    .controller('TplTableCtrl', ['$scope', '$rootScope', '$document', '$timeout', 'tplTableService',
      function TplTableCtrl($scope, $rootScope, $document, $timeout, tplTableService) {

        var vm = this;

        var initialLoad = true;

        var MAX_PAGINATION_BUTTONS = 5;

        vm.POSSIBLE_RANGE_VALUES = [10, 25, 50, 100];

        vm.POSSIBLE_CONTENT_TYPES = ['TEXT', 'IMAGE'];
        vm.CONTENT_TYPE_TEXT = 0;
        vm.CONTENT_TYPE_IMAGE = 1;

        vm.editableCell = [null, null];

        vm.getCellValue = getCellValue;

        vm.opts.id = vm.opts.id || 'tpltable';
        vm.opts.loading = vm.opts.loading || false;
        vm.opts.noDataAvailableText = vm.opts.noDataAvailableText || 'No Data Available ...';
        vm.opts.actions = vm.opts.actions || false;
        vm.opts.searchModel = vm.opts.searchModel !== undefined ? vm.opts.searchModel : null;
        vm.opts.showPagination = vm.opts.showPagination !== null || vm.opts.showPagination !== undefined ? vm.opts.showPagination : true;
        vm.opts.paginationModel = vm.opts.paginationModel || null;
        vm.opts.pageCount = vm.opts.pageCount || null;
        vm.opts.entriesPerPageCount = vm.opts.entriesPerPageCount || null;
        vm.opts.entries = vm.opts.entries || [];
        vm.opts.entrieValuesOrder = vm.opts.entrieValuesOrder || null;
        vm.opts.onRowClick = vm.opts.onRowClick || null;
        vm.opts.onAssignBtnClick = vm.opts.onAssignBtnClick || null;
        vm.opts.onEditBtnClick = vm.opts.onEditBtnClick || null;
        vm.opts.onDeleteBtnClick = vm.opts.onDeleteBtnClick || null;
        vm.opts.onAddBtnClick = vm.opts.onAddBtnClick || null;
        vm.opts.columns = vm.opts.columns || [
                                              {
                                                name : '',
                                                editable : true,
                                                content: vm.POSSIBLE_CONTENT_TYPES[vm.CONTENT_TYPE_TEXT]
                                              },
                                              {
                                                name : '',
                                                editable : true,
                                                content: vm.POSSIBLE_CONTENT_TYPES[vm.CONTENT_TYPE_TEXT]
                                              },
                                              {
                                                name : '',
                                                editable : true,
                                                content: vm.POSSIBLE_CONTENT_TYPES[vm.CONTENT_TYPE_TEXT]
                                              },
                                              {
                                                name : '',
                                                editable : true,
                                                content: vm.POSSIBLE_CONTENT_TYPES[vm.CONTENT_TYPE_TEXT]
                                              }
                                             ];

        vm.paginationStart = 1;
        vm.paginationEnd = 1;
        vm.opts.colors = vm.opts.colors || {};
        vm.opts.colors.primaryColor = vm.opts.colors.primaryColor || 'e8f7fe';
        vm.opts.colors.secondaryColor = vm.opts.colors.secondaryColor || '004894';
        vm.opts.colors.primaryFontColor = vm.opts.colors.primaryFontColor || '333333';
        vm.opts.colors.secondaryFontColor = vm.opts.colors.secondaryFontColor || 'ffffff';

        vm.opts = tplTableService.addTable(vm.opts);

        $scope.$on('$destroy', function() {
          tplTableService.setStateBeforeDetail(vm.opts.id, {
            actualPage: vm.opts.paginationModel - 1,
            actualSearch: vm.opts.searchModel
          });
        });

        $scope.$watch('vm.opts.searchModel', function(newVal, oldVal) {
          // if (newVal || newVal === '' || newVal === 0) {
          //   vm.opts.paginationModel = 1;
          //   refreshPagination();
          // }
          if ((oldVal === '' || !oldVal) && newVal !== oldVal) { // Search started
            tplTableService.setStateBeforeSearch(vm.opts.id, vm.opts.paginationModel - 1);

            if (vm.opts.paginationModel === 1) { // from page 1
              vm.opts.pageAndSearchChangeMethod();
            } else {
              vm.opts.paginationModel = 1;
              refreshPagination();
            }
          } else if ((newVal === '' || !newVal) && !initialLoad) { // Search ended
            var state = tplTableService.getStateBeforeSearch(vm.opts.id);
            if (state.pageBeforeSearch >= 0) {
              if (vm.opts.paginationModel === 1 && (state.pageBeforeSearch + 1) === vm.opts.paginationModel) { // from page 1
                vm.opts.pageAndSearchChangeMethod();
              }
              vm.opts.paginationModel = state.pageBeforeSearch + 1;
              tplTableService.setStateBeforeSearch(vm.opts.id, null);
            }
          } else if (newVal !== oldVal) { // New search after search started
            if (vm.opts.paginationModel === 1) {
              vm.opts.pageAndSearchChangeMethod();
            } else {
              vm.opts.paginationModel = 1;
              refreshPagination();
            }
          } else if (newVal === oldVal) { // Init or returned to list
          }
          initialLoad = false;
        });

        $scope.$watch('vm.opts.paginationModel', function(newVal, oldVal) {
          if (newVal === oldVal || newVal !== oldVal) { // Init, new page, search start or search end, returned to list

            if (vm.opts.searchModel !== '') { // Check for active search
              if (newVal === oldVal) { // Returned to list
                  var state = tplTableService.getStateBeforeDetail(vm.opts.id);
                  if (state.actualPage >= 0) {
                    vm.opts.paginationModel = state.actualPage + 1;

                    if (state.actualSearch) {
                      vm.opts.searchModel = state.actualSearch;
                      vm.searchInput = vm.opts.searchModel;
                    }

                    tplTableService.setStateBeforeDetail(vm.opts.id, {
                      actualPage: null,
                      actualSearch: null
                    });
                  } else { // or search started from page 1
                    vm.opts.pageAndSearchChangeMethod();
                  }
              } else { // or search started
                vm.opts.pageAndSearchChangeMethod();
              }
            } else if (!initialLoad) { // Returned to list without search
              vm.opts.pageAndSearchChangeMethod();
            }
            initialLoad = false;
          }
        });

        $scope.$watch('vm.opts.entriesPerPageCount', function(newVal, oldVal) {
          if ((newVal || newVal === 0) && newVal !== oldVal) {
            vm.opts.paginationModel = 1;
            resetEdit();

            vm.opts.pageAndSearchChangeMethod();
          }
        });

        $scope.$watch('vm.opts.pageCount', function(newVal) {
          if (newVal || newVal === 0) {
            refreshPagination();
            resetEdit();
          }
        });

        $scope.$watchCollection('vm.opts.columns', function(newVal) {
          if (newVal && newVal.length) {

            angular.forEach(newVal, function(column) {
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
        });

        var refreshPagination = function refreshPagination() {
          var calculatedStart = vm.opts.paginationModel - ((MAX_PAGINATION_BUTTONS - 1) / 2);
          if (calculatedStart > 0) {
            vm.paginationStart = calculatedStart;
          } else {
            vm.paginationStart = 1;
          }

          var calculatedEnd = vm.opts.paginationModel + ((MAX_PAGINATION_BUTTONS - 1) / 2);
          if (calculatedEnd <= vm.opts.pageCount && (calculatedEnd - vm.paginationStart) === 5) {
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
          var calculatedPage = vm.opts.paginationModel- MAX_PAGINATION_BUTTONS;
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
          $timeout(function() {
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
          vm.editableCell[0] = rowIndex;
          vm.editableCell[1] = columnIndex;
          vm.tempEditColumnCopy = angular.copy(vm.opts.entries[rowIndex]);
          angular.forEach(vm.tempEditColumnCopy, function(value, key) {
            if (value === '-' || value === '--' || value === '---') {
              vm.tempEditColumnCopy[key] = null;
            }
          });

          $document.find('body').bind('click', resetEdit);
        };

        $scope.saveEditedColumn = function saveEditedColumn() {
          vm.opts.entries[vm.editableCell[0]] = vm.tempEditColumnCopy;

          $rootScope.$emit('tpltable.datarow.edited.' + vm.opts.id,
            vm.editableCell[0],
            vm.opts.entries[vm.editableCell[0]]);

          vm.editableCell[0] = null;
          vm.editableCell[1] = null;
        };

        function getCellValue(row, cell) {
          var levels = cell.split('.');
          var levelsMap = {
            2: function() {
              return row[levels[0]][levels[1]];
            },
            3: function() {
              return row[levels[0]][levels[1]][levels[2]];
            },
            4: function() {
              return row[levels[0]][levels[1]][levels[2]][levels[3]];
            }
          };

          return levelsMap[levels.length] ? levelsMap[levels.length]() : '';
        }
      }]);
}());
