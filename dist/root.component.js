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
require('./tpl-table.component.css');
var core_1 = require('@angular/core');
var interfaces_1 = require('./interfaces');
var tpl_table_component_1 = require('./tpl-table.component');
var RootComponent = (function () {
    function RootComponent() {
    }
    RootComponent.prototype.ngOnInit = function () {
        this.options = {
            id: 'tableName',
            columns: [
                {
                    name: 'firstname',
                    content: interfaces_1.TplTableColumnContentType.TEXT
                }
            ],
            entrieValuesOrder: ['firstname'],
            entries: [
                {
                    firstname: 'Max'
                }
            ],
            pageCount: 10
        };
    };
    RootComponent = __decorate([
        core_1.Component({
            selector: 'root',
            template: "\n    <tpl-table [tplTableOptions]=\"options\"></tpl-table>\n  ",
            directives: [tpl_table_component_1.TplTableComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], RootComponent);
    return RootComponent;
}());
exports.RootComponent = RootComponent;
//# sourceMappingURL=root.component.js.map