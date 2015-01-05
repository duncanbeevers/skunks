'use strict';

var _ = require('lodash');
var expect = require('expect.js');
var async = require('async');

var createTokenizerTransformStream = require('../src/create-tokenizer-transform-stream');

function writeStreamingTokenizationTest (segments, expectedTokens) {
  describe('processing ' + JSON.stringify(segments), (function (segments, expectedTokens) {
    return function () {
      beforeEach(function () {
        var stream = createTokenizerTransformStream(this.tokenizer);
        this.stream = stream;

        var tokens = [];
        this.tokens = tokens;

        stream.on('readable', function () {
          var token = stream.read();

          if (token) {
            tokens.push(token);
          }
        });

        var writeSegments = _.map(segments, function (segment) {
          return function (done) {
            stream.write(segment, done);
          };
        });

        var endStream = _.bind(stream.end, stream);

        // Write the segments to the stream
        async.parallel(writeSegments, endStream);
      });

      it('should produce ' + expectedTokens.length + ' tokens', function () {
        var tokens = this.tokens;
        this.stream.on('finish', function () {
          expect(tokens.length).to.equal(expectedTokens.length);
        });
      });

      _.each(expectedTokens, function (expectedToken, i) {
        it('should produce token ' + i + ' ' + JSON.stringify(expectedToken), (function () {
          return function () {
            var tokens = this.tokens;
            this.stream.on('finish', function () {
              var expectedToken = expectedTokens[i];
              var token = tokens[i];

              expect(token.type).to.equal(expectedToken.type);
              expect(token.value).to.equal(expectedToken.value);
            });
          };
        }(i)));
      });
    };
  }(segments, expectedTokens)));
}

module.exports = writeStreamingTokenizationTest;
