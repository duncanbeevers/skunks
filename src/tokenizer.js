'use strict';

// Transform string of markup into array of tokens

var _ = require('lodash');

function validateTransition (transition) {
  if (!transition) {
    throw new Error('Transition must be an object providing a `state` string and a `value` regular expression');
  }

  if (!transition.state) {
    throw new Error('Transition must provide a `state` string to which the tokenizer should transition after matching its `value`');
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
    this.lastToken = null;
  },

  addTransition: function (from, transition) {
    validateTransition(transition);
    var transitions = this.transitions[from];
    if (!transitions) {
      transitions = [];
      this.transitions[from] = transitions;
    }

    transitions.unshift(transition);
  },

  nextToken: function () {
    if (this.str === '') {
      this.resetState();
      return null;
    }

    var transition = _.find(this.transitions[this.state], function (transition) {
      var lastStemMatches = !transition.not || !this.lastStem ||
        transition.not.test(this.lastStem);

      return lastStemMatches && transition.value.test(this.str);
    }, this);

    if (!transition) {
      throw new Error('No transition found from `' + this.state + '` for ' + JSON.stringify(this.str));
    }

    var match = this.str.match(transition.value);
    if (!match) {
      throw new Error('Transition from `' + this.state + '` to `' + transition.state + '` failed to match ' + transition.value.toString() + ' against ' + JSON.stringify(this.str));
    }

    var trim = match[0].length - ((match[2] && match[2].length) || 0);
    this.lastStem = this.str.substring(0, trim);

    // console.log('\nTransition: `' + this.state + '` ➡ `' + transition.state + '`');
    // console.log('  ' + JSON.stringify(this.str) + ' matches ' + transition.value.toString() + ' ' + JSON.stringify(match));
    // console.log('  ' + Array(JSON.stringify(this.lastStem).length).join(' ') + '↑');

    this.state = transition.state;
    this.str = this.str.substring(trim);

    var token = {
      type: transition.token || transition.state,
      value: match[1]
    };

    this.lastToken = token;

    return token;
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
