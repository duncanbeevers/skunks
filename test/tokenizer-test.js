'use strict';

var Tokenizer = require('../src/tokenizer');
var _ = require('lodash');
var expect = require('expect.js');

describe('tokenizer', function () {
  describe('tokenizing single tag', function () {
    beforeEach(function () {
      this.tokens = Tokenizer.process('<a href="#" disabled>Click</a><br/>');
    });

    var expectedTokens = [
      { type: 'tag open', value: 'a' },
      { type: 'attribute name', value: 'href' },
      { type: 'attribute value', value: '#' },
      { type: 'attribute name', value: 'disabled' },
      { type: 'text', value: 'Click' },
      { type: 'tag close', value: 'a' },
      { type: 'tag', value: 'br' }
    ];

    _.each(expectedTokens, function (expectedToken, i) {
      it('should produce token ' + i + ' ' + JSON.stringify(expectedToken), (function () {
        return function () {
          var expectedToken = expectedTokens[i];
          var token = this.tokens[i];

          expect(token.type).to.equal(expectedToken.type);
          expect(token.value).to.equal(expectedToken.value);
        };
      }(i)));
    });
  });

  // it('should recognize opening angle bracket', function () {
  //   var tokens = Tokenizer.process('<a href="#" disabled>Click</a><br/>');
  //   var expectedTokens = [
  //     { type: 'tag open', value: 'a' },
  //     { type: 'attribute name', value: 'href' },
  //     { type: 'attribute value', value: '#' },
  //     { type: 'attribute name', value: 'disabled' },
  //     { type: 'text', value: 'Click' },
  //     { type: 'tag close', value: 'a' },
  //     { type: 'tag', value: 'br' }
  //   ];

  //   _.each(_.zip(tokens, expectedTokens), function (pair) {
  //     var token = pair[0] || {};
  //     var expectedToken = pair[1];

  //     expect(token.type).to.equal(expectedToken.type);
  //     expect(token.value).to.equal(expectedToken.value);
  //   });
  // });
});
