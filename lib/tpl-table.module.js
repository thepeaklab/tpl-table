'use strict';

import CheckmarkFilter from './tpl-table-checkmark.filter';
import ToRangeFilter from './tpl-table-toRange.filter';
import FocusMeDirective from './focus-me.directive';
import LoadingPointsComponent from './loading-points.component';
import TplTableComponent from './tpl-table.component';
import TplTableService from './tpl-table.service';

export default angular
	.module('tpl.table', [
      /* 3rd party */

      /* own */
      'tpl.scope-listener-manager'
    ])
    .filter('checkmark', CheckmarkFilter)
    .filter('toRange', ToRangeFilter)
    .directive('focusMe', () => new FocusMeDirective())
    .component('loadingpoints', LoadingPointsComponent)
    .component('tplTable', TplTableComponent)
    .service('tplTableService', TplTableService)
    .name;
