angular.module('tpl.table')
  .directive('loadingpoints', function() {
    'use strict';
    return {
      restrict: 'E',
      templateUrl: 'src/loading-points.html'
    };
  });
