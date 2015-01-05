'use strict';

var _ = require('lodash');
var HTMLTokenizer = require('./html-tokenizer');

var tagOpenToAttributeName = {
  test: /^\s+/,
  state: 'attribute name',
  value: /^\s+([a-z\-:\.]+)/
};

function AngularTokenizer () {
  HTMLTokenizer.apply(this, arguments);

  _.each(AngularTokenizer.transitions, function (transition) {
    this.addTransition.apply(this, transition);
  }, this);
}

AngularTokenizer.transitions = [
  [ 'tag open', tagOpenToAttributeName ]
];

AngularTokenizer.prototype = HTMLTokenizer.prototype;

module.exports = AngularTokenizer;
