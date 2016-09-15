import './tpl-table.component.css';
import { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { TplTableOptions, TplTablePageChangeModel, TplTablePageSizeChangeModel, TplTableSearchChangeModel } from './interfaces';
export declare class RootComponent implements AfterViewInit, OnDestroy, OnInit {
    options: TplTableOptions;
    private deleteSubscription;
    private inlineEditSubscription;
    private rowClickSubscription;
    private tplTableComponent;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    tableSearchChange(model: TplTableSearchChangeModel): void;
    tablePageChange(model: TplTablePageChangeModel): void;
    tablePageSizeChange(model: TplTablePageSizeChangeModel): void;
}
