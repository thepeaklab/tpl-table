import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RootComponent } from './root.component';
import { TplTableModule } from './tpl-table.module';

@NgModule({
  imports: [
    BrowserModule,
    TplTableModule
  ],
  declarations: [ RootComponent ],
  bootstrap: [ RootComponent ]
})
export class RootModule {}
