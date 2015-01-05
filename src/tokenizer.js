'use strict';

var verbose = false;
var enforceTransitionObjectIdentity = false;

// Transform string of markup into array of tokens

var _ = require('lodash');

// Transitions must be well-formed.
// Validation is primarily for programmer-happiness.
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
  this.transitionIds = {};
  this.resetState();
}

Tokenizer.prototype = {
  resetState: function () {
    this.state = 'none';
    this.lastStem = '';
    this.str = '';
  },

  addTransition: function (from, transition) {
    validateTransition(transition);

    if (enforceTransitionObjectIdentity) {
      if (!transition.id) {
        transition.id = [
          transition.value.toString(),
          transition.state,
          transition.token || '',
          transition.not ? transition.not.toString() : ''
        ].join(':');
      }

      if (this.transitionIds[transition.id] && this.transitionIds[transition.id] !== transition) {
        throw new Error('Failed to add transition from `' + from + '` to `' + transition.state + '` identical transition already exists ' + JSON.stringify(this.transitionIds[transition.id]));
      }

      this.transitionIds[transition.id] = transition;
    }

    if (!transition.from) {
      transition.from = [];
    }

    transition.from.push(from);

    var transitions = this.transitions[from];
    if (!transitions) {
      transitions = [];
      this.transitions[from] = transitions;
    }

    transition.valueString = transition.value.toString();

    transitions.unshift(transition);
  },

  nextToken: function (cb, options) {
    if (this.str === '') {
      return cb(null, null);
    }

    var transition = _.find(this.transitions[this.state], function (transition) {
      var lastStemMatches = !transition.not || !this.lastStem ||
        !transition.not.test(this.lastStem);

      return lastStemMatches && transition.value.test(this.str);
    }, this);

    if (!transition) {
      return cb(new Error('No transition found from `' + this.state + '` for ' + JSON.stringify(this.str)));
    }

    var match = this.str.match(transition.value);
    if (!match) {
      return cb(new Error('Transition from `' + this.state + '` to `' + transition.state + '` failed to match ' + transition.value.toString() + ' against ' + JSON.stringify(this.str)));
    }

    var trim = match[0].length - ((match[2] && match[2].length) || 0);

    if (verbose) {
      console.log('\nTransition: `' + this.state + '` ➡ `' + transition.state + '`');
      console.log('  ' + JSON.stringify(this.str) + ' matches ' + transition.value.toString() + ' ' + JSON.stringify(match));
      console.log('  ' + Array(JSON.stringify(this.lastStem).length).join(' ') + '↑');
    }

    if (options && options.eager && this.str.substring(trim) === '') {
      // Token was recognized, but we may not actually be at the end of the stream.
      // '<a>Click he', 're</a>'
      return cb(null, null);
    }

    this.state = transition.state;
    this.lastStem = this.str.substring(0, trim);
    this.str = this.str.substring(trim);

    var token = {
      type: transition.token || transition.state,
      value: match[1]
    };

    return cb(null, token);
  },

  processSync: function (str) {
    this.resetState();
    this.str = str;

    var tokens = [];

    function onNextToken (err, token) {
      if (err) {
        throw err;
      }

      if (token) {
        return tokens.push(token);
      }
    }

    while (true) {
      if (!this.nextToken(onNextToken, { eager: true })) {
        break;
      }
    }

    this.nextToken(onNextToken);

    return tokens;
  },

  push: function (str) {
    this.str += str;
  }

};

module.exports = Tokenizer;
