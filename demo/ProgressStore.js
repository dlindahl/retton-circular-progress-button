'use strict';

var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

function ProgressStore() {
  EventEmitter.call(this);
  this.reset();
}

function simulateAsync(store, currentStep, totalDuration, result) {
  var step = Math.random() * 1000;
  currentStep = currentStep + step;
  if(currentStep > totalDuration) {
    store.loading = false;
    store.progress = 1;
    store.result = result;
    store.emitChange();
    return;
  } else {
    store.progress = currentStep / totalDuration;
    store.emitChange();
  }
  setTimeout(function() {
    simulateAsync(store, currentStep, totalDuration, result);
  }, step);
}

ProgressStore.prototype = assign({}, EventEmitter.prototype, {
  getState: function() {
    return {
      loading: this.loading,
      result: this.result,
      progress: this.progress
    };
  },
  emitChange: function() {
    this.emit('change');
  },
  reset: function() {
    this.loading = false;
    this.progress = 0;
    this.result = 'INDETERMINATE';
    this.emitChange();
  },
  simulate: function(totalDuration, result) {
    if(this.loading) {
      throw new Error('ProgressStore is already simulating a process');
    }
    this.loading = true;
    this.progress = 0;
    this.emitChange();
    simulateAsync(this, 0, totalDuration, result);
  }
});

module.exports = ProgressStore;
