"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var LoadingPointsComponent = (function () {
    function LoadingPointsComponent() {
    }
    LoadingPointsComponent = __decorate([
        core_1.Component({
            selector: 'loading-points',
            template: "\n    <div class=\"loading-points\">\n      <div id=\"rect3\" class=\"rect\"></div>\n      <div id=\"rect2\" class=\"rect\"></div>\n      <div id=\"rect1\" class=\"rect\"></div>\n    </div>\n  ",
            styles: [
                "\n      .loading-points {\n        display: block;\n        width: 30px;\n        margin: auto;\n      }\n\n      @-webkit-keyframes loading-rect {\n        0% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }\n        50% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }\n        75% { -webkit-transform: scaleY(0) scaleX(0); opacity: .4; }\n        100% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }\n      }\n      @-moz-keyframes loading-rect {\n        0% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }\n        50% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }\n        75% { -webkit-transform: scaleY(0) scaleX(0); opacity: .4; }\n        100% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }\n      }\n      @-o-keyframes loading-rect {\n        0% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }\n        50% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }\n        75% { -webkit-transform: scaleY(0) scaleX(0); opacity: .4; }\n        100% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }\n      }\n      @keyframes loading-rect {\n        0% {-webkit-transform: scaleY(1) scaleX(1);-moz-transform: scaleY(1) scaleX(1);-ms-transform: scaleY(1) scaleX(1);transform: scaleY(1) scaleX(1); opacity: 1; }\n        50% {-webkit-transform: scaleY(1) scaleX(1);-moz-transform: scaleY(1) scaleX(1);-ms-transform: scaleY(1) scaleX(1);transform: scaleY(1) scaleX(1); opacity: 1; }\n        75% {-webkit-transform: scaleY(0) scaleX(0);-moz-transform: scaleY(0) scaleX(0);-ms-transform: scaleY(0) scaleX(0);transform: scaleY(0) scaleX(0); opacity: .4; }\n        100% {-webkit-transform: scaleY(1) scaleX(1);-moz-transform: scaleY(1) scaleX(1);-ms-transform: scaleY(1) scaleX(1);transform: scaleY(1) scaleX(1); opacity: 1;}\n      }\n\n      div.rect {\n        height: 6px;\n        width: 6px;\n        border-radius: 1px;\n        margin: 2px;\n        background-color: #ccc;\n        float: left;\n        -webkit-animation: loading-rect 1s infinite linear;\n        -moz-animation: loading-rect 1s infinite linear;\n        -o-animation: loading-rect 1s infinite linear;\n        animation: loading-rect 1s infinite linear;\n      }\n\n      div#rect3 {\n        -webkit-animation-delay: -0.4s;\n        -moz-animation-delay: -0.4s;\n        -o-animation-delay: -0.4s;\n        animation-delay: -0.4s;\n      }\n      div#rect2 {\n        -webkit-animation-delay: -0.2s;\n        -moz-animation-delay: -0.2s;\n        -o-animation-delay: -0.2s;\n        animation-delay: -0.2s;\n      }\n      div#rect1 {\n        -webkit-animation-delay: 0s;\n        -moz-animation-delay: 0s;\n        -o-animation-delay: 0s;\n        animation-delay: 0s;\n      }\n    "
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], LoadingPointsComponent);
    return LoadingPointsComponent;
}());
exports.LoadingPointsComponent = LoadingPointsComponent;
//# sourceMappingURL=loading-points.component.js.map