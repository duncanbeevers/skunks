'use strict';

var writeStreamingTokenizationTest = require('./write-streaming-tokenization-test');

var Tokenizer = require('../src/tokenizer');

describe('streaming to tokenizer', function () {
  beforeEach(function () {
    var tokenizer = new Tokenizer();
    tokenizer.addTransition('none', {
      state: 'a',
      value: /^(a)/
    });
    tokenizer.addTransition('a', {
      state: 'a',
      value: /^(a)/
    });
    this.tokenizer = tokenizer;
  });

  writeStreamingTokenizationTest([
    'a'
  ], [
    { type: 'a', value: 'a' }
  ]);

  writeStreamingTokenizationTest([
    'aa'
  ], [
    { type: 'a', value: 'a' },
    { type: 'a', value: 'a' }
  ]);

  writeStreamingTokenizationTest([
    'a',
    'a'
  ], [
    { type: 'a', value: 'a' },
    { type: 'a', value: 'a' }
  ]);

  writeStreamingTokenizationTest([
    'a',
    '',
    'a'
  ], [
    { type: 'a', value: 'a' },
    { type: 'a', value: 'a' }
  ]);

});
