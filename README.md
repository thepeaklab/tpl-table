#Bower

    bower install https://stash.thepeaklab.biz/scm/open/tpl-table.git --save

#App.js

    'tpl.table'

#index.html

    <script src="bower_components/tpl-table/dist/tpl-table.js"></script>
    <link rel="stylesheet" href="bower_components/tpl-table/dist/tpl-table.css"/>



#Usage (HTML)

      <tpltable tpltable-options="tableOptions"></tpltable>

#Usage (JS)
Beispielhaftes Options-Objekt:

      tableOptions = {
          id: 'customersTable',
          loading: false,
          searchModel: '',
          paginationModel: 1,
          pageCount: null,
          entriesPerPageCount: 10,
          entries: [],
          entrieValuesOrder: ['number', 'consultantName', 'name', 'street', 'zip', 'city'],
          onRowClick: $scope.onCustomerTableRowClick,
          columns: [
              {
                name: 'Kunden-Nr.',
                editable: false
              },
              {
                name: 'Berater',
                editable: false
              },
              {
                name: 'Name, Vorname',
                editable: true
              },
              {
                name: 'Straße',
                editable: true
              },
              {
                name: 'Postleitzahl',
                editable: true
              },
              {
                name: 'Ort',
                editable: true
              }
          ],
      }

Sowohl 'entries' als auch 'pageCount' sollten nachdem die Daten Verfügbar sind (z.B. nach empfangen einer Antwort von
einem entsprechenden Service) dynamisch gesetzt werden.

