import { Pipe, PipeTransform } from '@angular/core';

/* @ngdoc pipe
 * @name tpl.table:CheckmarkPipe
 * @description
 * Pipe
*/
@Pipe({
  name: 'checkmark'
})
export class CheckmarkPipe implements PipeTransform {
  transform(input: any): any {
    return typeof input === 'boolean' ? (input ? '\u2713' : '\u2718') : input;
  }
}
