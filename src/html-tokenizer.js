'use strict';

var _ = require('lodash');
var Tokenizer = require('./tokenizer');

var noneToTagOpen = {
  state: 'tag open',
  value: /^<([^\s>]+)>?/
};

var noneToScriptTagOpen = {
  token: 'tag open',
  state: 'script tag open',
  value: /^<(script)/
};

var noneToTagClose = {
  state: 'tag close',
  value: /^<\/([^\s>]+)\s*>/
};

var noneToText = {
  state: 'text',
  value: /^([^<]+)/
};

var tagOpenToText = noneToText;

var tagOpenToTagOpen = noneToTagOpen;

var tagOpenToTagClose = noneToTagClose;

var tagOpenToAttributeName = {
  state: 'attribute name',
  value: /^\s+([a-zA-Z_:][a-zA-Z0-9_:\.\-]*)>?/
};

var scriptTagOpenToText = {
  state: 'text',
  value: /^>(.*)(<\/script>)/
};

var scriptTagOpenToScriptTagClose = {
  token: 'tag close',
  state: 'script tag close',
  value: /^><\/(script)>/
};

var attributeNameToText = {
  state: 'text',
  value: /^([^<]+)/,
  not: />$/
};

var attributeNameToUnquotedAttributeValue = {
  state: 'attribute value',
  value: /^=([^>\s]+)>?/
};

var attributeNameToDoubleQuotedAttributeValue = {
  state: 'attribute value',
  value: /^="([^"]*)"+>?/
};

var attributeNameToSingleQuotedAttributeValue = {
  state: 'attribute value',
  value: /^='([^']*)'+>?/
};

var attributeNameToTagClose = noneToTagClose;

var attributeValueToAttributeName = {
  state: 'attribute name',
  value: /^\s*([a-z\-]+)>?/
};

var attributeValueToText = attributeNameToText;

var attributeValueToTagOpen = noneToTagOpen;

var attributeValueToTagClose = noneToTagClose;

var textToTagOpen = noneToTagOpen;

var textToTagClose = noneToTagClose;

var tagCloseToTagOpen = noneToTagOpen;

var tagCloseToTagClose = noneToTagClose;

var tagCloseToTag = {
  state: 'tag',
  value: /^<([^>]+)\/>/
};

var tagCloseToText = noneToText;

function HTMLTokenizer () {
  Tokenizer.apply(this, arguments);

  _.each(HTMLTokenizer.transitions, function (transition) {
    this.addTransition.apply(this, transition);
  }, this);
}

HTMLTokenizer.transitions = [
  ['none', noneToTagOpen],
  ['none', noneToTagClose],
  ['none', noneToScriptTagOpen],
  ['none', noneToText],

  ['tag open', tagOpenToText],
  ['tag open', tagOpenToTagOpen],
  ['tag open', tagOpenToTagClose],
  ['tag open', tagOpenToAttributeName],

  ['script tag open', scriptTagOpenToText],
  ['script tag open', scriptTagOpenToScriptTagClose],

  ['attribute name', attributeNameToText],
  ['attribute name', attributeNameToUnquotedAttributeValue],
  ['attribute name', attributeNameToDoubleQuotedAttributeValue],
  ['attribute name', attributeNameToSingleQuotedAttributeValue],
  ['attribute name', attributeNameToTagClose],

  ['attribute value', attributeValueToAttributeName],
  ['attribute value', attributeValueToText],
  ['attribute value', attributeValueToTagOpen],
  ['attribute value', attributeValueToTagClose],

  ['text', textToTagOpen],
  ['text', textToTagClose],

  ['tag close', tagCloseToText],
  ['tag close', tagCloseToTagOpen],
  ['tag close', tagCloseToTagClose],
  ['tag close', tagCloseToTag]
];

HTMLTokenizer.prototype = Tokenizer.prototype;

module.exports = HTMLTokenizer;
