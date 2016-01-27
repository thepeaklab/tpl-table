(function() {
    'use strict';

    angular
        .module('tpl.table')
        .service('tplTableService', TplTableService);

    function TplTableService() {
      var tables = {};

      var exports = {
        addTable: addTable,
        setStateBeforeDetail: setStateBeforeDetail,
        getStateBeforeDetail: getStateBeforeDetail,
        setStateBeforeSearch: setStateBeforeSearch,
        getStateBeforeSearch: getStateBeforeSearch
      };

      return exports;

      function addTable(newTableOpts) {
        var oldTableOpts = angular.copy(tables[newTableOpts.id]);

        newTableOpts.pageObj = {
          actualPage: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.actualPage : null,
          actualSearch: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.actualSearch : '',
          actualEntriesPerPageCount: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.actualEntriesPerPageCount : null
          pageBeforeSearch: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.pageBeforeSearch : null,
          entriesPerPageCountBeforeSearch: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.entriesPerPageCountBeforeSearch : null
        };
        tables[newTableOpts.id] = newTableOpts;
      }

      function setStateBeforeDetail(id, state) {
        tables[id].pageObj.actualPage = state.actualPage;
        tables[id].pageObj.actualSearch = state.actualSearch;
        tables[id].pageObj.actualEntriesPerPageCount = state.actualEntriesPerPageCount;
      }

      function getStateBeforeDetail(id) {
        if (!id || !tables[id]) {
          return null;
        }
        return {
          actualPage: tables[id].pageObj ? tables[id].pageObj.actualPage : null,
          actualSearch: tables[id].pageObj ? tables[id].pageObj.actualSearch : '',
          actualEntriesPerPageCount: tables[id].pageObj ? tables[id].pageObj.actualEntriesPerPageCount : null
        };
      }

      function setStateBeforeSearch(id, stateBeforeSearch) {
        tables[id].pageObj.pageBeforeSearch = stateBeforeSearch.pageBeforeSearch;
        tables[id].pageObj.entriesPerPageCountBeforeSearch = stateBeforeSearch.entriesPerPageCountBeforeSearch;
      }

      function getStateBeforeSearch(id) {
        if (!id || !tables[id]) {
          return null;
        }
        return {
          pageBeforeSearch: tables[id].pageObj ? tables[id].pageObj.pageBeforeSearch : null,
          entriesPerPageCountBeforeSearch: tables[id].pageObj ? tables[id].pageObj.entriesPerPageCountBeforeSearch : null
        };
      }
    }
})();
