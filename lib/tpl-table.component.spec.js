import 'angular';
import 'angular-mocks/angular-mocks';


import './tpl-table.module';

describe('component: tpl-table', () => {
  let component, scope, tableOptions, $componentController;

  beforeEach(angular.mock.module('tpl.table'));

  beforeEach(inject((_$rootScope_, _$componentController_) => {
    scope = _$rootScope_.$new();
    $componentController = _$componentController_;
    tableOptions = {};
  }));

  it('shouldn\'t init if no bindings are set', () => {
    component = $componentController('tplTable',
      {$scope: scope}
    );

    expect(component.opts).toBe(undefined);
  });

  it('should set default values for bindings', () => {
    component = $componentController('tplTable',
      {$scope: scope},
      {tplTableOptions: tableOptions}
    );

    expect(component.opts.id).toBe('tpltable');
  });

  // it('should')
});
