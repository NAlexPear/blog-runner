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

describe('Helpers.writer()', function() {
  it('should overwrite index.html files at the root of each _site directory branch', () => {
    //check index.html files for changes here
  });
});

describe('Helpers.files()', () => {
  const output = Helpers.files(__dirname + '/example')
  it('should return an Object', () => {
    assert.isObject(output);
  });
  it('...with the correct keys', () => {
    const targets = ['includes', 'posts', 'site', 'layouts'];
    const keys = Object.keys(output);
    assert.sameMembers(targets, keys);
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

//MAIN app.js functions
describe('Blog.index()', () => {
  const output = Blog.index(__dirname + '/example');
  it('returns an index array', () => {
    assert.isArray(output);
  });

  it('...with length equal to the number of posts', () => {
    const posts = glob.sync( __dirname + '/example/_posts/*.md');
    assert.equal(output.length, posts.length);
  });
});

describe('Blog.build()', () => {
  it('builds the entire blog!', () => {
    //good luck testing that assertion...
  });
});
