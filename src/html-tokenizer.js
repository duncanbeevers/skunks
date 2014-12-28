'use strict';

var _ = require('lodash');
var Tokenizer = require('./tokenizer');

var noneToScriptTagOpen = {
  test: /^<script/,
  token: 'tag open',
  state: 'script tag open',
  value: /^<(script)/
};

var noneToTagOpen = {
  test: /^</,
  state: 'tag open',
  value: /^<([^\s>]+)/
};

var tagOpenToTagOpen = {
  test: /^></,
  state: 'tag open',
  value: /^><([^\s>]+)/
};

var tagOpenToAttributeName = {
  test: /^\s+/,
  state: 'attribute name',
  value: /^\s+([a-z\-:\.]+)/
};

var attributeNameToSingleQuotedAttributeValue = {
  test: /^='/,
  state: 'attribute value',
  value: /^='([^']*)'+/
};

var attributeNameToDoubleQuotedAttributeValue = {
  test: /^="/,
  state: 'attribute value',
  value: /^="([^"]*)"+/
};

var attributeNameToUnquotedAttributeValue = {
  test: /^=/,
  state: 'attribute value',
  value: /^=([^>\s]+)/
};

var attributeValueToAttributeName = {
  test: /^\s*[^>]/,
  state: 'attribute name',
  value: /^\s*([a-z\-:\.]+)/
};

var attributeValueToTagClose = {
  test: /^\s*><\//,
  state: 'tag close',
  value: /^\s*><\/([^\s>]+)\s*>/
};

var attributeValueToTagOpen = {
  test: /^\s*></,
  state: 'tag open',
  value: /^\s*><([^\s>]+)/
};

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

var tagCloseToTagClose = textToTagClose;

var tagCloseToTagOpen = noneToTagOpen;

var tagCloseToTag = {
  test: /^<[^>]+\/>/,
  state: 'tag',
  value: /^<([^>]+)\/>/
};

var attributeValueToText = attributeNameToText;

var tagOpenToText = {
  test: /^>[^<]/,
  state: 'text',
  value: /^>([^<]+)/
};

var scriptTagOpenToScriptTagClose = {
  test: /^><\/script>/,
  token: 'tag close',
  state: 'script tag close',
  value: /^><\/(script)>/
};

var scriptTagOpenToText = {
  test: /^>/,
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

  [ 'tag open', tagOpenToText ],
  [ 'tag open', tagOpenToTagOpen ],
  [ 'tag open', tagOpenToAttributeName ],

  [ 'script tag open', scriptTagOpenToText ],
  [ 'script tag open', scriptTagOpenToScriptTagClose ],

  [ 'attribute name', attributeNameToText ],
  [ 'attribute name', attributeNameToUnquotedAttributeValue ],
  [ 'attribute name', attributeNameToDoubleQuotedAttributeValue ],
  [ 'attribute name', attributeNameToSingleQuotedAttributeValue ],

  [ 'attribute value', attributeValueToText ],
  [ 'attribute value', attributeValueToAttributeName ],
  [ 'attribute value', attributeValueToTagOpen ],
  [ 'attribute value', attributeValueToTagClose ],

  [ 'text', textToTagClose ],

  [ 'tag close', tagCloseToTagOpen ],
  [ 'tag close', tagCloseToTagClose ],
  [ 'tag close', tagCloseToTag ]
];

HTMLTokenizer.prototype = Tokenizer.prototype;

module.exports = HTMLTokenizer;
