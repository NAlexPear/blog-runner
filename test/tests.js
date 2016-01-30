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

// describe('Helpers.reader()', () => {
//   it('should throw an error if no target file is present', () => {
//
//     function cb(){ console.log('reader data passed through')};
//     assert.throws(Helpers.reader('./fake/path/to/file.txt', cb), Error, 'reader() throws an Error for invalid paths');
//
//   });
// });

describe('Helpers.includes()', () => {
  const path = (__dirname + '/example/_includes');
  const output = Helpers.includes(path);

  it('should return an Object if given a valid path', () => {
    assert.isObject(output);
  });

  it('should assign key names identical to filenames in _includes directory', () => {
    const names = ['disqus','extra','foot','head','nav','postnav'];
    const outputNames = Object.keys(output);
    var i = 0;
    outputNames.forEach(name => {
      assert.equal(name, names[i]);
      i++;
    });
  });

});
