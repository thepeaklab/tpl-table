'use strict';

/* @ngdoc filter
 * @name tpl.table.filter:checkmark
 * @description
 * Filter
*/
export default function checkmark() {
    return checkmarkFilter;

    ////////////////
    function checkmarkFilter(input) {
        return typeof input === 'boolean' ? (input ? '\u2713' : '\u2718') : input;
    }
}
