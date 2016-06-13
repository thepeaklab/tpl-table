'use strict';

export default function toRangeFilter() {
  return (input) => {
    var lowBound, highBound;
    if (input.length === 1) {
      lowBound = 0;
      highBound = +input[0] - 1;
    } else if (input.length === 2) {
      lowBound = +input[0];
      highBound = +input[1];
    }
    var i = lowBound;
    var result = [];
    while (i <= highBound) {
      result.push(i);
      i++;
    }
    return result;
  };
}
