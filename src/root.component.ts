import './tpl-table.component.css';

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
export class RootComponent implements AfterViewInit, OnInit {
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
