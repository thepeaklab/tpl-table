import * as angular from 'angular';

import { LoadingPointsComponent } from './loading-points.component';

const LoadingPointsModule = angular
  .module('tpl.loading-points', [])
  .component('loadingpoints', LoadingPointsComponent);
export { LoadingPointsModule };
