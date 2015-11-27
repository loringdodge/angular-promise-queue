# Angular Promise Queue

As the name implies, it implements a promise queue using the Q library as it's promise dependency.
The Promise Queue accepts either functions or arrays of functions. A new deferred is created for each
function and the first parameter is a function that resolves that deferred.

Angular Promise Queue is an angularized version of [Promise Queue](https://github.com/loringdodge/promise-queue).

Promise Queue is dependent on the ***$q*** module which is an angular version of the [Q promise library](https://github.com/kriskowal/q).
As an alternative to Promise Queue, you could also use the [***queue.js***](https://github.com/kriskowal/q/blob/v1/queue.js) version supported by Q.

The current version of Promise Queue is also modeled after [Bluebird Queue](https://github.com/zackiles/bluebird-queue) by zackiles.

---
#### Bower

```
$ bower install angular-promise-queue
```

---
#### Usage

Include ***promise-queue*** as a dependency to your angular module.

```
angular.module('starter', ['promise-queue'])
```

---
#### Example

There are two demos available, one created with Angular and another with Ionic. Both examples highlight
how to use the Promise Queue to sync CSS transitions to occur one after the other, however, Promise Queue can be
used for any async operation that should occur sequentially.

The first thing to show is the markup. **word-slide** is an angular directive that collects all it's children DOM element and appends
a function to the Promise Queue that adds an 'enter' class to each and thus triggers a transition to translate.
We'll be utilizing a Promise Queue here, the affect we'll be going after is one in which it appears as if all the words are
sliding in one after another.

```
<word-slide>
  <div class="slideLeft">This</div>
  <div class="slideRight">is</div>
  <div class="slideLeft">an</div>
  <div class="slideRight">example</div>
  <div class="slideLeft">of</div>
  <div class="slideRight">a</div>
  <div class="slideLeft">promise</div>
  <div class="slideRight">queue</div>
</word-slide>
```

Before digging too deep into, I'd like to mention that the examples use a polyfill snippet from [David Walsh](https://davidwalsh.name/css-animation-callback) that assists
in determining when a CSS transition has ended so that we can determine when to fire the next transition in the queue.

```
var transitionEvent = whichTransitionEvent();

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
```

Once we've determined which transitionEvent our browser supports, we can create a new instance of Promise Queue:

```
 var promiseQueue = new PromiseQueue();
```

Next, we create a higher-order function that accepts a DOM element as its only parameter and returns
a function that adds an 'enter' class and a listener when the transitionEvent is called. Promise Queue automatically
creates a new deferred when a function is added to the queue and it injects the resolve method of that deferred as
the first parameter of the added function. Yikes, that's a mouthful. More simply, make sure that you reserve the first
parameter of your added function (as **done** if you'd like) and invoke it only when your function's internal process are to finish.

```
var slideIn = function(el){
  return function(done) {
    angular.element(el).addClass('enter').one(transitionEvent, function(e) {
      done();
    });
  }
}
```

The JQlite method **.one()** is used to listen on the the **transitionEvent** because some browsers support more than one transition event
which will result in the callback being executed multiple times. **one()** ensures that it's only called once!

Also, we need to define exactly what adding the class **enter** should do. In this case, when **enter** is added it will trigger a transition
to translate the element left (or right) and bring it to full opacity.

```
.slideLeft {
  transform: translateX(-30px);
  opacity: 0;
}

.slideRight {
  transform: translateX(30px);
  opacity: 0;
}

.slideLeft.enter, .slideRight.enter {
  transform: translateX(0px);
  opacity: 1;
  transition: all 0.3s ease-out;
}
```

After creating the queue and generic callback, it's time to add them to Promise Queue. Note that **elements** is an array of DOM elements to slideIn.

```
promiseQueue
  .add(slideIn(elements[0]))
  .add(slideIn(elements[1]))
  .add(slideIn(elements[2]))
  .add(slideIn(elements[3]))
  .add(slideIn(elements[4]))
  .add(slideIn(elements[5]))
  .add(slideIn(elements[6]))
  .add(slideIn(elements[7]));
```

And the final order of business is to add a click listener to a start button that starts the Promise Queue.

```
var startButton = document.getElementById('start');
angular.element(startButton).on('click', function() {
  promiseQueue.start();
});
```

---
#### Methods

**`.add()`** - Adds a function to the queue. It optionally accepts an array of functions

* @param {function} func function OR array of functions
* @returns {this}

```language-javascript
var promiseQueue = new PromiseQueue();

promiseQueue.add(function(done){
  // something()
  done();
})
```

**`.start()`** - Adds a function to the queue. It optionally accepts an array of functions

* @param {function} func function OR array of functions
* @returns {this}

```language-javascript
var promiseQueue = new PromiseQueue();

promiseQueue
  .add(function(done){
    // something()
    done();
  })
  .add(function(done){
    // something()
    done();
  })
  .start();
```

**`.pause()`** - Pauses the queue

* @returns {this}

```language-javascript
var promiseQueue = new PromiseQueue();

promiseQueue
  .add(function(done){
    // something()
    done();
  })
  .start();

  // later

promiseQueue.pause();
```

**`.instant()`** - Puts the included function in the front of the queue

* @param {function} func The function to be placed at the front of the queue
* @returns {this}

```language-javascript
var promiseQueue = new PromiseQueue();

promiseQueue
  .add(function(done){
    console.log(1);
    done();
  })
  .add(function(done) {
    console.log(2);
    done();
  })

promiseQueue
  .instant(function(done) {
    console.log(3);
    done();
  })
  .start();

  // logs 3 ==> 1 ==> 2
```

**`.drain()`** - The queue will be emptied. Any function currently in progress will be allowed to finish.

* @returns {this}

```language-javascript
var promiseQueue = new PromiseQueue();

promiseQueue.add(function(done){
  // something()
  done();
})

promiseQueue.drain();

var inQueue = promiseQueue._queue.length // 0
```

**`.remove()`** - Compares the provided function with all functions in the queue and removes them

* @param {function} func The function to be removed from the queue
* @returns {this}

```language-javascript
var promiseQueue = new PromiseQueue();

var a = function(done){
  // something()
  done();
});

var b = function(done){
  // something()
  done();
});

promiseQueue.add(a).add(b);

promiseQueue.remove(a);
```
