import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChange } from '@angular/core';

@Directive({
  selector: '[focusMe]'
})
export class FocusMeDirective implements OnChanges {
  @Input() focusMe: any;

  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes['focusMe'].currentValue === true) {
      setTimeout(() => { // TODO: check if there is a native angular service for that
        this.el.focus();
        this.focusMe = false;
      }, 0);
    }
  }
}
