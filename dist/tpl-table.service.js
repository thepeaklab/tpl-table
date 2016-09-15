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
    //////////////////////
    // PUBLIC FUNCTIONS //
    //////////////////////
    TplTableService.prototype.addTable = function (newTableOpts) {
        var oldTableOpts = _.cloneDeep(this.tables[newTableOpts.id]);
        // copy stateObject of oldTableOpts to newTableOpts if present
        newTableOpts.stateObject = {
            actualPage: oldTableOpts && oldTableOpts.stateObject ? oldTableOpts.stateObject.actualPage : null,
            actualSearch: oldTableOpts && oldTableOpts.stateObject ? oldTableOpts.stateObject.actualSearch : '',
            actualEntriesPerPageCount: oldTableOpts && oldTableOpts.stateObject ? oldTableOpts.stateObject.actualEntriesPerPageCount : null,
            pageBeforeSearch: oldTableOpts && oldTableOpts.stateObject ? oldTableOpts.stateObject.pageBeforeSearch : null,
            entriesPerPageCountBeforeSearch: oldTableOpts && oldTableOpts.stateObject ? oldTableOpts.stateObject.entriesPerPageCountBeforeSearch : null
        };
        this.tables[newTableOpts.id] = newTableOpts;
    };
    ///////////////////////
    // UPDATE TABLE DATA //
    ///////////////////////
    TplTableService.prototype.setColumns = function (tableId, columns) {
        var table = this.tables[tableId];
        if (table) {
            table.setColumns(columns);
        }
    };
    TplTableService.prototype.setEntries = function (tableId, entries) {
        var table = this.tables[tableId];
        if (table) {
            table.setEntries(entries);
        }
    };
    TplTableService.prototype.setEntrieValuesOrder = function (tableId, entrieValuesOrder) {
        var table = this.tables[tableId];
        if (table) {
            table.setEntrieValuesOrder(entrieValuesOrder);
        }
    };
    TplTableService.prototype.setPageCount = function (tableId, pageCount) {
        var table = this.tables[tableId];
        if (table) {
            table.setPageCount(pageCount);
        }
    };
    ///////////////////////////
    // END UPDATE TABLE DATA //
    ///////////////////////////
    ////////////////////////////////
    // STATE SAVING AND RESTORING //
    ////////////////////////////////
    TplTableService.prototype.setStateBeforeDetail = function (id, state) {
        this.tables[id].stateObject.actualPage = state.actualPage;
        this.tables[id].stateObject.actualSearch = state.actualSearch;
        this.tables[id].stateObject.actualEntriesPerPageCount = state.actualEntriesPerPageCount;
    };
    TplTableService.prototype.getStateBeforeDetail = function (id) {
        if (!id || !this.tables[id]) {
            return null;
        }
        return {
            actualPage: this.tables[id].stateObject ? this.tables[id].stateObject.actualPage : null,
            actualSearch: this.tables[id].stateObject ? this.tables[id].stateObject.actualSearch : '',
            actualEntriesPerPageCount: this.tables[id].stateObject ? this.tables[id].stateObject.actualEntriesPerPageCount : null
        };
    };
    TplTableService.prototype.setStateBeforeSearch = function (id, stateBeforeSearch) {
        this.tables[id].stateObject.pageBeforeSearch = stateBeforeSearch.pageBeforeSearch;
        this.tables[id].stateObject.entriesPerPageCountBeforeSearch = stateBeforeSearch.entriesPerPageCountBeforeSearch;
    };
    TplTableService.prototype.getStateBeforeSearch = function (id) {
        if (!id || !this.tables[id]) {
            return null;
        }
        return {
            pageBeforeSearch: this.tables[id].stateObject ? this.tables[id].stateObject.pageBeforeSearch : null,
            entriesPerPageCountBeforeSearch: this.tables[id].stateObject ? this.tables[id].stateObject.entriesPerPageCountBeforeSearch : null
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