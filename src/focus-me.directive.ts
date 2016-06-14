export class FocusMeDirective {
  private scopeListenerManager: any;
  private $timeout: angular.ITimeoutService;

  constructor($timeout: angular.ITimeoutService, scopeListenerManager: any) {
    this.scopeListenerManager = scopeListenerManager;
    this.$timeout = $timeout;
  }

  link(scope: angular.IScope, element: any, attrs: any) {
    this.scopeListenerManager.saveAddListener(scope, scope.$watch(attrs.focusMe, value => {
      if(value === true) {
        this.$timeout(() => {
          element[0].focus();
          scope[attrs.focusMe] = false;
        });
      }
    }));
  }
}
FocusMeDirective.$inject = ['$timeout', 'scopeListenerManager'];
