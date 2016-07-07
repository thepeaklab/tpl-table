import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { TplTableColumn, TplTableOptions, TplTableRow, TplTableStateBeforeDetail, TplTableStateBeforeSearch } from './interfaces';

@Injectable()
export class TplTableService {
  private tables: { [id: string]: TplTableOptions };

  constructor() {
    this.tables = {};
  }

  //////////////////////
  // PUBLIC FUNCTIONS //
  //////////////////////
  addTable(newTableOpts: TplTableOptions) {
    const oldTableOpts = _.cloneDeep(this.tables[newTableOpts.id]);

    // copy pageObj of oldTableOpts to newTableOpts if present
    newTableOpts.pageObj = {
      actualPage: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.actualPage : null,
      actualSearch: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.actualSearch : '',
      actualEntriesPerPageCount: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.actualEntriesPerPageCount : null,
      pageBeforeSearch: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.pageBeforeSearch : null,
      entriesPerPageCountBeforeSearch: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.entriesPerPageCountBeforeSearch : null
    };

    this.tables[newTableOpts.id] = newTableOpts;
  }

  ///////////////////////
  // UPDATE TABLE DATA //
  ///////////////////////
  setColumns(tableId: string, columns: TplTableColumn[]) {
    let table = this.tables[tableId];
    if (table) {
      table.setColumns(columns);
    }
  }

  setEntries(tableId: string, entries: TplTableRow[]) {
    let table = this.tables[tableId];
    if (table) {
      table.setEntries(entries);
    }
  }

  setEntrieValuesOrder(tableId: string, entrieValuesOrder: string[]) {
    let table = this.tables[tableId];
    if (table) {
      table.setEntrieValuesOrder(entrieValuesOrder);
    }
  }

  setPageCount(tableId: string, pageCount: number) {
    let table = this.tables[tableId];
    if (table) {
      table.setPageCount(pageCount);
    }
  }
  ///////////////////////////
  // END UPDATE TABLE DATA //
  ///////////////////////////

  ////////////////////////////////
  // STATE SAVING AND RESTORING //
  ////////////////////////////////
  setStateBeforeDetail(id: string, state: TplTableStateBeforeDetail) {
    this.tables[id].pageObj.actualPage = state.actualPage;
    this.tables[id].pageObj.actualSearch = state.actualSearch;
    this.tables[id].pageObj.actualEntriesPerPageCount = state.actualEntriesPerPageCount;
  }

  getStateBeforeDetail(id: string): TplTableStateBeforeDetail {
    if (!id || !this.tables[id]) {
      return null;
    }
    return {
      actualPage: this.tables[id].pageObj ? this.tables[id].pageObj.actualPage : null,
      actualSearch: this.tables[id].pageObj ? this.tables[id].pageObj.actualSearch : '',
      actualEntriesPerPageCount: this.tables[id].pageObj ? this.tables[id].pageObj.actualEntriesPerPageCount : null
    };
  }

  setStateBeforeSearch(id: string, stateBeforeSearch: TplTableStateBeforeSearch) {
    this.tables[id].pageObj.pageBeforeSearch = stateBeforeSearch.pageBeforeSearch;
    this.tables[id].pageObj.entriesPerPageCountBeforeSearch = stateBeforeSearch.entriesPerPageCountBeforeSearch;
  }

  getStateBeforeSearch(id: string): TplTableStateBeforeSearch {
    if (!id || !this.tables[id]) {
      return null;
    }
    return {
      pageBeforeSearch: this.tables[id].pageObj ? this.tables[id].pageObj.pageBeforeSearch : null,
      entriesPerPageCountBeforeSearch: this.tables[id].pageObj ? this.tables[id].pageObj.entriesPerPageCountBeforeSearch : null
    };
  }
  ////////////////////////////////////
  // END STATE SAVING AND RESTORING //
  ////////////////////////////////////

  //////////////////////////
  // END PUBLIC FUNCTIONS //
  //////////////////////////
}
