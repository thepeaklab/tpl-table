// import 'angular';
// import 'angular-mocks/angular-mocks';
// import { TplTableComponent } from './tpl-table.component';
// angular
// .module('tpl.table.test', [])
// .component('tplTable', TplTableComponent);
// describe('Component: tpl-table', () => {
//   let component: any,
//       scope: angular.IScope,
//       tableOptions: any,
//       $componentController: any;
//   beforeEach(angular.mock.module('tpl.table.test'));
//   beforeEach(inject((_$rootScope_, _$componentController_) => {
//     scope = _$rootScope_.$new();
//     $componentController = _$componentController_;
//     tableOptions = {};
//   }));
//   it('shouldn\'t init if no bindings are set', () => {
//     component = $componentController('tplTable',
//       {$scope: scope}
//     );
//     expect(component.opts).toBe(undefined);
//   });
//   it('should set default values for bindings', () => {
//     component = $componentController('tplTable',
//       {$scope: scope},
//       {tplTableOptions: tableOptions}
//     );
//     expect(component.opts.id).toBe('tpltable');
//   });
// });
//# sourceMappingURL=tpl-table.component.spec.js.map