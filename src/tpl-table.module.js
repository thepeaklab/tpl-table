// 3rd party
import TranslateModule from 'angular-translate';
import 'tpl.scope-listener-manager/dist/tpl.scope-listener-manager';

// own
import LoadingPointsModule from './loading-points/loading-points.module';


import CheckmarkFilter from './tpl-table-checkmark.filter';
import ToRangeFilter from './tpl-table-toRange.filter';
import FocusMeDirective from './focus-me.directive';
import TplTableComponent from './tpl-table.component';
import TplTableService from './tpl-table.service';

export default angular
	.module('tpl.table', [
      /* 3rd party */
      TranslateModule,
      'tpl.scope-listener-manager',

      /* own */
      LoadingPointsModule
    ])
    .filter('checkmark', CheckmarkFilter)
    .filter('toRange', ToRangeFilter)
    .directive('focusMe', () => new FocusMeDirective())
    .component('tplTable', TplTableComponent)
    .service('tplTableService', TplTableService)
    .name;
