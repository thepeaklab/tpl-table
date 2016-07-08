# Setup

## Prerequisites
* NodeJS (works with version 4.4.5)
* NPM (works with version 3.9.2)

### Libraries
* @angular/core
* @angular/forms
* @angular/http
* core.js
* lodash
* ng2-translate (depends on @angular/http)
* reflect-metadata
* rxjs
* zone.js

Run the following command in your cli in the root directory of the project.
```
npm run init
```




# Usage

Install via
```
npm i --save 'git+https://stash.thepeaklab.biz/scm/open/tpl-table.git#2.0.0-beta.2'
```

Import via
```
import 'tpl-table';
```

Look at the following example:

```
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { TplTableColumnContentType, TplTableOptions } from 'tpl-table';

@Component({
  selector: 'your-selector',
  template: `
    <tpl-table [tplTableOptions]="options" (searchChange)="tableSearchChange($event)" (pageChange)="tablePageChange($event)" (pageSizeChange)="tablePageSizeChange($event)"></tpl-table>
  `,
  directives: [
    TplTableComponent
  ]
})
export class YourComponent implements AfterViewInit, OnDestroy, OnInit {
  options: TplTableOptions;

  private deleteSubscription: Subscription;
  private rowClickSubscription: Subscription;

  @ViewChild(TplTableComponent)
  private tplTableComponent: TplTableComponent;

  ngOnInit() {
    this.options = {
      id: 'tableName',
      initialColumns: [
        {
          name: 'Vorname',
          translateColumn: true
        }
      ],
      initialEntrieValuesOrder: ['firstname'],
      initialEntries: [
        {
          firstname: 'Max'
        }
      ],
      enableActionsColumn: true,
      enablePagination: true,
      initialPageCount: 1,
      enableSearch: true
    };
  }

  ngAfterViewInit() {
    setTimeout(() => {

      if (this.tplTableComponent.rowClick$) {
        this.rowClickSubscription = this.tplTableComponent
          .rowClick$
          .subscribe(data => {
            console.log('row clicked', data.$index);
          });
      }

      if (this.tplTableComponent.delete$) {
        this.deleteSubscription = this.tplTableComponent
          .delete$
          .subscribe(data => {
            console.log('delete row', data.$index);
          });
      }

    }, 0);

    setTimeout(() => {
      this.options.loading = false;
    }, 2000);
  }

  ngOnDestroy() {
    if (this.rowClickSubscription) {
      this.rowClickSubscription.unsubscribe();
    }

    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }


  ///////////////////////
  // TPL TABLE OUTPUTS //
  ///////////////////////
  tableSearchChange(model: TplTableSearchChangeModel) {
    console.table(model);
  }

  tablePageChange(model: TplTablePageChangeModel) {
    console.table(model);
  }

  tablePageSizeChange(model: TplTablePageSizeChangeModel) {
    console.table(model);
  }
  ///////////////////////////
  // END TPL TABLE OUTPUTS //
  ///////////////////////////
}
```


## TplTableOptions
The tpl table has the following options you can pass via the property binding 'tplTableOptions':
| Option name   | Description   | Type  | Default   | Required  | Two way data binding |
|-------------  |-------------  |------ |---------  |---------- |--------------------- |
| id | unique identifier to identify a tpl table instance | string  | - | &#10003; | - |
| initialColumns | initial columns of the table | TplTableColumn[] | - | &#10003; | - |
| initialEntries | initial entries of the table | TplTableRow[] | - | &#10003; | - |
| initialEntrieValuesOrder | initial order of the entry properties | string[] | - | &#10003; | - |
| loading | indicates a pending table update | boolean | false | - | &#10003; |
| enableSearch | toggles the state of the search | boolean | false | - | - |
| searchDebounceTime | milliseconds until search change is triggered | number | 1000 | - | - |
| searchPlaceholderText | placeholder text of the search field | string | 'TABLE_SEARCH' | - | - |
| noDataAvailableText | message to show if table has zero entries | string | 'No Data Available ...' | - | - |
| enableActionsColumn | toggles the state of the actions column | boolean | false | - | - |
| enablePagination | toggles the state of the pagination | boolean | false | - | - |
| entriesPerPageValues | possible values for entries per page | number[] | [10, 25, 50, 100] | - | - |
| defaultEntriesPerPageCount | default number of entries per page | number | 10 | - | - |
| initialPageCount | initial number of pages in the table | number | 1 | - | - |
| colors | colors for customizing the table design | TplTableColors | { primaryColor: '#e8f7fe', secondaryColor: '#004894', primaryFontColor: '#333333', secondaryFontColor: '#ffffff' } | - | - |


## TplTableService
To update the table data, you can use various methods:
| Method name | Description | Parameters |
|-------------|-------------|------------|
| setColumns | method for updating columns | tableId: string, columns: TplTableColumn[] |
| setEntries | method for updating entries | tableId: string, entries: TplTableRow[] |
| setEntrieValuesOrder | method for updating the order of the entry properties | tableId: string, entrieValuesOrder: string[] |
| setPageCount | method for updating the number of pages in the table | tableId: string, pageCount: number |


## TplTableEvents
If you want to respond to events, you can use a mix of outputs and observables:
| Event | Event handling | How to |
|----------|-----------------|--------|
| page change | Output | (onPageChange)="callback({new: number, old: number})" |
| page size change | Output | (onPageSizeChange)="callback({new: number, old: number})" |
| search change | Output | (onSearchChange)="callback({new: string, old: string})" |
| row click | Observable | rowClick$.subscribe((index: number) => {}) |
| add action | Observable | add$.subscribe((index: number) => {}) |
| assign action | Observable | assign$.subscribe((index: number) => {}) |
| confirm action | Observable | confirm$.subscribe((index: number) => {}) |
| delete action | Observable | delete$.subscribe((index: number) => {}) |
| edit action | Observable | edit$.subscribe((index: number) => {}) |


## TplTableColumn:
| Property name | Description | Type | Default | Required |
|---------------|-------------|------|---------|----------|
| name | name of the property | string | - | &#10003; |
| content | type of the property | TplTableColumnContentType (.TEXT or .IMAGE) | TplTableColumnContentType.TEXT | &#x2717; |
| ngIf | toggles rendering of the column | boolean | true | &#x2717; |
| editable | toggles state of the inline edit mode | boolean | false | &#x2717; |
| unit | unknown | any | null | &#x2717; |
| translateColumn | toggles translating of column name | boolean | false | &#x2717; |
| translateValues | toggles translating of column values | boolean | false | &#x2717; |
| translateValuePrefix | prefix for column value translation | string | '' | &#x2717; |
| maxWidth | maximum width for cells with content type 'IMAGE' | string | '250px' | &#x2717; |
| maxHeight | maximum height for cells with content type 'IMAGE' | string | '250px' | &#x2717; |




## TplTableRow:
```
[key: string]: any
```


# TODO

## Angular 2 Customization
- Focus me directive implementation

## Bugs to fix
- Entries per Page label style fix ?
- Catch null values
- Column value filter

## Features
- Order by events
- Do search button
- Custom classes: for example custom select class
- Pass all necessary data to events: page, entriesPerPage, search => not relevant for the component itself
- How should loading work in component context? => not relevant for the component itself
- How should pageCount work in component context? => not relevant for the component itself
- Font option

## Testing
- Implement unit tests

## Build
- CSS integration
