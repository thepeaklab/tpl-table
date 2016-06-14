// 3rd party
import * as angular from 'angular';
const TranslateModule = require('angular-translate');
import 'tpl.scope-listener-manager/dist/tpl.scope-listener-manager';

// own
import { FocusMeDirective } from './focus-me.directive';
import { LoadingPointsModule } from './loading-points';
import { checkmarkFilter } from './tpl-table-checkmark.filter';
import { toRangeFilter } from './tpl-table-to-range.filter';
import { TplTableComponent } from './tpl-table.component';
import { TplTableService } from './tpl-table.service';

const TplTableModule = angular
.module('tpl.table', [
    /* 3rd party */
    'tpl.scope-listener-manager',
    TranslateModule,

    /* own */
    LoadingPointsModule
  ])
  .filter('checkmark', checkmarkFilter)
  .filter('toRange', toRangeFilter)
  .directive('focusMe', () => new FocusMeDirective())
  .component('tplTable', TplTableComponent)
  .service('tplTableService', TplTableService);
export { TplTableModule };
