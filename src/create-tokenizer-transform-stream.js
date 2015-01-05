'use strict';

function createTokenizerTransformStream (tokenizer) {
  var stream = require('stream').Transform({ objectMode: true });

  stream._transform = function (chunk, enc, done) {
    tokenizer.push(chunk);

    function onNextToken (err, token) {
      if (token) {
        return stream.push(token);
      }
    }

    while (true) {
      if (!tokenizer.nextToken(onNextToken, { eager: true })) {
        break;
      }
    }

    done();
  };

  stream._flush = function (done) {
    function onNextToken (err, token) {
      if (err) {
        done(err);
      }

      if (token) {
        return stream.push(token);
      }
    }

    while (true) {
      if (!tokenizer.nextToken(onNextToken)) {
        break;
      }
    }

    done();
  };

  return stream;
}

module.exports = createTokenizerTransformStream;
