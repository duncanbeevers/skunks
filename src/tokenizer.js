'use strict';

var _ = require('lodash');

var noneToTagOpen = {
  test: /^</,
  state: 'tag open',
  value: /^<([^\s]+)/
};

var tagOpenToAttributeName = {
  test: /^\s+/,
  state: 'attribute name',
  value: /^\s+([a-z]+)/
};

var attributeNameToAttributeValue = {
  test: /^=/,
  state: 'attribute value',
  value: /^="([^"]+)"/
};

var attributeValueToAttributeName = tagOpenToAttributeName;

var attributeNameToText = {
  test: /^>/,
  state: 'text',
  value: /^>([^<]+)/
};

var textToTagClose = {
  test: /^<\//,
  state: 'tag close',
  value: /^<\/([^>]+)>/
};

var tagCloseToTag = {
  test: /^<[^>]+\/>/,
  state: 'tag',
  value: /^<([^>]+)\/>/
};

var states = {
  'none': [noneToTagOpen],
  'tag open': [tagOpenToAttributeName],
  'attribute name': [attributeNameToAttributeValue, attributeNameToText],
  'attribute value': [attributeValueToAttributeName],
  'text': [textToTagClose],
  'tag close': [tagCloseToTag]
};

function Tokenizer (str) {
  this.str = str;
  this.state = 'none';
}

Tokenizer.prototype = {
  nextToken: function () {
    if (this.str === '') {
      return null;
    }

    var transition = _.find(states[this.state], function (transition) {
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
  }
};

function process (str) {
  var tokenizer = new Tokenizer(str);
  var tokens = [];
  while (true) {
    var token = tokenizer.nextToken();
    if (!token) {
      break;
    }

    tokens.push(token);
  }
  return tokens;
}

module.exports = {
  process: process
};
