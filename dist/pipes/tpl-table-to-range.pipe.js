"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ToRangePipe = (function () {
    function ToRangePipe() {
    }
    ToRangePipe.prototype.transform = function (input) {
        var lowBound, highBound;
        if (input.length === 1) {
            lowBound = 0;
            highBound = +input[0] - 1;
        }
        else if (input.length === 2) {
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
    ToRangePipe = __decorate([
        core_1.Pipe({
            name: 'toRange'
        }), 
        __metadata('design:paramtypes', [])
    ], ToRangePipe);
    return ToRangePipe;
}());
exports.ToRangePipe = ToRangePipe;
//# sourceMappingURL=tpl-table-to-range.pipe.js.map