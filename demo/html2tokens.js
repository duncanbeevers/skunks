'use strict';

var Tokenizer = require('../src/html-tokenizer');
var tokenizer = new Tokenizer();

var createTokenizerTransformStream = require('../src/create-tokenizer-transform-stream');
var transformStream = createTokenizerTransformStream(tokenizer);

// Transform token objects to JSON
var JSONStream = require('JSONStream');

process.stdin
  .pipe(transformStream)
  .pipe(JSONStream.stringify())
  .pipe(process.stdout);
