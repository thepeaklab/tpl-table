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

      function addTable(table) {
        // if (tables[table.id]) {
        //   return tables[table.id];
        // }
        tables[table.id] = table;
        tables[table.id].pageObj = {actualPage: null, pageBeforeSearch: null};
        return table;
      }

      function setStateBeforeDetail(id, state) {
        tables[id].pageObj.actualPage = state.actualPage;
        tables[id].pageObj.actualSearch = state.actualSearch;
      }

      function getStateBeforeDetail(id) {
        return {actualPage: tables[id].pageObj.actualPage, actualSearch: tables[id].pageObj.actualSearch};
      }

      function setStateBeforeSearch(id, stateBeforeSearch) {
        tables[id].pageObj.pageBeforeSearch = stateBeforeSearch;
      }

      function getStateBeforeSearch(id) {
        return {pageBeforeSearch: tables[id].pageObj.pageBeforeSearch};
      }
    }
})();
