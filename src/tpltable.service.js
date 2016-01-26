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

        tables[newTableOpts.id] = newTableOpts;
        tables[newTableOpts.id].pageObj = {
          actualPage: oldTableOpts.pageObj.actualPage,
          actualSearch: oldTableOpts.pageObj.actualSearch,
          pageBeforeSearch: oldTableOpts.pageObj.pageBeforeSearch
        };
        return newTableOpts;
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
