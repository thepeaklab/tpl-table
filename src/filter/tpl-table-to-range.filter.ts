import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'to-range'
})
export class ToRangePipe implements PipeTransform {
  transform(input: any): any {
    let lowBound, highBound;
    if (input.length === 1) {
      lowBound = 0;
      highBound = +input[0] - 1;
    } else if (input.length === 2) {
      lowBound = +input[0];
      highBound = +input[1];
    }

    let i = lowBound;
    let result: any[] = [];
    while (i <= highBound) {
      result.push(i);
      i++;
    }
    return result;
  }
}
