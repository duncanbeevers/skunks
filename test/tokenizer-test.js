'use strict';

var Tokenizer = require('../src/tokenizer');
var _ = require('lodash');
var expect = require('expect.js');

describe('tokenizer', function () {
  this.tokens = Tokenizer.process('<p title="</p>">x</p>');

  function writeParseTest (markup, expectedTokens) {
    describe('processing ' + markup, (function (markup, expectedTokens) {
      return function () {
        beforeEach(function () {
          this.tokens = Tokenizer.process(markup);
        });

        it('should produce ' + expectedTokens.length + ' tokens', function () {
          expect(this.tokens.length).to.equal(expectedTokens.length);
        });

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
      };
    }(markup, expectedTokens)));
  }

  writeParseTest(
    '<a href="#" disabled>Click</a><br/>',
    [ { type: 'tag open', value: 'a' },
      { type: 'attribute name', value: 'href' },
      { type: 'attribute value', value: '#' },
      { type: 'attribute name', value: 'disabled' },
      { type: 'text', value: 'Click' },
      { type: 'tag close', value: 'a' },
      { type: 'tag', value: 'br' }
    ]);

  writeParseTest(
    '<p title="</p>">x</p>',
    [ { type: 'tag open', value: 'p' },
      { type: 'attribute name', value: 'title' },
      { type: 'attribute value', value: '</p>' },
      { type: 'text', value: 'x' },
      { type: 'tag close', value: 'p' }
    ]);

});
