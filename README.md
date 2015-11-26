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

There are two demos available.

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
