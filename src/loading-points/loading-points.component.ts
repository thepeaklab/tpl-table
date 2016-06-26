import { Component } from '@angular/core';

@Component({
  selector: 'loading-points',
  template: `
    <div id="rect3"></div>
    <div id="rect2"></div>
    <div id="rect1"></div>
  `,
  styles: [
    `
    loadingpoints {
      svg {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;

        rect {
          fill: #ccc;
        }
      }

      display: block;
      width: 30px;
      margin: auto;

      div {
        height: 6px;
        width: 6px;
        border-radius: 1px;
        margin: 2px;
        background-color: #ccc;
        float: left;
        -webkit-animation: loading-rect 1s infinite linear;
        -moz-animation: loading-rect 1s infinite linear;
        -o-animation: loading-rect 1s infinite linear;
        animation: loading-rect 1s infinite linear;

        div#rect3 {
          -webkit-animation-delay: -0.4s;
          -moz-animation-delay: -0.4s;
          -o-animation-delay: -0.4s;
          animation-delay: -0.4s;
        }
        div#rect2 {
          -webkit-animation-delay: -0.2s;
          -moz-animation-delay: -0.2s;
          -o-animation-delay: -0.2s;
          animation-delay: -0.2s;
        }
        div#rect1 {
          -webkit-animation-delay: 0s;
          -moz-animation-delay: 0s;
          -o-animation-delay: 0s;
          animation-delay: 0s;
        }

        @-webkit-keyframes loading-rect{
          0% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }
          50% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }
          75% { -webkit-transform: scaleY(0) scaleX(0); opacity: .4; }
          100% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }
        }
        @-moz-keyframes loading-rect{
          0% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }
          50% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }
          75% { -webkit-transform: scaleY(0) scaleX(0); opacity: .4; }
          100% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }
        }
        @-o-keyframes loading-rect{
          0% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }
          50% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }
          75% { -webkit-transform: scaleY(0) scaleX(0); opacity: .4; }
          100% { -webkit-transform: scaleY(1) scaleX(1); opacity: 1; }
        }
        @keyframes loading-rect{
          0% {-webkit-transform: scaleY(1) scaleX(1);-moz-transform: scaleY(1) scaleX(1);-ms-transform: scaleY(1) scaleX(1);transform: scaleY(1) scaleX(1); opacity: 1; }
          50% {-webkit-transform: scaleY(1) scaleX(1);-moz-transform: scaleY(1) scaleX(1);-ms-transform: scaleY(1) scaleX(1);transform: scaleY(1) scaleX(1); opacity: 1; }
          75% {-webkit-transform: scaleY(0) scaleX(0);-moz-transform: scaleY(0) scaleX(0);-ms-transform: scaleY(0) scaleX(0);transform: scaleY(0) scaleX(0); opacity: .4; }
          100% {-webkit-transform: scaleY(1) scaleX(1);-moz-transform: scaleY(1) scaleX(1);-ms-transform: scaleY(1) scaleX(1);transform: scaleY(1) scaleX(1); opacity: 1;}
        }
      }
    }
    `
  ]
})
export class LoadingPointsComponent {}
