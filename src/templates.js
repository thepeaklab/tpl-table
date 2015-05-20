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
    "  <div class=\"elementsperside__select prettyselect\">\n" +
    "    <select class=\"top-row__entry-count input-sm\" ng-model=\"vm.opts.entriesPerPageCount\" ng-options=\"o as o for o in vm.POSSIBLE_RANGE_VALUES\" />\n" +
    "  </div>\n" +
    "  <span class=\"elementsperside__label\">\n" +
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
    "      <th ng-repeat=\"column in vm.opts.columns\">{{column.name}}</th>\n" +
    "      <th ng-if=\"vm.opts.editable\" class=\"edit\">edit.</th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "\n" +
    "  <tbody class=\"tpltable__body\">\n" +
    "\n" +
    "    <tr class=\"tpltable__row--placeholder\" ng-if=\"!vm.opts.entries || !vm.opts.entries.length\">\n" +
    "      <td colspan=\"{{vm.opts.entrieValuesOrder.length + (vm.opts.editable ? 1 : 0)}}\">\n" +
    "        <span ng-if=\"!vm.opts.loading\">{{vm.opts.noDataAvailableText}}</span>\n" +
    "        <loadingpoints ng-if=\"vm.opts.loading\"></loadingpoints>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "\n" +
    "    <tr ng-if=\"vm.opts.entries && vm.opts.entries.length\" ng-repeat=\"row in vm.opts.entries\" ng-class=\"{'active': vm.editableCell[0]===$index, 'clickable': vm.opts.onRowClick, 'notclickable': !vm.opts.onRowClick || vm.editableCell[0]!==null}\" ng-click=\"!vm.opts.onRowClick || vm.editableCell[0]!==null || vm.opts.onRowClick($index)\">\n" +
    "\n" +
    "      <td ng-repeat=\"cell in vm.opts.entrieValuesOrder\" ng-mouseleave=\"hover=false\" ng-mouseenter=\"hover=true\">\n" +
    "\n" +
    "        <span ng-if=\"(vm.editableCell[0]!==$parent.$index || vm.editableCell[1]!==$index) || !vm.opts.columns[$index].editable\">\n" +
    "          {{row[cell]}} {{columnValues[$index]}}\n" +
    "        </span>\n" +
    "\n" +
    "        <span ng-if=\"vm.editableCell[1]===$index && vm.editableCell[0]===$parent.$index && vm.opts.columns[$index].editable\">\n" +
    "          <input type=\"text\" class=\"edit-input\" ng-model=\"vm.tempEditColumnCopy[cell]\" focus-me=\"vm.editableCell[1]===$index && vm.editableCell[0]===$parent.$parent.$index\" ng-click=\"$event.stopPropagation()\" ng-keyup=\"$event.keyCode == 13 && saveEditedColumn()\"/> {{columnValues[$index]}}\n" +
    "        </span>\n" +
    "\n" +
    "        <div class=\"cell-controll edit\" ng-if=\"vm.opts.columns[$index].editable && hover\" ng-click=\"toggleEditCell($event, $parent.$parent.$index, $index)\">\n" +
    "          <div ng-if=\"hover\" class=\"icon icon-edit\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"cell-controll save\" ng-if=\"vm.opts.columns[$index].editable && vm.editableCell[0]===$parent.$index && vm.editableCell[1]===$index\" ng-click=\"$parent.hover=false;saveEditedColumn()\">\n" +
    "          <div  class=\"icon icon-check\"></div>\n" +
    "        </div>\n" +
    "      </td>\n" +
    "\n" +
    "      <td ng-if=\"vm.opts.editable\" class=\"edit\" ng-class=\"{'active': vm.editableCell[1]===$parent.$index}\"></td>\n" +
    "\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "\n" +
    "</table>\n" +
    "\n" +
    "<div class=\"bottom-row\">\n" +
    "  <div class=\"paginator\">\n" +
    "    <div class=\"paginator__first\" ng-class=\"{'inactive': vm.opts.paginationModel === 1}\" ng-disabled=\"vm.opts.paginationModel === 1\" ng-click=\"setPage(1)\"> {{'TABLE_PAGING_START'|translate}}</div>\n" +
    "    <div class=\"paginator__mid\" ng-if=\"vm.paginationStart > 1\" ng-click=\"skipPagesBackward()\"> ... </div>\n" +
    "\n" +
    "    <div class=\"paginator__mid\" ng-class=\"{'active': i === vm.opts.paginationModel}\" ng-repeat=\"i in [vm.paginationStart, vm.paginationEnd] | toRange\"\n" +
    "    ng-click=\"setPage(i)\"> {{i}} </div>\n" +
    "\n" +
    "    <div class=\"paginator__mid\" ng-if=\"vm.paginationEnd < vm.opts.pageCount\" ng-click=\"skipPagesForward()\"> ... </div>\n" +
    "    <div class=\"paginator__last\" ng-class=\"{'inactive': vm.opts.paginationModel === vm.opts.pageCount}\" ng-disabled=\"vm.opts.paginationModel === vm.opts.pageCount\" ng-click=\"setPage(vm.opts.pageCount)\"> {{'TABLE_PAGING_END'|translate}}</div>\n" +
    "  </div>\n" +
    "</div>\n"
  );

}]);
