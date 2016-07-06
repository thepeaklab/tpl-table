# Setup

## Prerequisites
* NodeJS (works with version 4.4.5)
* NPM (works with version 3.9.2)

### Libraries
* @angular/common
* @angular/compiler
* @angular/core
* @angular/platform-browser
* @angular/platform-browser-dynamic
* core.js
* lodash
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
npm i --save git+https://stash.thepeaklab.biz/scm/open/tpl-table.git#2.0.0-beta.2
```

Import via
```
import 'tpl-table';
```

Look at the following example:

```
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { TplTableColumnContentType, TplTableOptions } from 'tpl-table';

@Component({
  selector: 'your-selector',
  template: `
    <tpl-table [tplTableOptions]="options"></tpl-table>
  `,
  directives: [
    TplTableComponent
  ]
})
export class YourComponent implements AfterViewInit, OnInit {
  options: TplTableOptions;

  private deleteSubscription: Subscription;
  private rowClickSubscription: Subscription;

  @ViewChild(TplTableComponent)
  private tplTableComponent: TplTableComponent;

  ngOnInit() {
    this.options = {
      id: 'tableName',
      columns: [
        {
          name: 'firstname',
          content: TplTableColumnContentType.TEXT
        }
      ],
      entrieValuesOrder: ['firstname'],
      entries: [
        {
          firstname: 'Max'
        }
      ],
      pageCount: 10,
      showActionsColumn: true
    };
  }

  ngAfterViewInit() {
    setTimeout(() => {

      this.rowClickSubscription = this.tplTableComponent
        .rowClick$
        .subscribe(data => {
          console.log('row clicked', data.$index);
        });

      this.deleteSubscription = this.tplTableComponent
        .delete$
        .subscribe(data => {
          console.log('delete row', data.$index);
        });

    }, 0);
  }
}
```


## TplTableColumn:
| Property name | Description | Type | Default | Required |
|---------------|-------------|------|---------|----------|
| name | name of the property | string | - | &#10003; |
| content | type of the property | TplTableColumnContentType (.TEXT or .IMAGE) | - | &#10003; |
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


## TplTableOptions
The tpl table has the following options you can pass via the property binding 'tplTableOptions':
| Option name   | Description   | Type  | Default   | Required  |
|-------------  |-------------  |------ |---------  |---------- |
| id | unique identifier to identify a tpl table instance | string  | - | &#10003; |
| columns | columns of the table | TplTableColumn[] | - | &#10003; |
| entries | entries of the table | TplTableRow[] | - | &#10003; |
| entrieValuesOrder | order of the entry properties | string[] | - | &#10003; |
| loading | indicates a pending table update | boolean | false | &#x2717; |
| searchModel | variable for saving the search field value | string | null | &#x2717; |
| searchPlaceholderText | placeholder text of the search field | string | 'TABLE_SEARCH' | &#x2717; |
| noDataAvailableText | message to show if table has zero entries | string | 'No Data Available ...' | &#x2717; |
| showActionsColumn | toggles the visibility of the actions column | boolean | false | &#x2717; |
| showPagination | toggles the visibility of the pagination | boolean | true | &#x2717; |
| paginationModel | variable for saving the pagination value | number | null | &#x2717; |
| pageCount | number of pages in the table, necessary for building the pagination | number | null | &#x2717; |
| entriesPerPageCount | number of entries per page | number | undefined | &#x2717; |
| colors | colors for customizing the table design | TplTableColors | { primaryColor: 'e8f7fe', secondaryColor: '004894', primaryFontColor: '333333', secondaryFontColor: 'ffffff' } | &#x2717; |




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
#index.html

    <script src="bower_components/tpl-table/dist/tpl-table.js"></script>
    <link rel="stylesheet" href="bower_components/tpl-table/dist/tpl-table.css"/>
