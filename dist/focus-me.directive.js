"use strict";
var FocusMeDirective = (function () {
    function FocusMeDirective($timeout, scopeListenerManager) {
        this.scopeListenerManager = scopeListenerManager;
        this.$timeout = $timeout;
    }
    FocusMeDirective.prototype.link = function (scope, element, attrs) {
        var _this = this;
        this.scopeListenerManager.saveAddListener(scope, scope.$watch(attrs.focusMe, function (value) {
            if (value === true) {
                _this.$timeout(function () {
                    element[0].focus();
                    scope[attrs.focusMe] = false;
                });
            }
        }));
    };
    return FocusMeDirective;
}());
exports.FocusMeDirective = FocusMeDirective;
FocusMeDirective.$inject = ['$timeout', 'scopeListenerManager'];
//# sourceMappingURL=focus-me.directive.js.map