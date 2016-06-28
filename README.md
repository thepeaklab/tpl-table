# Setup
coming soon ...

# Prerequisites
- @angular/common
- @angular/compiler
- @angular/core
- @angular/platform-browser
- @angular/platform-browser-dynamic
- core.js
- lodash
- reflect-metadata
- zone.js




# TODO

## Angular 2 Customization
- Input and output implementation
- Focus me directive implementation
- Remove translate dependency

### Build
- CSS integration

## Testing
- Implement unit tests

## Features
- Order by => out of the scope of this component?
- Automatic set loading => out of the scope of this component?
- Reset search button
- Do search button
- Custom classes: for example custom select class
- Pass all necessary data to events: page, entriesPerPage, search => not relevant for the component itself
- How should loading work in component context? => not relevant for the component itself
- How should pageCount work in component context? => not relevant for the component itself
- Font option

## Bug fixes
- Entries per Page label style fix ?
- Catch null values
- Column value filter




old stuff:

#Bower

    bower install https://stash.thepeaklab.biz/scm/open/tpl-table.git --save

#App.js

    'tpl.table'

#index.html

    <script src="bower_components/tpl-table/dist/tpl-table.js"></script>
    <link rel="stylesheet" href="bower_components/tpl-table/dist/tpl-table.css"/>



#Usage (HTML)

      <tpl-table tpl-table-options="tableOptions"></tpl-table>

#Usage (JS)
Beispielhaftes Options-Objekt:

      tableOptions = {
          id: 'customersTable',
          loading: false,
          noDataAvailableText: ,
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

Einige derOptionen sind optional, wie z.B. loading, noDataAvailableText, onRowClick ...

