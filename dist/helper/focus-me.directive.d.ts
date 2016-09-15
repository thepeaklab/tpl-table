import { ElementRef, OnChanges, SimpleChange } from '@angular/core';
export declare class FocusMeDirective implements OnChanges {
    focusMe: any;
    private el;
    constructor(el: ElementRef);
    ngOnChanges(changes: {
        [propertyName: string]: SimpleChange;
    }): void;
}
