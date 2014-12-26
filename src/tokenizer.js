'use strict';

var _ = require('lodash');

function validateTransition (transition) {
  if (!transition.test || transition.test.toString().substring(0, 2) !== '/^') {
    throw new Error('Transition must provide a `test` regular expression beginning with a start-of-line anchor `^`');
  }

  if (!transition.value || transition.value.toString().substring(0, 2) !== '/^') {
    throw new Error('Transition must provide a `value` regular expression beginning with a start-of-line anchor `^`');
  }
}

function Tokenizer () {
  this.transitions = {};
  this.resetState();
}

Tokenizer.prototype = {
  resetState: function () {
    this.state = 'none';
  },

  addTransition: function (from, to, transition) {
    validateTransition(transition);
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
    if (!match) {
      throw new Error('Transition from `' + this.state + '` to `' + transition.state + '` failed to match ' + transition.value.toString() + ' against ' + JSON.stringify(this.str));
    }

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
