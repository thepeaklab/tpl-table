import './tpl-table.component.css';

import { Component, OnInit } from '@angular/core';

import { TplTableOptions } from './interfaces';
import { TplTableComponent } from './tpl-table.component';

@Component({
  selector: 'root',
  template: `
    <tpl-table [tplTableOptions]="options"></tpl-table>
  `,
  directives: [TplTableComponent]
})
export class RootComponent implements OnInit {
  options: TplTableOptions;

  ngOnInit() {
    this.options = {
      id: 'tableName',
      columns: [
        {
          name: 'firstname',
          content: 'text'
        }
      ],
      entrieValuesOrder: ['firstname'],
      entries: [
        {
          firstname: 'Max'
        }
      ]
    }
  }
}
