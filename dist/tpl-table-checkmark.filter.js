"use strict";
/* @ngdoc filter
 * @name tpl.table.filter:checkmark
 * @description
 * Filter
*/
function checkmarkFilter() {
    return function (input) {
        return typeof input === 'boolean' ? (input ? '\u2713' : '\u2718') : input;
    };
}
exports.checkmarkFilter = checkmarkFilter;
//# sourceMappingURL=tpl-table-checkmark.filter.js.map