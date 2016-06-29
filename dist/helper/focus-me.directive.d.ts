import { OnChanges, SimpleChange } from '@angular/core';
export declare class FocusMeDirective implements OnChanges {
    focusMe: any;
    ngOnChanges(changes: {
        [propertyName: string]: SimpleChange;
    }): void;
}
