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

    // copy stateObject of oldTableOpts to newTableOpts if present
    newTableOpts.stateObject = {
      actualPage: oldTableOpts && oldTableOpts.stateObject ? oldTableOpts.stateObject.actualPage : null,
      actualSearch: oldTableOpts && oldTableOpts.stateObject ? oldTableOpts.stateObject.actualSearch : '',
      actualEntriesPerPageCount: oldTableOpts && oldTableOpts.stateObject ? oldTableOpts.stateObject.actualEntriesPerPageCount : null,
      pageBeforeSearch: oldTableOpts && oldTableOpts.stateObject ? oldTableOpts.stateObject.pageBeforeSearch : null,
      entriesPerPageCountBeforeSearch: oldTableOpts && oldTableOpts.stateObject ? oldTableOpts.stateObject.entriesPerPageCountBeforeSearch : null
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
    this.tables[id].stateObject.actualPage = state.actualPage;
    this.tables[id].stateObject.actualSearch = state.actualSearch;
    this.tables[id].stateObject.actualEntriesPerPageCount = state.actualEntriesPerPageCount;
  }

  getStateBeforeDetail(id: string): TplTableStateBeforeDetail {
    if (!id || !this.tables[id]) {
      return null;
    }
    return {
      actualPage: this.tables[id].stateObject ? this.tables[id].stateObject.actualPage : null,
      actualSearch: this.tables[id].stateObject ? this.tables[id].stateObject.actualSearch : '',
      actualEntriesPerPageCount: this.tables[id].stateObject ? this.tables[id].stateObject.actualEntriesPerPageCount : null
    };
  }

  setStateBeforeSearch(id: string, stateBeforeSearch: TplTableStateBeforeSearch) {
    this.tables[id].stateObject.pageBeforeSearch = stateBeforeSearch.pageBeforeSearch;
    this.tables[id].stateObject.entriesPerPageCountBeforeSearch = stateBeforeSearch.entriesPerPageCountBeforeSearch;
  }

  getStateBeforeSearch(id: string): TplTableStateBeforeSearch {
    if (!id || !this.tables[id]) {
      return null;
    }
    return {
      pageBeforeSearch: this.tables[id].stateObject ? this.tables[id].stateObject.pageBeforeSearch : null,
      entriesPerPageCountBeforeSearch: this.tables[id].stateObject ? this.tables[id].stateObject.entriesPerPageCountBeforeSearch : null
    };
  }
  ////////////////////////////////////
  // END STATE SAVING AND RESTORING //
  ////////////////////////////////////

  //////////////////////////
  // END PUBLIC FUNCTIONS //
  //////////////////////////
}
