import './tpl-table.component.css';

import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { TplTableCallback, TplTableColumnContentType, TplTableOptions } from './interfaces';
import { TplTableComponent } from './tpl-table.component';

@Component({
  selector: 'root',
  template: `
    <tpl-table [tplTableOptions]="options"></tpl-table>
  `,
  directives: [TplTableComponent]
})
export class RootComponent implements AfterViewInit, OnDestroy, OnInit {
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
}
