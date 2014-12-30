'use strict';

var _ = require('lodash');
var Tokenizer = require('./tokenizer');

var noneToScriptTagOpen = {
  token: 'tag open',
  state: 'script tag open',
  value: /^<(script)/
};

var noneToTagOpen = {
  state: 'tag open',
  value: /^<([^\s>]+)>?/
};

var noneToText = {
  state: 'text',
  value: /^([^<]+)/
};

var tagOpenToTagOpen = {
  state: 'tag open',
  value: /^<([^\s>]+)>?/
};

var tagOpenToAttributeName = {
  state: 'attribute name',
  value: /^\s+([a-zA-Z_:][a-zA-Z0-9_:\.\-]*)>?/
};

var attributeNameToSingleQuotedAttributeValue = {
  state: 'attribute value',
  value: /^='([^']*)'+>?/
};

var attributeNameToDoubleQuotedAttributeValue = {
  state: 'attribute value',
  value: /^="([^"]*)"+>?/
};

var attributeNameToUnquotedAttributeValue = {
  state: 'attribute value',
  value: /^=([^>\s]+)>?/
};

var attributeValueToAttributeName = {
  state: 'attribute name',
  value: /^\s*([a-z\-]+)>?/
};

var tagOpenToTagClose = {
  state: 'tag close',
  value: /^<\/([^\s>]+)\s*>/
};

var attributeValueToTagClose = tagOpenToTagClose;

var attributeValueToTagOpen = {
  state: 'tag open',
  value: /^<([^\s>]+)>?/
};

var attributeNameToText = {
  state: 'text',
  value: /^([^<]+)/,
  not: />$/
};

var textToTagClose = {
  state: 'tag close',
  value: /^<\/([^>]+)>/
};

var tagCloseToTagClose = textToTagClose;

var tagCloseToTagOpen = noneToTagOpen;

var tagCloseToTag = {
  state: 'tag',
  value: /^<([^>]+)\/>/
};

var attributeValueToText = attributeNameToText;

var tagOpenToText = {
  state: 'text',
  value: /^([^<]+)/
};

var scriptTagOpenToScriptTagClose = {
  token: 'tag close',
  state: 'script tag close',
  value: /^><\/(script)>/
};

var scriptTagOpenToText = {
  state: 'text',
  value: /^>(.*)(<\/script>)/
};

function HTMLTokenizer () {
  Tokenizer.apply(this, arguments);

  _.each(HTMLTokenizer.transitions, function (transition) {
    this.addTransition.apply(this, transition);
  }, this);
}

HTMLTokenizer.transitions = [
  [ 'none', noneToTagOpen ],
  [ 'none', noneToScriptTagOpen ],
  [ 'none', noneToText ],

  [ 'tag open', tagOpenToText ],
  [ 'tag open', tagOpenToTagOpen ],
  [ 'tag open', tagOpenToTagClose ],
  [ 'tag open', tagOpenToAttributeName ],

  [ 'script tag open', scriptTagOpenToText ],
  [ 'script tag open', scriptTagOpenToScriptTagClose ],

  [ 'attribute name', attributeNameToText ],
  [ 'attribute name', attributeNameToUnquotedAttributeValue ],
  [ 'attribute name', attributeNameToDoubleQuotedAttributeValue ],
  [ 'attribute name', attributeNameToSingleQuotedAttributeValue ],

  [ 'attribute value', attributeValueToAttributeName ],
  [ 'attribute value', attributeValueToText ],
  [ 'attribute value', attributeValueToTagOpen ],
  [ 'attribute value', attributeValueToTagClose ],

  [ 'text', textToTagClose ],

  [ 'tag close', tagCloseToTagOpen ],
  [ 'tag close', tagCloseToTagClose ],
  [ 'tag close', tagCloseToTag ]
];

HTMLTokenizer.prototype = Tokenizer.prototype;

module.exports = HTMLTokenizer;
