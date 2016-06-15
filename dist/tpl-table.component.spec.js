"use strict";
require('angular');
require('angular-mocks/angular-mocks');
var tpl_table_component_1 = require('./tpl-table.component');
angular
    .module('tpl.table.test', [])
    .component('tplTable', tpl_table_component_1.TplTableComponent);
describe('Component: tpl-table', function () {
    var component, scope, tableOptions, $componentController;
    beforeEach(angular.mock.module('tpl.table.test'));
    beforeEach(inject(function (_$rootScope_, _$componentController_) {
        scope = _$rootScope_.$new();
        $componentController = _$componentController_;
        tableOptions = {};
    }));
    it('shouldn\'t init if no bindings are set', function () {
        component = $componentController('tplTable', { $scope: scope });
        expect(component.opts).toBe(undefined);
    });
    it('should set default values for bindings', function () {
        component = $componentController('tplTable', { $scope: scope }, { tplTableOptions: tableOptions });
        expect(component.opts.id).toBe('tpltable');
    });
});
//# sourceMappingURL=tpl-table.component.spec.js.map