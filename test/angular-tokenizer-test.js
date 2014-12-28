'use strict';

var AngularTokenizer = require('../src/angular-tokenizer');
var writeTokenizationTest = require('./write-tokenization-test');

describe('AngularTokenizer', function () {
  before(function () {
    this.tokenizer = new AngularTokenizer();
  });

  writeTokenizationTest('<ng-include src="x"></ng-include>', [
    { type: 'tag open', value: 'ng-include' },
    { type: 'attribute name', value: 'src' },
    { type: 'attribute value', value: 'x' },
    { type: 'tag close', value: 'ng-include' }
  ]);

  writeTokenizationTest('<ng:include src="x"></ng:include>', [
    { type: 'tag open', value: 'ng:include' },
    { type: 'attribute name', value: 'src' },
    { type: 'attribute value', value: 'x' },
    { type: 'tag close', value: 'ng:include' }
  ]);

  writeTokenizationTest('<ng-include src="\'views/partial-notification.html\'"></ng-include><div ng-view=""></div>', [
    { type: 'tag open', value: 'ng-include' },
    { type: 'attribute name', value: 'src' },
    { type: 'attribute value', value: '\'views/partial-notification.html\'' },
    { type: 'tag close', value: 'ng-include' },
    { type: 'tag open', value: 'div' },
    { type: 'attribute name', value: 'ng-view' },
    { type: 'attribute value', value: '' },
    { type: 'tag close', value: 'div' }
  ]);
});
