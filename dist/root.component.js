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
var tpl_table_component_1 = require('./tpl-table.component');
var RootComponent = (function () {
    function RootComponent() {
    }
    RootComponent.prototype.ngOnInit = function () {
        this.options = {
            id: 'tableName',
            initialColumns: [
                {
                    name: 'Vorname',
                    translateColumn: true,
                    editable: true
                }
            ],
            initialEntrieValuesOrder: ['firstname'],
            initialEntries: [
                {
                    firstname: 'Max'
                }
            ],
            enableActionsColumn: true,
            enablePagination: true,
            initialPageCount: 6,
            enableSearch: true,
            loading: true
        };
    };
    RootComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.tplTableComponent.rowClick$) {
                _this.rowClickSubscription = _this.tplTableComponent
                    .rowClick$
                    .subscribe(function (data) {
                    console.log('row clicked', data.$index);
                });
            }
            if (_this.tplTableComponent.delete$) {
                _this.deleteSubscription = _this.tplTableComponent
                    .delete$
                    .subscribe(function (data) {
                    console.log('delete row', data.$index);
                });
            }
            if (_this.tplTableComponent.inlineCellEdit$) {
                _this.inlineEditSubscription = _this.tplTableComponent
                    .inlineCellEdit$
                    .subscribe(function (data) {
                    console.log(data);
                });
            }
        }, 0);
        setTimeout(function () {
            _this.options.loading = false;
        }, 2000);
    };
    RootComponent.prototype.ngOnDestroy = function () {
        if (this.rowClickSubscription) {
            this.rowClickSubscription.unsubscribe();
        }
        if (this.deleteSubscription) {
            this.deleteSubscription.unsubscribe();
        }
        if (this.inlineEditSubscription) {
            this.inlineEditSubscription.unsubscribe();
        }
    };
    ///////////////////////
    // TPL TABLE OUTPUTS //
    ///////////////////////
    RootComponent.prototype.tableSearchChange = function (model) {
        console.table(model);
    };
    RootComponent.prototype.tablePageChange = function (model) {
        console.table(model);
    };
    RootComponent.prototype.tablePageSizeChange = function (model) {
        console.table(model);
    };
    __decorate([
        core_1.ViewChild(tpl_table_component_1.TplTableComponent), 
        __metadata('design:type', tpl_table_component_1.TplTableComponent)
    ], RootComponent.prototype, "tplTableComponent", void 0);
    RootComponent = __decorate([
        core_1.Component({
            selector: 'root',
            template: "\n    <tpl-table [tplTableOptions]=\"options\" (searchChange)=\"tableSearchChange($event)\" (pageChange)=\"tablePageChange($event)\" (pageSizeChange)=\"tablePageSizeChange($event)\"></tpl-table>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], RootComponent);
    return RootComponent;
}());
exports.RootComponent = RootComponent;
//# sourceMappingURL=root.component.js.map