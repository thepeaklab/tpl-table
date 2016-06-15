"use strict";
// 3rd party
var angular = require('angular');
var TranslateModule = require('angular-translate');
require('tpl.scope-listener-manager/dist/tpl.scope-listener-manager');
// own
var focus_me_directive_1 = require('./focus-me.directive');
var loading_points_1 = require('./loading-points');
var tpl_table_checkmark_filter_1 = require('./tpl-table-checkmark.filter');
var tpl_table_component_1 = require('./tpl-table.component');
var tpl_table_to_range_filter_1 = require('./tpl-table-to-range.filter');
var tpl_table_service_1 = require('./tpl-table.service');
var TplTableModule = angular
    .module('tpl.table', [
    /* 3rd party */
    'tpl.scope-listener-manager',
    TranslateModule,
    /* own */
    loading_points_1.LoadingPointsModule
])
    .filter('checkmark', tpl_table_checkmark_filter_1.checkmarkFilter)
    .filter('toRange', tpl_table_to_range_filter_1.toRangeFilter)
    .directive('focusMe', function () { return new focus_me_directive_1.FocusMeDirective(); })
    .component('tplTable', tpl_table_component_1.TplTableComponent)
    .service('tplTableService', tpl_table_service_1.TplTableService);
exports.TplTableModule = TplTableModule;
//# sourceMappingURL=tpl-table.module.js.map