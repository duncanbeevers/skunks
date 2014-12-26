'use strict';

var _ = require('lodash');

function Tokenizer () {
  this.transitions = {};
  this.resetState();
}

Tokenizer.prototype = {
  resetState: function () {
    this.state = 'none';
  },

  addTransition: function (from, to, transition) {
    var transitions = this.transitions[from];
    if (!transitions) {
      transitions = [];
      this.transitions[from] = transitions;
    }

    transitions.push(_.extend({ state: to }, transition));
  },

  nextToken: function () {
    if (this.str === '') {
      this.resetState();
      return null;
    }

    var transition = _.find(this.transitions[this.state], function (transition) {
      return transition.test.test(this.str);
    }, this);

    if (!transition) {
      throw new Error('No valid transition found from `' + this.state + '` for ' + JSON.stringify(this.str));
    }

    var match = this.str.match(transition.value);
    this.state = transition.state;
    this.str = this.str.substring(match[0].length);

    return {
      type: transition.state,
      value: match[1]
    };
  },

  process: function (str) {
    this.resetState();
    this.str = str;

    var tokens = [];
    while (true) {
      var token = this.nextToken();
      if (!token) {
        break;
      }

      tokens.push(token);
    }
    return tokens;

  }
};

module.exports = Tokenizer;
