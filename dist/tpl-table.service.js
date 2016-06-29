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
var _ = require('lodash');
var TplTableService = (function () {
    function TplTableService() {
        this.tables = {};
    }
    // TODO: check what is it good for
    TplTableService.prototype.addTable = function (newTableOpts) {
        var oldTableOpts = _.cloneDeep(this.tables[newTableOpts.id]);
        // copy pageObj of oldTableOpts to newTableOpts if present
        newTableOpts.pageObj = {
            actualPage: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.actualPage : null,
            actualSearch: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.actualSearch : '',
            actualEntriesPerPageCount: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.actualEntriesPerPageCount : null,
            pageBeforeSearch: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.pageBeforeSearch : null,
            entriesPerPageCountBeforeSearch: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.entriesPerPageCountBeforeSearch : null
        };
        this.tables[newTableOpts.id] = newTableOpts;
    };
    TplTableService.prototype.setColumns = function (tableId, columns) {
        var table = this.tables[tableId];
        if (table) {
            table.setColumns(columns);
        }
    };
    TplTableService.prototype.setPageCount = function (tableId, pageCount) {
        var table = this.tables[tableId];
        if (table) {
            table.setPageCount(pageCount);
        }
    };
    TplTableService.prototype.setStateBeforeDetail = function (id, state) {
        this.tables[id].pageObj.actualPage = state.actualPage;
        this.tables[id].pageObj.actualSearch = state.actualSearch;
        this.tables[id].pageObj.actualEntriesPerPageCount = state.actualEntriesPerPageCount;
    };
    TplTableService.prototype.getStateBeforeDetail = function (id) {
        if (!id || !this.tables[id]) {
            return null;
        }
        return {
            actualPage: this.tables[id].pageObj ? this.tables[id].pageObj.actualPage : null,
            actualSearch: this.tables[id].pageObj ? this.tables[id].pageObj.actualSearch : '',
            actualEntriesPerPageCount: this.tables[id].pageObj ? this.tables[id].pageObj.actualEntriesPerPageCount : null
        };
    };
    TplTableService.prototype.setStateBeforeSearch = function (id, stateBeforeSearch) {
        this.tables[id].pageObj.pageBeforeSearch = stateBeforeSearch.pageBeforeSearch;
        this.tables[id].pageObj.entriesPerPageCountBeforeSearch = stateBeforeSearch.entriesPerPageCountBeforeSearch;
    };
    TplTableService.prototype.getStateBeforeSearch = function (id) {
        if (!id || !this.tables[id]) {
            return null;
        }
        return {
            pageBeforeSearch: this.tables[id].pageObj ? this.tables[id].pageObj.pageBeforeSearch : null,
            entriesPerPageCountBeforeSearch: this.tables[id].pageObj ? this.tables[id].pageObj.entriesPerPageCountBeforeSearch : null
        };
    };
    TplTableService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], TplTableService);
    return TplTableService;
}());
exports.TplTableService = TplTableService;
//# sourceMappingURL=tpl-table.service.js.map