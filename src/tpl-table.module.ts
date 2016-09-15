import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate/ng2-translate';

import { FocusMeDirective } from './helper';
import { LoadingPointsComponent } from './loading-points';
import { CheckmarkPipe, ToRangePipe } from './pipes';
import { TplTableComponent } from './tpl-table.component';
import { TplTableService } from './tpl-table.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot()
  ],
  declarations: [
    CheckmarkPipe,
    FocusMeDirective,
    LoadingPointsComponent,
    ToRangePipe,
    TplTableComponent
  ],
  providers: [
    TplTableService
  ],
  exports: [ TplTableComponent ]
})
export class TplTableModule {}
