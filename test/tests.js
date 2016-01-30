'use strict';

const chai = require('chai');
const assert = require('chai').assert;
const Blog = require('../lib/app.js');
const Helpers = require('../lib/helpers.js');


const foo = 'bar';

describe('the first test', function() {
  it('should pass if foo is a string', function(){
    assert.typeOf(foo, 'string', 'foo is a string!');    
  });
});
