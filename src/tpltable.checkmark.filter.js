(function() {
    'use strict';

    /* jshint latedef: nofunc */
    /* @ngdoc filter
     * @name tpl.table.filter:checkmark
     * @description
     * Filter
    */
    angular
        .module('tpl.table')
        .filter('checkmark', checkmark);

    function checkmark() {
        return checkmarkFilter;

        ////////////////
        function checkmarkFilter(input) {
            return typeof input === 'boolean' ? (input ? '\u2713' : '\u2718') : input;
        }
    }
})();
