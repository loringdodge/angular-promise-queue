angular.module('starter', ['ionic', 'promise-queue'])

  .directive('wordSlide', function(PromiseQueue) {

    'use strict'

    return {
      restrict: 'E',
      link: function($scope, $element, $attrs) {

        /* Listen for a transition! */
        var transitionEvent = whichTransitionEvent();

        var elements = $element.children();

        var promiseQueue = new PromiseQueue();

        var slideIn = function(el){
          return function(done) {
            angular.element(el).addClass('enter').one(transitionEvent, function(e) {
              done();
            });
          }
        }

        promiseQueue
          .add(slideIn(elements[1]))
          .add(slideIn(elements[2]))
          .add(slideIn(elements[3]))
          .add(slideIn(elements[4]))
          .add(slideIn(elements[5]))
          .add(slideIn(elements[6]))
          .add(slideIn(elements[7]))
          .add(slideIn(elements[8]));

          $element.on('click', function() {
            promiseQueue.start();
          });

          $scope.$on('$destroy', function() {
            console.log("destroy");
          });

        function whichTransitionEvent(){
          var t;
          var el = document.createElement('fakeelement');
          var transitions = {
            'transition':'transitionend',
            'OTransition':'oTransitionEnd',
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
          }

          for(t in transitions){
            if( el.style[t] !== undefined ){
              return transitions[t];
            }
          }
        }

      }
    }

  });
