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
var common_1 = require('@angular/common');
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var ng2_translate_1 = require('ng2-translate/ng2-translate');
var helper_1 = require('./helper');
var loading_points_1 = require('./loading-points');
var pipes_1 = require('./pipes');
var tpl_table_component_1 = require('./tpl-table.component');
var tpl_table_service_1 = require('./tpl-table.service');
var TplTableModule = (function () {
    function TplTableModule() {
    }
    TplTableModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ng2_translate_1.TranslateModule.forRoot()
            ],
            declarations: [
                pipes_1.CheckmarkPipe,
                helper_1.FocusMeDirective,
                loading_points_1.LoadingPointsComponent,
                pipes_1.ToRangePipe,
                tpl_table_component_1.TplTableComponent
            ],
            providers: [
                tpl_table_service_1.TplTableService
            ],
            exports: [tpl_table_component_1.TplTableComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], TplTableModule);
    return TplTableModule;
}());
exports.TplTableModule = TplTableModule;
//# sourceMappingURL=tpl-table.module.js.map