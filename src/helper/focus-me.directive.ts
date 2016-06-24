import { Directive, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[focusMe]'
})
export class FocusMeDirective implements OnChanges, OnDestroy, OnInit {
  @Input() focusMe: any;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    // attrs.focusMe, value => {
    //   if (value === true) {
    //     setTimeout(() => { // TODO: check if there is a native angular service for that
    //       element[0].focus();
    //       scope[attrs.focusMe] = false;
    //     }, 0);
    //   }
    // };
  }

  ngOnDestroy() {}
}
