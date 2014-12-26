'use strict';

var Tokenizer = require('./tokenizer');


var noneToTagOpen = {
  test: /^</,
  value: /^<([^\s>]+)/
};

var tagOpenToTagOpen = {
  test: /^></,
  value: /^><([^\s>]+)/
};

var tagOpenToAttributeName = {
  test: /^\s+/,
  value: /^\s+([a-z\-:\.]+)/
};

var attributeNameToSingleQuotedAttributeValue = {
  test: /^='/,
  value: /^='([^']+)'/
};

var attributeNameToDoubleQuotedAttributeValue = {
  test: /^="/,
  value: /^="([^"]+)"/
};

var attributeNameToUnquotedAttributeValue = {
  test: /^=/,
  value: /^=([^>\s]+)/
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

var tagCloseToTagClose = textToTagClose;

var tagCloseToTag = {
  test: /^<[^>]+\/>/,
  value: /^<([^>]+)\/>/
};

var attributeValueToText = attributeNameToText;

var tagOpenToText = {
  test: /^>[^<]/,
  value: /^>([^<]+)/
};

function HTMLTokenizer () {
  Tokenizer.apply(this, arguments);

  this.addTransition('none', 'tag open', noneToTagOpen);
  this.addTransition('tag open', 'attribute name', tagOpenToAttributeName);
  this.addTransition('tag open', 'tag open', tagOpenToTagOpen);
  this.addTransition('tag open', 'text', tagOpenToText);
  this.addTransition('attribute name', 'attribute value', attributeNameToSingleQuotedAttributeValue);
  this.addTransition('attribute name', 'attribute value', attributeNameToDoubleQuotedAttributeValue);
  // Unquoted attributes are hardest, so check them last
  this.addTransition('attribute name', 'attribute value', attributeNameToUnquotedAttributeValue);
  this.addTransition('attribute name', 'text', attributeNameToText);
  this.addTransition('attribute value', 'attribute name', attributeValueToAttributeName);
  this.addTransition('attribute value', 'text', attributeValueToText);
  this.addTransition('text', 'tag close', textToTagClose);
  this.addTransition('tag close', 'tag', tagCloseToTag);
  this.addTransition('tag close', 'tag close', tagCloseToTagClose);
}

HTMLTokenizer.prototype = Tokenizer.prototype;

module.exports = HTMLTokenizer;
