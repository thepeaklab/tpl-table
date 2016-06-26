import { Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChange } from '@angular/core';

@Directive({
  selector: '[focusMe]'
})
export class FocusMeDirective implements OnChanges {
  @Input() focusMe: any;

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes['focusMe'].currentValue === true) {
      setTimeout(() => { // TODO: check if there is a native angular service for that
        element[0].focus();
        // changes['focusMe'] = false;
      }, 0);
    }
  }
}
