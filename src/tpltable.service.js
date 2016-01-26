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
          pageBeforeSearch: oldTableOpts && oldTableOpts.pageObj ? oldTableOpts.pageObj.pageBeforeSearch : null
        };
        tables[newTableOpts.id] = newTableOpts;
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
