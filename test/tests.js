'use strict';

const glob = require('glob');
const chai = require('chai');
const assert = require('chai').assert;
const Blog = require('../lib/app.js');
const Helpers = require('../lib/helpers.js');


const foo = 'bar';

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
    const files = glob.sync(path + '/**/*.html');
    const outputNames = Object.keys(output);

    let i = 0;
    outputNames.forEach(name => {
      assert.include(files[i], name);
      i++;
    });
  });

  it('should set HTML content as the property of each _includes key', () => {
    for(let key in output) {
      assert.include(output[key], '</');
    }
  });
});
