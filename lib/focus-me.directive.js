export default class FocusMeDirective {
  constructor($timeout, scopeListenerManager) {
    this.$timeout = $timeout;

    this.scopeListenerManager = scopeListenerManager;
  }
  
  link(scope, element, attrs) {
    this.scopeListenerManager.saveAddListener(scope, scope.$watch(attrs.focusMe, (value) => {
      if(value === true) {
        this.$timeout(() => {
          element[0].focus();
          scope[attrs.focusMe] = false;
        });
      }
    }));
  }
}