angular.module('tpl.table').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/loading-points.directive.html',
    "<!-- <svg width=\"70\" height=\"20\">\n" +
    "  <rect width=\"6\" height=\"6\" x=\"0\" y=\"0\" rx=\"1\" ry=\"1\">\n" +
    "    <animate attributeName=\"width\" values=\"0;6;6;6;0\" dur=\"1000ms\" repeatCount=\"indefinite\"/>\n" +
    "    <animate attributeName=\"height\" values=\"0;6;6;6;0\" dur=\"1000ms\" repeatCount=\"indefinite\"/>\n" +
    "    <animate attributeName=\"x\" values=\"3;0;0;0;3\" dur=\"1000ms\" repeatCount=\"indefinite\"/>\n" +
    "    <animate attributeName=\"y\" values=\"3;0;0;0;3\" dur=\"1000ms\" repeatCount=\"indefinite\"/>\n" +
    "  </rect>\n" +
    "  <rect width=\"6\" height=\"6\" x=\"10\" y=\"0\" rx=\"1\" ry=\"1\">\n" +
    "    <animate attributeName=\"width\" values=\"0;6;6;6;0\" begin=\"200ms\" dur=\"1000ms\" repeatCount=\"indefinite\"/>\n" +
    "    <animate attributeName=\"height\" values=\"0;6;6;6;0\" begin=\"200ms\" dur=\"1000ms\" repeatCount=\"indefinite\"/>\n" +
    "    <animate attributeName=\"x\" values=\"10;8;8;8;10\" begin=\"200ms\" dur=\"1000ms\" repeatCount=\"indefinite\"/>\n" +
    "    <animate attributeName=\"y\" values=\"3;0;0;0;3\" begin=\"200ms\" dur=\"1000ms\" repeatCount=\"indefinite\"/>\n" +
    "  </rect>\n" +
    "  <rect width=\"6\" height=\"6\" x=\"20\" y=\"0\" rx=\"1\" ry=\"1\">\n" +
    "    <animate attributeName=\"width\" values=\"0;6;6;6;0\" begin=\"400ms\" dur=\"1000ms\" repeatCount=\"indefinite\"/>\n" +
    "    <animate attributeName=\"height\" values=\"0;6;6;6;0\" begin=\"400ms\" dur=\"1000ms\" repeatCount=\"indefinite\"/>\n" +
    "    <animate attributeName=\"x\" values=\"18;16;16;16;18\" begin=\"400ms\" dur=\"1000ms\" repeatCount=\"indefinite\"/>\n" +
    "    <animate attributeName=\"y\" values=\"3;0;0;0;3\" begin=\"400ms\" dur=\"1000ms\" repeatCount=\"indefinite\"/>\n" +
    "  </rect>\n" +
    "</svg> -->\n" +
    "<div id=\"rect3\"></div>\n" +
    "<div id=\"rect2\"></div>\n" +
    "<div id=\"rect1\"></div>\n"
  );


  $templateCache.put('src/tpltable.directive.html',
    "\n" +
    "<div class=\"top-row\">\n" +
    "\n" +
    "  <div class=\"elementsperside__select prettyselect\" ng-if=\"vm.opts.entriesPerPageCount && vm.opts.showPagination\">\n" +
    "    <select class=\"top-row__entry-count input-sm\" ng-model=\"vm.opts.entriesPerPageCount\" ng-options=\"o as o for o in vm.POSSIBLE_RANGE_VALUES\" ng-style=\"{'color': vm.opts.colors.secondaryColor}\"></select>\n" +
    "  </div>\n" +
    "  <span class=\"elementsperside__label\" ng-if=\"vm.opts.entriesPerPageCount && vm.opts.showPagination\">\n" +
    "    {{ 'TABLE_ENTRIES_PER_SITE' | translate }} {{dataOrder}}\n" +
    "  </span>\n" +
    "\n" +
    "  <form ng-if=\"vm.opts.searchModel!==null\" ng-submit=\"setSearch()\">\n" +
    "    <input class=\"top-row__search\" type=\"text\" ng-model=\"vm.searchInput\" placeholder=\"{{'TABLE_SEARCH'|translate}}\" />\n" +
    "  </form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<table class=\"tpltable\">\n" +
    "\n" +
    "  <thead class=\"tpltable__head\">\n" +
    "    <tr>\n" +
    "      <th ng-repeat=\"column in vm.opts.columns\" ng-if=\"!column.ngIf || column.ngIf()\">\n" +
    "        <span ng-if=\"!column.translateColumn\">{{column.name}}</span>\n" +
    "        <span ng-if=\"column.translateColumn\">{{column.name | translate}}</span>\n" +
    "      </th>\n" +
    "      <th ng-if=\"vm.opts.showActionsColumn\" class=\"edit\">Aktionen</th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "\n" +
    "  <tbody class=\"tpltable__body\">\n" +
    "\n" +
    "    <tr class=\"tpltable__row--placeholder\" ng-if=\"!vm.opts.entries || !vm.opts.entries.length || vm.opts.loading\">\n" +
    "      <td colspan=\"{{vm.opts.entrieValuesOrder.length + (vm.opts.actions ? 1 : 0)}}\">\n" +
    "        <span ng-if=\"!vm.opts.loading\">{{vm.opts.noDataAvailableText | translate}}</span>\n" +
    "        <loadingpoints ng-if=\"vm.opts.loading\"></loadingpoints>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "\n" +
    "    <tr ng-if=\"vm.opts.entries && vm.opts.entries.length\" ng-repeat=\"row in vm.opts.entries\">\n" +
    "\n" +
    "      <td ng-repeat=\"cell in vm.opts.entrieValuesOrder\" ng-mouseleave=\"hover=false\" ng-mouseenter=\"hover=true\" ng-style=\"vm.editableCell[0]===$parent.$parent.$index && {'background-color': vm.opts.colors.primaryColor, 'color': vm.opts.colors.primaryFontColor}\" ng-class=\"{'clickable': vm.opts.onRowClick, 'notclickable': !vm.opts.onRowClick || vm.editableCell[0]!==null}\" ng-click=\"!vm.opts.onRowClick || vm.editableCell[0]!==null || vm.opts.onRowClick($parent.$parent.$index)\" ng-if=\"!vm.opts.columns[$index].ngIf || vm.opts.columns[$index].ngIf()\">\n" +
    "\n" +
    "        <div ng-if=\"(vm.editableCell[0]!==$parent.$parent.$parent.$index || vm.editableCell[1]!==$index || !vm.opts.columns[$index].editable)\">\n" +
    "          <!-- TEXT -->\n" +
    "          <div class=\"cell__text\" ng-if=\"vm.opts.columns[$index].content === vm.POSSIBLE_CONTENT_TYPES[0]\">\n" +
    "            <span ng-if=\"!vm.opts.columns[$index].translateValues\">\n" +
    "              {{(cell.indexOf('.') !== -1 ? vm.getCellValue(row, cell) : row[cell]) | checkmark}} {{columnValues[$index]}}\n" +
    "            </span>\n" +
    "            <span ng-if=\"vm.opts.columns[$index].translateValues\">\n" +
    "              {{((vm.opts.columns[$index].translateValuePrefix ? vm.opts.columns[$index].translateValuePrefix : '') + (cell.indexOf('.') !== -1 ? vm.getCellValue(row, cell) : row[cell])) | translate}} {{columnValues[$index]}}\n" +
    "            </span>\n" +
    "          </div>\n" +
    "          <!-- IMAGE -->\n" +
    "          <div class=\"cell__image\" ng-if=\"vm.opts.columns[$index].content === vm.POSSIBLE_CONTENT_TYPES[1]\">\n" +
    "            <img  ng-src=\"{{row[cell]}}\" ng-style=\"{'max-width': vm.opts.columns[$index].maxWidth ? vm.opts.columns[$index].maxWidth : '250px', 'max-height': vm.opts.columns[$index].maxHeight ? vm.opts.columns[$index].maxHeight : '250px'}\" />\n" +
    "          </div>\n" +
    "          <!-- OTHER ??? -->\n" +
    "        </div>\n" +
    "\n" +
    "        <span ng-if=\"vm.editableCell[1]===$index && vm.editableCell[0]===$parent.$index && vm.opts.columns[$index].editable\">\n" +
    "          <input type=\"text\" class=\"edit-input\" ng-model=\"vm.tempEditColumnCopy[cell]\" focus-me=\"vm.editableCell[1]===$index && vm.editableCell[0]===$parent.$parent.$index\" ng-click=\"$event.stopPropagation()\" ng-keyup=\"$event.keyCode == 13 && saveEditedColumn()\"/> {{columnValues[$index]}}\n" +
    "        </span>\n" +
    "\n" +
    "        <div class=\"cell-controll edit\" ng-if=\"vm.opts.columns[$index].editable && hover\" ng-click=\"toggleEditCell($event, $parent.$parent.$index, $index)\" ng-style=\"hoverEdit && {'background-color': vm.opts.colors.primaryColor, 'color': vm.opts.colors.primaryFontColor}\" ng-mouseenter=\"hoverEdit=true\" ng-mouseleave=\"hoverEdit=false\">\n" +
    "          <div ng-if=\"hover\" class=\"iconfont tbl-iconfont-pen\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"cell-controll save\" ng-if=\"vm.opts.columns[$index].editable && vm.editableCell[0]===$parent.$index && vm.editableCell[1]===$index\" ng-style=\"{'background-color': vm.opts.colors.secondaryColor, 'color': vm.opts.colors.secondaryFontColor}\" ng-click=\"$parent.hover=false;saveEditedColumn()\">\n" +
    "          <div  class=\"iconfont iconfont-check\"></div>\n" +
    "        </div>\n" +
    "      </td>\n" +
    "\n" +
    "      <td ng-if=\"vm.opts.showActionsColumn\" class=\"edit\">\n" +
    "        <span ng-if=\"vm.opts.actions.assign.function && vm.opts.actions.assign.if($index)\" class=\"tbl-iconfont tbl-iconfont-export\" ng-click=\"!vm.opts.actions.assign.function || vm.editableCell[0]!==null || vm.opts.actions.assign.function($index)\"></span>\n" +
    "        <span ng-if=\"vm.opts.actions.edit.function && vm.opts.actions.edit.if($index)\" class=\"tbl-iconfont tbl-iconfont-pen\" ng-click=\"!vm.opts.actions.edit.function || vm.editableCell[0]!==null || vm.opts.actions.edit.function($index)\"></span>\n" +
    "        <span ng-if=\"vm.opts.actions.delete.function && vm.opts.actions.delete.if($index)\" class=\"tbl-iconfont tbl-iconfont-delete\" ng-click=\"!vm.opts.actions.delete.function || vm.editableCell[0]!==null || vm.opts.actions.delete.function($index)\"></span>\n" +
    "        <span ng-if=\"vm.opts.actions.add.function && vm.opts.actions.add.if($index)\" class=\"icon icon-cal-button\" ng-click=\"!vm.opts.actions.add.function || vm.editableCell[0] !== null || vm.opts.actions.add.function($index)\"></span>\n" +
    "        <span ng-if=\"vm.opts.actions.confirm.function && vm.opts.actions.confirm.if($index)\" class=\"iconfont iconfont-check\" ng-click=\"!vm.opts.actions.confirm.function ||  vm.editableCell[0]!=null || vm.opts.actions.confirm.function($index)\"></span>\n" +
    "      </td>\n" +
    "\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "\n" +
    "</table>\n" +
    "\n" +
    "<div class=\"bottom-row\" ng-if=\"vm.opts.paginationModel && vm.opts.showPagination\">\n" +
    "  <div class=\"paginator\">\n" +
    "\n" +
    "    <div class=\"paginator__first\" ng-class=\"{'inactive': vm.opts.paginationModel === 1}\"\n" +
    "    ng-style=\"vm.opts.paginationModel !== 1 && !pageFirstHover && {'color': vm.opts.colors.secondaryColor} ||\n" +
    "    vm.opts.paginationModel !== 1 && pageFirstHover && {'color': vm.opts.colors.secondaryColor, 'background-color': vm.opts.colors.primaryColor}\"\n" +
    "    ng-disabled=\"vm.opts.paginationModel === 1\" ng-click=\"setPage(1)\" ng-mouseenter=\"pageFirstHover=true\" ng-mouseleave=\"pageFirstHover=false\"> {{'TABLE_PAGING_START'|translate}}</div>\n" +
    "\n" +
    "    <div class=\"paginator__mid\" ng-if=\"vm.paginationStart > 1\" ng-click=\"skipPagesBackward()\"\n" +
    "      ng-style=\"pageMid1Hover && {'color': vm.opts.colors.secondaryColor, 'background-color': vm.opts.colors.primaryColor} ||\n" +
    "      {'color': vm.opts.colors.secondaryColor}\"\n" +
    "      ng-mouseenter=\"pageMid1Hover=true\" ng-mouseleave=\"pageMid1Hover=false\"> ... </div>\n" +
    "\n" +
    "      <div class=\"paginator__mid\" ng-class=\"{'active': i === vm.opts.paginationModel}\" ng-repeat=\"i in [vm.paginationStart, vm.paginationEnd] | toRange\" ng-click=\"setPage(i)\"\n" +
    "      ng-style=\"i !== vm.opts.paginationModel && !pageMidHover && {'color': vm.opts.colors.secondaryColor} ||\n" +
    "      i !== vm.opts.paginationModel && pageMidHover && {'background-color': vm.opts.colors.primaryColor, 'color': vm.opts.colors.secondaryColor} ||\n" +
    "      {'color': vm.opts.colors.secondaryFontColor, 'background-color': vm.opts.colors.secondaryColor}\"\n" +
    "      ng-mouseenter=\"pageMidHover=true\" ng-mouseleave=\"pageMidHover=false\"> {{i}} </div>\n" +
    "\n" +
    "      <div class=\"paginator__mid\" ng-if=\"vm.paginationEnd < vm.opts.pageCount\" ng-click=\"skipPagesForward()\"\n" +
    "      ng-style=\"pageMid2Hover && {'color': vm.opts.colors.secondaryColor, 'background-color': vm.opts.colors.primaryColor} ||\n" +
    "      {'color': vm.opts.colors.secondaryColor}\"\n" +
    "      ng-mouseenter=\"pageMid2Hover=true\" ng-mouseleave=\"pageMid2Hover=false\"> ... </div>\n" +
    "\n" +
    "      <div class=\"paginator__last\" ng-class=\"{'inactive': vm.opts.paginationModel === vm.opts.pageCount}\"\n" +
    "      ng-style=\"vm.opts.paginationModel !== vm.opts.pageCount && !pageLastHover && {'color': vm.opts.colors.secondaryColor} ||\n" +
    "      vm.opts.paginationModel !== vm.opts.pageCount && pageLastHover && {'color': vm.opts.colors.secondaryColor, 'background-color': vm.opts.colors.primaryColor}\"\n" +
    "      ng-disabled=\"vm.opts.paginationModel === vm.opts.pageCount\" ng-click=\"setPage(vm.opts.pageCount)\" ng-mouseenter=\"pageLastHover=true\" ng-mouseleave=\"pageLastHover=false\"> {{'TABLE_PAGING_END'|translate}}</div>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n"
  );

}]);
