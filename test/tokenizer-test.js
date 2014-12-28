'use strict';

var _ = require('lodash');
var expect = require('expect.js');

var Tokenizer = require('../src/tokenizer');

describe('Tokenizer', function () {
  before(function () {
    this.tokenizer = new Tokenizer();
  });

  describe('initial', function () {
    it('should be in `none` state', function () {
      expect(this.tokenizer.state).to.equal('none');
    });
  });

  describe('when adding transitions', function () {
    it('should require a `test`', function () {
      expect(_.bind(function () {
        this.tokenizer.addTransition('none');
      }, this)).to.throwException(/Transition must be an object/);
    });
  });
});
