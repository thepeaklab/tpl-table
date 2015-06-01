(function () {
  'use strict';
  angular.module('tpl.table', []);
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
    function ($timeout) {
      return {
        link: function (scope, element, attrs) {
          scope.$watch(attrs.focusMe, function (value) {
            if (value === true) {
              $timeout(function () {
                element[0].focus();
                scope[attrs.focusMe] = false;
              });
            }
          });
        }
      };
    }
  ]).controller('TplTableCtrl', [
    '$scope',
    '$rootScope',
    '$document',
    '$timeout',
    function TplTableCtrl($scope, $rootScope, $document, $timeout) {
      var vm = this;
      var MAX_PAGINATION_BUTTONS = 5;
      vm.POSSIBLE_RANGE_VALUES = [
        10,
        25,
        50,
        100
      ];
      vm.editableCell = [
        null,
        null
      ];
      vm.opts.id = vm.opts.id || 'tpltable';
      vm.opts.loading = vm.opts.loading || false;
      vm.opts.noDataAvailableText = vm.opts.noDataAvailableText || 'No Data Available ...';
      vm.opts.editable = vm.opts.editable || false;
      vm.opts.searchModel = vm.opts.searchModel !== undefined ? vm.opts.searchModel : null;
      vm.opts.paginationModel = vm.opts.paginationModel || 1;
      vm.opts.pageCount = vm.opts.pageCount || null;
      vm.opts.entriesPerPageCount = vm.opts.entriesPerPageCount || 10;
      vm.opts.entries = vm.opts.entries || [];
      vm.opts.entrieValuesOrder = vm.opts.entrieValuesOrder || null;
      vm.opts.onRowClick = vm.opts.onRowClick || null;
      vm.opts.columns = vm.opts.columns || [
        {
          name: '',
          editable: true
        },
        {
          name: '',
          editable: true
        },
        {
          name: '',
          editable: true
        },
        {
          name: '',
          editable: true
        }
      ];
      vm.paginationStart = 1;
      vm.paginationEnd = 1;
      vm.opts.colors = vm.opts.colors || {};
      vm.opts.colors.primaryColor = vm.opts.colors.primaryColor || 'e8f7fe';
      vm.opts.colors.secondaryColor = vm.opts.colors.secondaryColor || '004894';
      vm.opts.colors.primaryFontColor = vm.opts.colors.primaryFontColor || '333333';
      vm.opts.colors.secondaryFontColor = vm.opts.colors.secondaryFontColor || 'ffffff';
      $scope.$watch('vm.opts.searchModel', function () {
        vm.opts.paginationModel = 1;
        refreshPagination();
      });
      $scope.$watch('vm.opts.entriesPerPageCount', function () {
        vm.opts.paginationModel = 1;
        resetEdit();
      });
      $scope.$watch('vm.opts.pageCount', function () {
        refreshPagination();
        resetEdit();
      });
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
        vm.editableCell[0] = rowIndex;
        vm.editableCell[1] = columnIndex;
        vm.tempEditColumnCopy = angular.copy(vm.opts.entries[rowIndex]);
        angular.forEach(vm.tempEditColumnCopy, function (value, key) {
          if (value === '-' || value === '--' || value === '---') {
            vm.tempEditColumnCopy[key] = null;
          }
        });
        $document.find('body').bind('click', resetEdit);
      };
      $scope.saveEditedColumn = function saveEditedColumn() {
        vm.opts.entries[vm.editableCell[0]] = vm.tempEditColumnCopy;
        $rootScope.$emit('tpltable.datarow.edited.' + vm.opts.id, vm.editableCell[0], vm.opts.entries[vm.editableCell[0]]);
        vm.editableCell[0] = null;
        vm.editableCell[1] = null;
      };
    }
  ]);
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
    $templateCache.put('src/tpltable.directive.html', '\n' + '<div class="top-row">\n' + '\n' + '  <div class="elementsperside__select prettyselect">\n' + '    <select class="top-row__entry-count input-sm" ng-model="vm.opts.entriesPerPageCount" ng-options="o as o for o in vm.POSSIBLE_RANGE_VALUES" ng-style="{\'color\': vm.opts.colors.secondaryColor}" />\n' + '  </div>\n' + '  <span class="elementsperside__label">\n' + '    {{ \'TABLE_ENTRIES_PER_SITE\' | translate }} {{dataOrder}}\n' + '  </span>\n' + '\n' + '  <form ng-if="vm.opts.searchModel!==null" ng-submit="setSearch()">\n' + '    <input class="top-row__search" type="text" ng-model="vm.searchInput" placeholder="{{\'TABLE_SEARCH\'|translate}}" />\n' + '  </form>\n' + '\n' + '</div>\n' + '\n' + '<table class="tpltable">\n' + '\n' + '  <thead class="tpltable__head">\n' + '    <tr>\n' + '      <th ng-repeat="column in vm.opts.columns">{{column.name}}</th>\n' + '      <th ng-if="vm.opts.editable" class="edit">edit.</th>\n' + '    </tr>\n' + '  </thead>\n' + '\n' + '  <tbody class="tpltable__body">\n' + '\n' + '    <tr class="tpltable__row--placeholder" ng-if="!vm.opts.entries || !vm.opts.entries.length">\n' + '      <td colspan="{{vm.opts.entrieValuesOrder.length + (vm.opts.editable ? 1 : 0)}}">\n' + '        <span ng-if="!vm.opts.loading">{{vm.opts.noDataAvailableText}}</span>\n' + '        <loadingpoints ng-if="vm.opts.loading"></loadingpoints>\n' + '      </td>\n' + '    </tr>\n' + '\n' + '    <tr ng-if="vm.opts.entries && vm.opts.entries.length" ng-repeat="row in vm.opts.entries" ng-style="vm.editableCell[0]===$index && {\'background-color\': vm.opts.colors.primaryColor, \'color\': vm.opts.colors.primaryFontColor}" ng-class="{\'clickable\': vm.opts.onRowClick, \'notclickable\': !vm.opts.onRowClick || vm.editableCell[0]!==null}" ng-click="!vm.opts.onRowClick || vm.editableCell[0]!==null || vm.opts.onRowClick($index)">\n' + '\n' + '      <td ng-repeat="cell in vm.opts.entrieValuesOrder" ng-mouseleave="hover=false" ng-mouseenter="hover=true">\n' + '\n' + '        <span ng-if="(vm.editableCell[0]!==$parent.$index || vm.editableCell[1]!==$index) || !vm.opts.columns[$index].editable">\n' + '          {{row[cell]}} {{columnValues[$index]}}\n' + '        </span>\n' + '\n' + '        <span ng-if="vm.editableCell[1]===$index && vm.editableCell[0]===$parent.$index && vm.opts.columns[$index].editable">\n' + '          <input type="text" class="edit-input" ng-model="vm.tempEditColumnCopy[cell]" focus-me="vm.editableCell[1]===$index && vm.editableCell[0]===$parent.$parent.$index" ng-click="$event.stopPropagation()" ng-keyup="$event.keyCode == 13 && saveEditedColumn()"/> {{columnValues[$index]}}\n' + '        </span>\n' + '\n' + '        <div class="cell-controll edit" ng-if="vm.opts.columns[$index].editable && hover" ng-click="toggleEditCell($event, $parent.$parent.$index, $index)" ng-style="hoverEdit && {\'background-color\': vm.opts.colors.primaryColor, \'color\': vm.opts.colors.primaryFontColor}" ng-mouseenter="hoverEdit=true" ng-mouseleave="hoverEdit=false">\n' + '          <div ng-if="hover" class="icon icon-edit"></div>\n' + '        </div>\n' + '        <div class="cell-controll save" ng-if="vm.opts.columns[$index].editable && vm.editableCell[0]===$parent.$index && vm.editableCell[1]===$index" ng-style="{\'background-color\': vm.opts.colors.secondaryColor, \'color\': vm.opts.colors.secondaryFontColor}" ng-click="$parent.hover=false;saveEditedColumn()">\n' + '          <div  class="icon icon-check"></div>\n' + '        </div>\n' + '      </td>\n' + '\n' + '      <td ng-if="vm.opts.editable" class="edit" ng-class="{\'active\': vm.editableCell[1]===$parent.$index}"></td>\n' + '\n' + '    </tr>\n' + '  </tbody>\n' + '\n' + '</table>\n' + '\n' + '<div class="bottom-row">\n' + '  <div class="paginator">\n' + '\n' + '    <div class="paginator__first" ng-class="{\'inactive\': vm.opts.paginationModel === 1}"\n' + '    ng-style="vm.opts.paginationModel !== 1 && !pageFirstHover && {\'color\': vm.opts.colors.secondaryColor} ||\n' + '              vm.opts.paginationModel !== 1 && pageFirstHover && {\'color\': vm.opts.colors.secondaryColor, \'background-color\': vm.opts.colors.primaryColor}"\n' + '    ng-disabled="vm.opts.paginationModel === 1" ng-click="setPage(1)" ng-mouseenter="pageFirstHover=true" ng-mouseleave="pageFirstHover=false"> {{\'TABLE_PAGING_START\'|translate}}</div>\n' + '\n' + '    <div class="paginator__mid" ng-if="vm.paginationStart > 1" ng-click="skipPagesBackward()"\n' + '    ng-style="pageMid1Hover && {\'color\': vm.opts.colors.secondaryColor, \'background-color\': vm.opts.colors.primaryColor} ||\n' + '             {\'color\': vm.opts.colors.secondaryColor}"\n' + '    ng-mouseenter="pageMid1Hover=true" ng-mouseleave="pageMid1Hover=false"> ... </div>\n' + '\n' + '    <div class="paginator__mid" ng-class="{\'active\': i === vm.opts.paginationModel}" ng-repeat="i in [vm.paginationStart, vm.paginationEnd] | toRange" ng-click="setPage(i)"\n' + '    ng-style="i !== vm.opts.paginationModel && !pageMidHover && {\'color\': vm.opts.colors.secondaryColor} ||\n' + '              i !== vm.opts.paginationModel && pageMidHover && {\'background-color\': vm.opts.colors.primaryColor, \'color\': vm.opts.colors.secondaryColor} ||\n' + '              {\'color\': vm.opts.colors.secondaryFontColor, \'background-color\': vm.opts.colors.secondaryColor}"\n' + '    ng-mouseenter="pageMidHover=true" ng-mouseleave="pageMidHover=false"> {{i}} </div>\n' + '\n' + '    <div class="paginator__mid" ng-if="vm.paginationEnd < vm.opts.pageCount" ng-click="skipPagesForward()"\n' + '    ng-style="pageMid2Hover && {\'color\': vm.opts.colors.secondaryColor, \'background-color\': vm.opts.colors.primaryColor} ||\n' + '              {\'color\': vm.opts.colors.secondaryColor}"\n' + '    ng-mouseenter="pageMid2Hover=true" ng-mouseleave="pageMid2Hover=false"> ... </div>\n' + '\n' + '    <div class="paginator__last" ng-class="{\'inactive\': vm.opts.paginationModel === vm.opts.pageCount}"\n' + '    ng-style="vm.opts.paginationModel !== vm.opts.pageCount && !pageLastHover && {\'color\': vm.opts.colors.secondaryColor} ||\n' + '              vm.opts.paginationModel !== vm.opts.pageCount && pageLastHover && {\'color\': vm.opts.colors.secondaryColor, \'background-color\': vm.opts.colors.primaryColor}"\n' + '    ng-disabled="vm.opts.paginationModel === vm.opts.pageCount" ng-click="setPage(vm.opts.pageCount)" ng-mouseenter="pageLastHover=true" ng-mouseleave="pageLastHover=false"> {{\'TABLE_PAGING_END\'|translate}}</div>\n' + '\n' + '  </div>\n' + '</div>\n');
  }
]);