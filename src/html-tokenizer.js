'use strict';

var Tokenizer = require('./tokenizer');

var noneToScriptTagOpen = {
  test: /^<script/,
  token: 'tag open',
  value: /^<(script)/
};

var noneToTagOpen = {
  test: /^</,
  token: 'tag open',
  value: /^<([^\s>]+)/
};

var tagOpenToTagOpen = {
  test: /^></,
  token: 'tag open',
  value: /^><([^\s>]+)/
};

var tagOpenToAttributeName = {
  test: /^\s+/,
  token: 'attribute name',
  value: /^\s+([a-z\-:\.]+)/
};

var attributeNameToSingleQuotedAttributeValue = {
  test: /^='/,
  token: 'attribute value',
  value: /^='([^']+)'/
};

var attributeNameToDoubleQuotedAttributeValue = {
  test: /^="/,
  token: 'attribute value',
  value: /^="([^"]+)"/
};

var attributeNameToUnquotedAttributeValue = {
  test: /^=/,
  token: 'attribute value',
  value: /^=([^>\s]+)/
};

var attributeValueToAttributeName = tagOpenToAttributeName;

var attributeNameToText = {
  test: /^>/,
  token: 'text',
  value: /^>([^<]+)/
};

var textToTagClose = {
  test: /^<\//,
  token: 'tag close',
  value: /^<\/([^>]+)>/
};

var tagCloseToTagClose = textToTagClose;

var tagCloseToTag = {
  test: /^<[^>]+\/>/,
  token: 'tag',
  value: /^<([^>]+)\/>/
};

var attributeValueToText = attributeNameToText;

var tagOpenToText = {
  test: /^>[^<]/,
  token: 'text',
  value: /^>([^<]+)/
};

var scriptTagOpenToScriptTagClose = {
  test: /^><\/script>/,
  token: 'tag close',
  value: /^><\/(script)>/
};

var scriptTagOpenToText = {
  test: /^>/,
  token: 'text',
  value: /^>(.*)(<\/script>)/
};

function HTMLTokenizer () {
  Tokenizer.apply(this, arguments);

  this.addTransition('none', 'script tag open', noneToScriptTagOpen);
  this.addTransition('none', 'tag open', noneToTagOpen);

  this.addTransition('script tag open', 'script tag close', scriptTagOpenToScriptTagClose);
  this.addTransition('script tag open', 'text', scriptTagOpenToText);

  this.addTransition('tag open', 'attribute name', tagOpenToAttributeName);
  this.addTransition('tag open', 'tag open', tagOpenToTagOpen);
  this.addTransition('tag open', 'text', tagOpenToText);

  this.addTransition('attribute name', 'attribute value', attributeNameToSingleQuotedAttributeValue);
  this.addTransition('attribute name', 'attribute value', attributeNameToDoubleQuotedAttributeValue);
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
