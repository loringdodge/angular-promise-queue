angular.module('starter', ['ionic', 'promise-queue'])

  .directive('wordSlide', function(PromiseQueue, $timeout) {

    return {
      restrict: 'E',
      link: function($scope, $element, $attrs) {

        var transitionEvent = whichTransitionEvent();

        var elements = $element.children();

        var useAutoStart = true;
        
        var promiseQueue = new PromiseQueue(useAutoStart);

        var slideIn = function(el){
          return function(done) {
            angular.element(el).addClass('enter').one(transitionEvent, function(e) {
              done();
            });
          }
        }


          var startButton = document.getElementById('start');
          angular.element(startButton).on('click', function() {

              promiseQueue
                .add(slideIn(elements[0]))
                .add(slideIn(elements[1]))
                .add(slideIn(elements[2]))
                .add(slideIn(elements[3]));

              $timeout(function(){
                  promiseQueue
                    .add(slideIn(elements[4]))
                    .add(slideIn(elements[5]))
                    .add(slideIn(elements[6]))
                    .add(slideIn(elements[7]));
              }, 25);
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
