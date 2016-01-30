'use strict';

const glob = require('glob');
const chai = require('chai');
const assert = require('chai').assert;
const Blog = require('../lib/app.js');
const Helpers = require('../lib/helpers.js');


//HELPERS (from helpers.js)
describe('Helpers.reader()', () => {
  it('should return a String for valid data', () => {
    Helpers.reader(__dirname + '/tests.js', (err, data) =>{
      assert.isString(data);
    });
  });
  it('should throw an error for an invalid path', () =>{
    Helpers.reader('./fake/path/to/nowhere', (err, data) => {
      assert.instanceOf(err, Error);
    });
  });
});

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
