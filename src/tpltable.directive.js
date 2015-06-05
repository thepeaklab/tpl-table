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

    .controller('TplTableCtrl', ['$scope', '$rootScope', '$document', '$timeout',
      function TplTableCtrl($scope, $rootScope, $document, $timeout) {

        var vm = this;

        var MAX_PAGINATION_BUTTONS = 5;

        vm.POSSIBLE_RANGE_VALUES = [10, 25, 50, 100];

        vm.editableCell = [null, null];

        vm.opts.id = vm.opts.id || 'tpltable';
        vm.opts.loading = vm.opts.loading || false;
        vm.opts.noDataAvailableText = vm.opts.noDataAvailableText || 'No Data Available ...';
        vm.opts.editable = vm.opts.editable || false;
        vm.opts.searchModel = vm.opts.searchModel !== undefined ? vm.opts.searchModel : null;
        vm.opts.paginationModel = vm.opts.paginationModel || null;
        vm.opts.pageCount = vm.opts.pageCount || null;
        vm.opts.entriesPerPageCount = vm.opts.entriesPerPageCount || null;
        vm.opts.entries = vm.opts.entries || [];
        vm.opts.entrieValuesOrder = vm.opts.entrieValuesOrder || null;
        vm.opts.onRowClick = vm.opts.onRowClick || null;
        vm.opts.columns = vm.opts.columns || [
                                              {
                                                name : '',
                                                editable : true
                                              },
                                              {
                                                name : '',
                                                editable : true
                                              },
                                              {
                                                name : '',
                                                editable : true
                                              },
                                              {
                                                name : '',
                                                editable : true
                                              }
                                             ];

        vm.paginationStart = 1;
        vm.paginationEnd = 1;
        vm.opts.colors = vm.opts.colors || {};
        vm.opts.colors.primaryColor = vm.opts.colors.primaryColor || 'e8f7fe';
        vm.opts.colors.secondaryColor = vm.opts.colors.secondaryColor || '004894';
        vm.opts.colors.primaryFontColor = vm.opts.colors.primaryFontColor || '333333';
        vm.opts.colors.secondaryFontColor = vm.opts.colors.secondaryFontColor || 'ffffff';

        $scope.$watch('vm.opts.searchModel', function() {
          vm.opts.paginationModel = 1;
          refreshPagination();
        });

        $scope.$watch('vm.opts.entriesPerPageCount', function() {
          vm.opts.paginationModel = 1;
          resetEdit();
        });

        $scope.$watch('vm.opts.pageCount', function() {
          refreshPagination();
          resetEdit();
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
      }]);
}());
