import './tpl-table.component.css';

import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { TplTableCallback, TplTableColumnContentType, TplTableOptions, TplTablePageChangeModel, TplTablePageSizeChangeModel, TplTableSearchChangeModel } from './interfaces';
import { TplTableComponent } from './tpl-table.component';

@Component({
  selector: 'root',
  template: `
    <tpl-table [tplTableOptions]="options" (searchChange)="tableSearchChange($event)" (pageChange)="tablePageChange($event)" (pageSizeChange)="tablePageSizeChange($event)"></tpl-table>
  `,
  directives: [TplTableComponent]
})
export class RootComponent implements AfterViewInit, OnDestroy, OnInit {
  options: TplTableOptions;

  private deleteSubscription: Subscription;
  private inlineEditSubscription: Subscription;
  private rowClickSubscription: Subscription;

  @ViewChild(TplTableComponent)
  private tplTableComponent: TplTableComponent;

  ngOnInit() {
    this.options = {
      id: 'tableName',
      initialColumns: [
        {
          name: 'Vorname',
          translateColumn: true,
          editable: true
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
      initialPageCount: 6,
      enableSearch: true,
      loading: true
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

      if (this.tplTableComponent.inlineCellEdit$) {
        this.inlineEditSubscription = this.tplTableComponent
          .inlineCellEdit$
          .subscribe(data => {
            console.log(data);
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

    if (this.inlineEditSubscription) {
      this.inlineEditSubscription.unsubscribe();
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
