angular.module('promise-queue', [])
  .factory('PromiseQueue', ['$q', function($q) {

    var PromiseQueue = function (){
      this._queue = [];
      this._pause = false;
    }

    /**
     * Adds a function to the queue. It optionally accepts an array of functions
     * @name PromiseQueue#add
     * @param {function} func function OR array of functions
     * @returns {undefined}
     */
    PromiseQueue.prototype.add = function(func, instant) {
      var instant = instant || false;

      if(Array.isArray(func)) {
        this._queue = this._queue.concat(func);
      }else if(typeof func === 'function') {

        if(instant){
          this._queue.unshift(func);
        } else {
          this._queue.push(func);
        }

      }else{
        throw new Error('No functions provided');
      }

      return this;

    };

    /**
     * Starts the queue
     *
     * @name PromiseQueue#start
     * @returns {undefined}
     */
    PromiseQueue.prototype.start = function() {
      this._pause = false;
      this.next();

      return this;
    };

    /**
     * Drains the queue
     * The queue will be emptied. Any function currently in progress will be allowed to finish.
     *
     * @name PromiseQueue#play
     * @returns {undefined}
     */
    PromiseQueue.prototype.drain = function() {
      this._queue = [];

      return this;
    };

    /**
     * Instant
     * Puts the included function in the front of the queue
     *
     * @name PromiseQueue#instant
      * @param {function} func function OR array of functions
     * @returns {undefined}
     */
    PromiseQueue.prototype.instant = function(func) {
      this.add(func, true);

      return this;
    };

    /**
     * Remove
     * Compares the provided function with all functions in the queue and removes them
     *
     * @name PromiseQueue#remove
      * @param {function} func function OR array of functions
     * @returns {undefined}
     */
    PromiseQueue.prototype.remove = function(func) {
      for(var i = 0; i < this._queue.length; i++) {
        if(func === this._queue[i]) {
          this._queue.splice(i, 1);
        }
      }

      return this;
    };

    /**
     * Pauses the queue
     *
     * @name PromiseQueue#pause
     * @returns {undefined}
     */
    PromiseQueue.prototype.pause = function() {
      this._pause = true;

      return this;
    };

    /**
     * Recursive function that wraps the next function in the queue in a promise and invokes it.
     * The next function will not be invoked if the queue has been paused.
     * The queue will loop to the first function once it has reached the end of the queue
     *
     * @name PromiseQueue#next
     * @returns {undefined}
     */
    PromiseQueue.prototype.next = function() {
      var self = this;

      if(self._pause === true) return;
      if(self._queue.length === 0) return;

      var func = self._queue.shift();

      promisify(func)
        .then(function() {
          self.next();
        })

    };

    // Utility function that creates a new deferred
    // and provides an anonymous function that resolves the deferred
    // as the first argument of the provided function
    function promisify(func) {
      var deferred = $q.defer();

      func(function(){
        deferred.resolve();
      });

      return deferred.promise;
    }

    return PromiseQueue;


  }]);