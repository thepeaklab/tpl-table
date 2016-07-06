import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { TplTableColumn, TplTableOptions, TplTableStateBeforeDetail, TplTableStateBeforeSearch } from './interfaces';

@Injectable()
export class TplTableService {
  private tables: { [id: string]: TplTableOptions };

  constructor() {
    this.tables = {};
  }

  //////////////////////
  // PUBLIC FUNCTIONS //
  //////////////////////
  // TODO: check what is it good for
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

  setColumns(tableId: string, columns: TplTableColumn[]) {
    let table = this.tables[tableId];
    if (table) {
      table.setColumns(columns);
    }
  }

  setPageCount(tableId: string, pageCount: number) {
    let table = this.tables[tableId];
    if (table) {
      table.setPageCount(pageCount);
    }
  }

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
  //////////////////////////
  // END PUBLIC FUNCTIONS //
  //////////////////////////
}
