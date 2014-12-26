'use strict';

var Tokenizer = require('./tokenizer');


var noneToTagOpen = {
  test: /^</,
  value: /^<([^\s]+)/
};

var tagOpenToAttributeName = {
  test: /^\s+/,
  value: /^\s+([a-z\-]+)/
};

var attributeNameToAttributeValue = {
  test: /^=/,
  value: /^="([^"]+)"/
};

var attributeValueToAttributeName = tagOpenToAttributeName;

var attributeNameToText = {
  test: /^>/,
  value: /^>([^<]+)/
};

var textToTagClose = {
  test: /^<\//,
  value: /^<\/([^>]+)>/
};

var tagCloseToTag = {
  test: /^<[^>]+\/>/,
  value: /^<([^>]+)\/>/
};

var attributeValueToText = attributeNameToText;

function HTMLTokenizer () {
  Tokenizer.apply(this, arguments);

  this.addTransition('none', 'tag open', noneToTagOpen);
  this.addTransition('tag open', 'attribute name', tagOpenToAttributeName);
  this.addTransition('attribute name', 'attribute value', attributeNameToAttributeValue);
  this.addTransition('attribute name', 'text', attributeNameToText);
  this.addTransition('attribute value', 'attribute name', attributeValueToAttributeName);
  this.addTransition('attribute value', 'text', attributeValueToText);
  this.addTransition('text', 'tag close', textToTagClose);
  this.addTransition('tag close', 'tag', tagCloseToTag);
}

HTMLTokenizer.prototype = Tokenizer.prototype;

module.exports = HTMLTokenizer;
