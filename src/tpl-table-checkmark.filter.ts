/* @ngdoc filter
 * @name tpl.table.filter:checkmark
 * @description
 * Filter
*/
export function checkmarkFilter() {
  return (input: any) => {
    return typeof input === 'boolean' ? (input ? '\u2713' : '\u2718') : input;
  };
}
