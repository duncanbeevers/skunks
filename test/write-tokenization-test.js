'use strict';

var _ = require('lodash');
var expect = require('expect.js');

function writeTokenizationTest (markup, expectedTokens) {
  describe('processing ' + JSON.stringify(markup), (function (markup, expectedTokens) {
    return function () {
      before(function () {
        this.tokens = this.tokenizer.processSync(markup);
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

module.exports = writeTokenizationTest;
